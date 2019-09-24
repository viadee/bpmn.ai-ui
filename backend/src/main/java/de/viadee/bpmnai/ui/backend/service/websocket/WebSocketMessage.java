package de.viadee.bpmnai.ui.backend.service.websocket;

public class WebSocketMessage {
    private boolean jobRunning;
    private String jobName;
    private boolean jobFinished;
    private boolean jobResultOK;
    private boolean handleMessage;
    private String message;

    public String getJobName() {
        return jobName;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public boolean isJobFinished() {
        return jobFinished;
    }

    public void setJobFinished(boolean jobFinished) {
        this.jobFinished = jobFinished;
    }

    public boolean isJobResultOK() {
        return jobResultOK;
    }

    public void setJobResultOK(boolean jobResultOK) {
        this.jobResultOK = jobResultOK;
    }

    public boolean isJobRunning() {
        return jobRunning;
    }

    public boolean isHandleMessage() {
        return handleMessage;
    }

    public void setHandleMessage(boolean handleMessage) {
        this.handleMessage = handleMessage;
    }

    public void setJobRunning(boolean jobRunning) {
        this.jobRunning = jobRunning;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
