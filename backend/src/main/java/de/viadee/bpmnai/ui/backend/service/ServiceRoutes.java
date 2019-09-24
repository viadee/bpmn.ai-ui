package de.viadee.bpmnai.ui.backend.service;

import de.viadee.bpmnai.core.configuration.Configuration;
import de.viadee.bpmnai.core.processing.steps.PipelineStepCollector;
import de.viadee.bpmnai.ui.backend.service.dto.ConfigFileLocations;
import de.viadee.bpmnai.ui.backend.service.dto.KafkaTestResponse;
import de.viadee.bpmnai.ui.backend.service.dto.ResultPreviewResponse;
import de.viadee.bpmnai.ui.backend.service.dto.RunPipelinePayload;
import io.javalin.apibuilder.EndpointGroup;

import java.util.List;

import static io.javalin.apibuilder.ApiBuilder.get;
import static io.javalin.apibuilder.ApiBuilder.post;

public class ServiceRoutes implements EndpointGroup {

    @Override
    public void addEndpoints() {
        getRoutes();
    }

    private void getRoutes() {

        //get pipeline configuration from bpmn.ai
        get("/config", ctx ->
        {
            ctx.json(BpmnAIService.getInstance().getConfig());
        });

        post("/config", ctx ->
        {
            Configuration newConfiguration = ctx.bodyAsClass(Configuration.class);
            Configuration configuration = BpmnAIService.getInstance().postConfig(newConfiguration);
            ctx.json(configuration);
        });

        //get file locations for configuration from bpmn.ai
        get("/config/filelocation", ctx ->
        {
            ConfigFileLocations configFileLocations = BpmnAIService.getInstance().getConfigFileLocations();
            ctx.json(configFileLocations);
        });

        get("/previewdata", ctx ->
        {
            ResultPreviewResponse resultPreviewResponse = BpmnAIService.getInstance().previewResult();
            ctx.json(resultPreviewResponse);
        });

        post("/testkafkaconn", ctx ->
        {
            KafkaTestResponse response = BpmnAIService.getInstance().testKafkaConnection(ctx.body());
            ctx.json(response);
        });

        post("/cancel", ctx ->
        {
           BpmnAIService.getInstance().cancelRun();
        });

        post("/runminimalpipeline", ctx ->
        {
            RunPipelinePayload payload = ctx.bodyAsClass(RunPipelinePayload.class);
            BpmnAIService.getInstance().runKafkaImportAndConfigGeneration(payload);
        });

        post("/runprocessing", ctx ->
        {
            RunPipelinePayload payload = ctx.bodyAsClass(RunPipelinePayload.class);
            BpmnAIService.getInstance().runProcessing(payload);
        });

        // get all available pipeline steps
        get("/steps", ctx ->
        {
            List availableSteps = PipelineStepCollector.collectAllAvailablePipelineSteps();
            ctx.json(availableSteps);
        });
    }


}
