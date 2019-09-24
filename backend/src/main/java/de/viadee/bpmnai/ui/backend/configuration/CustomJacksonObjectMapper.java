package de.viadee.bpmnai.ui.backend.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public class CustomJacksonObjectMapper extends ObjectMapper {
    public CustomJacksonObjectMapper() {
        this.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    }
}
