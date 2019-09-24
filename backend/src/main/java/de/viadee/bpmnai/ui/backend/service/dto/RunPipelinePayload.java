package de.viadee.bpmnai.ui.backend.service.dto;

public class RunPipelinePayload {
    private String dataLevel;
    private String outputFormat;
    private String kafkaBroker;

    public String getDataLevel() {
        return dataLevel;
    }

    public void setDataLevel(String dataLevel) {
        this.dataLevel = dataLevel;
    }

    public String getOutputFormat() {
        return outputFormat;
    }

    public void setOutputFormat(String outputFormat) {
        this.outputFormat = outputFormat;
    }

    public String getKafkaBroker() {
        return kafkaBroker;
    }

    public void setKafkaBroker(String kafkaBroker) {
        this.kafkaBroker = kafkaBroker;
    }
}
