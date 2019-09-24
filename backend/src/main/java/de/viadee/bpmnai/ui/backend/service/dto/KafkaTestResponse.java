package de.viadee.bpmnai.ui.backend.service.dto;

public class KafkaTestResponse {

    private String message;
    private int resultCode;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getResultCode() {
        return resultCode;
    }

    public void setResultCode(int resultCode) {
        this.resultCode = resultCode;
    }
}
