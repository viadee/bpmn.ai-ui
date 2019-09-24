package de.viadee.bpmnai.ui.backend.configuration;

import de.viadee.bpmnai.core.runner.config.SparkRunnerConfig;

public class ApplicationConfig {

    private static ApplicationConfig instance;

    private SparkRunnerConfig sparkRunnerConfig = new SparkRunnerConfig();

    public static synchronized ApplicationConfig getInstance(){
        if(instance == null){
            instance = new ApplicationConfig();
        }
        return instance;
    }

    public SparkRunnerConfig getSparkRunnerConfig() {
        return sparkRunnerConfig;
    }
}
