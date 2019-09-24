package de.viadee.bpmnai.ui.backend;

import com.beust.jcommander.JCommander;
import com.beust.jcommander.ParameterException;
import de.viadee.bpmnai.core.runner.SparkRunner;
import de.viadee.bpmnai.core.runner.config.SparkRunnerConfig;
import de.viadee.bpmnai.core.util.logging.SparkImporterLogger;
import de.viadee.bpmnai.ui.backend.service.ServiceRoutes;
import de.viadee.bpmnai.ui.backend.configuration.ApplicationConfig;
import de.viadee.bpmnai.ui.backend.configuration.CustomJacksonObjectMapper;
import de.viadee.bpmnai.ui.backend.configuration.UIBackendArguments;
import io.javalin.Javalin;
import io.javalin.core.util.Header;
import io.javalin.plugin.json.JavalinJackson;
import io.javalin.websocket.WsConnectContext;
import org.apache.spark.sql.SparkSession;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class Application {

    private static final Logger LOG = LoggerFactory.getLogger(Application.class);

    public static UIBackendArguments ARGS;

    public static Map<WsConnectContext, String> wsSessionMap = new ConcurrentHashMap<>();

    private static void initialize(String[] arguments) {

        //configure Jackson Object Mapper
        JavalinJackson.configure(new CustomJacksonObjectMapper());

        arguments = setDefaultArguments(arguments);

        ARGS = UIBackendArguments.getInstance();

        // instantiate JCommander
        // Use JCommander for flexible usage of Parameters
        final JCommander jCommander = JCommander.newBuilder().addObject(UIBackendArguments.getInstance()).build();
        try {
            jCommander.parse(arguments);
        } catch (final ParameterException e) {
            LOG.error("Parsing of parameters failed. Error message: " + e.getMessage());
            jCommander.usage();
            System.exit(1);
        }

        SparkRunnerConfig config = ApplicationConfig.getInstance().getSparkRunnerConfig();
        config.setWorkingDirectory(ARGS.getWorkingDirectory());
        config.setSourceFolder(ARGS.getFileSource());
        config.setTargetFolder(ARGS.getFileDestination());
        config.setRunningMode(SparkRunner.RUNNING_MODE.KAFKA_PROCESSING);
        SparkImporterLogger.getInstance().setLogDirectory(ARGS.getLogDirectory());

        config.setGenerateResultPreview(true);
        config.setCloseSparkSessionAfterRun(false);

        //start local Spark instance
        SparkSession.builder().master("local[*]").getOrCreate();

        SparkImporterLogger.getInstance().writeInfo("UI Backend server started");
        LOG.info("UI Backend server started");
    }

    @NotNull
    private static String[] setDefaultArguments(String[] arguments) {

        // set default arguments if none provided during application run
        List<String> args = new ArrayList<>();
        args.addAll(Arrays.asList(arguments));
        if(!args.contains("-fs")) {
            args.add("-fs");
            args.add("./source");

            // create local folder if not existing
            File f = new File("./source");
            if (!f.exists()) {
                f.mkdir();
            }
        }

        if(!args.contains("-fd")) {
            args.add("-fd");
            args.add("./output");

            // create local folder if not existing
            File f = new File("./output");
            if (!f.exists()) {
                f.mkdir();
            }
        }

        if(!args.contains("-wd")) {
            args.add("-wd");
            args.add("./config");
        }

        if(!args.contains("-ld")) {
            args.add("-ld");
            args.add("./config");
        }

        arguments = args.toArray(arguments);
        return arguments;
    }


    public static void main(String[] args) {

        initialize(args);

        // start backend server
        Javalin app = Javalin.create(config -> {
            config.enableCorsForAllOrigins();
            config.addStaticFiles("/ui");
        })
                .ws("/ws", ws -> {
                    ws.onConnect(wsch -> {
                        LOG.debug("Websocket client connected");
                        String username = UUID.randomUUID().toString();
                        wsSessionMap.put(wsch, username);
                    });
                    ws.onMessage(wsmh -> {
                        LOG.debug("Websocket message received: " + wsmh.message());
                    });
                    ws.onClose(wsch -> {
                        LOG.debug("Websocket client closed");
                        wsSessionMap.remove(wsch.session);
                    });
                    ws.onError(wseh -> LOG.debug("Error during Websocket connection"));
                })
                .before(ctx -> {
                    ctx.header(Header.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
                })
                .start(7000);
        app.routes(new ServiceRoutes());
    }


}

