package de.viadee.bpmnai.ui.backend.service.dto;

public class ResultPreviewResponse {
    private String[] header;
    private Object[] data;
    private Object[] activities;

    public String[] getHeader() {
        return header;
    }

    public void setHeader(String[] header) {
        this.header = header;
    }

    public Object[] getData() {
        return data;
    }

    public void setData(Object[] data) {
        this.data = data;
    }

    public Object[] getActivities() {
        return activities;
    }

    public void setActivities(Object[] activities) {
        this.activities = activities;
    }
}
