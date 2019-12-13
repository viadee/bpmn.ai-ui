package de.viadee.bpmnai.ui.backend.service;

import de.viadee.bpmnai.core.configuration.Configuration;
import de.viadee.bpmnai.core.configuration.util.ConfigurationUtils;
import de.viadee.bpmnai.core.exceptions.FaultyConfigurationException;
import de.viadee.bpmnai.core.listener.SparkRunnerListener;
import de.viadee.bpmnai.core.runner.impl.KafkaImportRunner;
import de.viadee.bpmnai.core.runner.impl.KafkaProcessingRunner;
import de.viadee.bpmnai.core.util.BpmnaiVariables;
import de.viadee.bpmnai.ui.backend.configuration.ApplicationConfig;
import de.viadee.bpmnai.ui.backend.service.dto.ConfigFileLocations;
import de.viadee.bpmnai.ui.backend.service.dto.KafkaTestResponse;
import de.viadee.bpmnai.ui.backend.service.dto.ResultPreviewResponse;
import de.viadee.bpmnai.ui.backend.service.dto.RunPipelinePayload;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.PartitionInfo;
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;


public class BpmnAIService {

    private static BpmnAIService instance;
    private final WebsocketService websocketService = WebsocketService.getInstance();

    private ExecutorService executor;

    public static synchronized BpmnAIService getInstance(){
        if(instance == null){
            instance = new BpmnAIService();
        }
        return instance;
    }

    public Configuration getConfig() {
        Configuration configuration = ConfigurationUtils.getInstance().getConfiguration(true, ApplicationConfig.getInstance().getSparkRunnerConfig());
        if (configuration == null) {
            configuration = new Configuration();
        }
        return configuration;
    }

    public Configuration postConfig(Configuration newConfiguration) {
        ConfigurationUtils.getInstance().setConfiguration(newConfiguration);
        ConfigurationUtils.getInstance().writeConfigurationToFile(ApplicationConfig.getInstance().getSparkRunnerConfig());
        Configuration configuration = ConfigurationUtils.getInstance().getConfiguration(ApplicationConfig.getInstance().getSparkRunnerConfig());
        return configuration;
    }

    public ConfigFileLocations getConfigFileLocations() {
        String fileName = ConfigurationUtils.getInstance().getConfigurationFilePath(ApplicationConfig.getInstance().getSparkRunnerConfig());
        ConfigFileLocations fileLocations = new ConfigFileLocations();
        fileLocations.setConfigLocation(fileName);
        fileLocations.setSourceLocation(ApplicationConfig.getInstance().getSparkRunnerConfig().getSourceFolder());
        fileLocations.setTargetLocation(ApplicationConfig.getInstance().getSparkRunnerConfig().getTargetFolder());
        return fileLocations;
    }

    public void cancelRun() {
        try {
            websocketService.broadcastMessage(true, true, "attempt to shutdown executor");
            SparkSession.builder().getOrCreate().close();
            executor.shutdown();
            executor.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            websocketService.broadcastMessage(true, true, "tasks interrupted");
            // Restore interrupted state...
            Thread.currentThread().interrupt();
        } finally {
            if (executor != null) {
                if (!executor.isTerminated()) {
                    websocketService.broadcastMessage(true, true, "cancel non-finished tasks");

                }
                executor.shutdownNow();
                websocketService.broadcastMessage(true, true, "shutdown finished");
                websocketService.broadcastMessage(false, true, "");
            }
        }
    }

    public void runKafkaImportAndConfigGeneration(RunPipelinePayload payload) {
        websocketService.broadcastMessage(true, false, false, "configGeneration", true, "Importing data from Kafka...");
        executor = Executors.newSingleThreadExecutor();
        Runnable worker = () -> {

            //run kafka importer
            //TODO refactor
            String args[] = {"-kb", payload.getKafkaBroker(), "-fd", ApplicationConfig.getInstance().getSparkRunnerConfig().getWorkingDirectory() + "/kafka_import", "-bm", "true", "-dl", payload.getDataLevel(), "-wd", ApplicationConfig.getInstance().getSparkRunnerConfig().getWorkingDirectory()};

            websocketService.broadcastMessage(true, true, "Importing data from Kafka...");

            KafkaImportRunner importRunner = new KafkaImportRunner();
            try {
                importRunner.run(args, new SparkRunnerListener() {
                    @Override
                    public void onProgressUpdate(String message, int tasksDone, int tasksTotal) {
                        if (message == null) {
                            message = "Importing data from Kafka...";
                        }
                        websocketService.broadcastMessage(true, true, message);
                    }

                    @Override
                    public void onFinished(boolean success) {
                        //broadcastMessage(false, true, true, "configGeneration", true, "Configuration has been generated...");
                    }
                });
            } catch (FaultyConfigurationException e) {
                e.printStackTrace();
            }

            //run kafka processing minimal
            //TODO refactor
            String args2[] = {"-fs", ApplicationConfig.getInstance().getSparkRunnerConfig().getWorkingDirectory() + "/kafka_import", "-fd", ApplicationConfig.getInstance().getSparkRunnerConfig().getTargetFolder(), "-d", "|", "-sr", "false", "-dl", payload.getDataLevel(), "-sm", "overwrite", "-of", "parquet", "-wd", ApplicationConfig.getInstance().getSparkRunnerConfig().getWorkingDirectory()};

            websocketService.broadcastMessage(true, true, "Running configuration generation...");

            KafkaProcessingRunner processingRunner = new KafkaProcessingRunner();
            try {
                processingRunner.run(args2, new SparkRunnerListener() {
                    @Override
                    public void onProgressUpdate(String message, int tasksDone, int tasksTotal) {
                        if (message == null) {
                            message = "Running configuration generation...";
                        }
                        websocketService.broadcastMessage(true, true, message);
                    }

                    @Override
                    public void onFinished(boolean success) {
                        websocketService.broadcastMessage(false, true, true, "configGeneration", true, "Configuration has been generated...");
                    }
                });
            } catch (FaultyConfigurationException e) {
                e.printStackTrace();
            }
        };
        executor.submit(worker);
    }

    public void runProcessing(RunPipelinePayload payload) {
        websocketService.broadcastMessage(true, false, false, "runningProcessing", true, "Importing data from Kafka...");
        executor = Executors.newSingleThreadExecutor();
        Runnable worker = () -> {

            //run kafka processing
            String args[] = {"-fs", ApplicationConfig.getInstance().getSparkRunnerConfig().getWorkingDirectory() + "/kafka_import", "-fd", ApplicationConfig.getInstance().getSparkRunnerConfig().getTargetFolder(), "-d", payload.getCsvDelimiter(), "-sr", "false", "-dl", payload.getDataLevel(), "-of", payload.getOutputFormat(), "-wd", ApplicationConfig.getInstance().getSparkRunnerConfig().getWorkingDirectory()};

            websocketService.broadcastMessage(true, true, "Running preprocessing pipeline...");

            KafkaProcessingRunner processingRunner = new KafkaProcessingRunner(ApplicationConfig.getInstance().getSparkRunnerConfig());
            try {
                processingRunner.run(args, new SparkRunnerListener() {
                    @Override
                    public void onProgressUpdate(String message, int tasksDone, int tasksTotal) {
                        if (message == null) {
                            message = "Running preprocessing pipeline...";
                        }
                        websocketService.broadcastMessage(true, true, message);
                    }

                    @Override
                    public void onFinished(boolean success) {
                        websocketService.broadcastMessage(false, true, true, "runningProcessing", true, "Preprocessing pipeline has been completed...");
                    }
                });
            } catch (FaultyConfigurationException e) {
                e.printStackTrace();
            }
        };
        executor.submit(worker);
    }

    public KafkaTestResponse testKafkaConnection(String kafkaBroker) {
        Map<String, List<PartitionInfo>> topics;

        Properties props = new Properties();
        props.put("bootstrap.servers", kafkaBroker);
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        KafkaTestResponse response = new KafkaTestResponse();

        KafkaConsumer<String, String> consumer = new KafkaConsumer(props);
        try {
            topics = consumer.listTopics(Duration.ofMillis(3000));
        } catch (Exception e) {
            response.setMessage("Error connecting to Kafka broker");
            response.setResultCode(500);
            return response;
        } finally {
            consumer.close();
        }

        if (topics.containsKey("processInstance") && topics.containsKey("variableUpdate")) {
            response.setMessage("");
            response.setResultCode(200);
        } else {
            response.setMessage("Connection successful, but did not find the Kafka topics required.");
            response.setResultCode(204);
        }

        return response;
    }

    public ResultPreviewResponse previewResult() throws ParseException {
        SparkSession sparkSession = SparkSession.builder().getOrCreate();
        boolean tableExists = Arrays.asList(sparkSession.sqlContext().tableNames()).contains(BpmnaiVariables.RESULT_PREVIEW_TEMP_TABLE);

        ResultPreviewResponse resultPreviewResponse = new ResultPreviewResponse();

        if(tableExists) {
            Dataset<Row> dataset = sparkSession.sql("select * from " + BpmnaiVariables.RESULT_PREVIEW_TEMP_TABLE);
            List<String> results = dataset.toJSON().collectAsList();

            List<Object> data = new ArrayList<>();

            JSONParser jsonParser = new JSONParser();

            for(String result : results) {
                data.add(jsonParser.parse(result));
            }

            resultPreviewResponse.setData(data.toArray());
            resultPreviewResponse.setHeader(dataset.columns());
        }

        return resultPreviewResponse;
    }
}
