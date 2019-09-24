package de.viadee.bpmnai.ui.backend.configuration;

import com.beust.jcommander.Parameter;

public class UIBackendArguments {
    private static UIBackendArguments uiBackendArguments = null;

    @Parameter(names = { "--file-source",
            "-fs" },
            required = true,
            description = "Directory in which Kafka Streams have been stored in as parquet files.")
    private String fileSource;

    @Parameter(names = { "--file-destination",
            "-fd" },
            required = true,
            description = "The name of the target folder, where the resulting csv files are being stored, i.e. the data mining table.")
    private String fileDestination;

    @Parameter(
            names = {"--working-directory", "-wd"},
            required = false,
            description = "Folder where the configuration files are stored or should be stored."
    )
    private String workingDirectory = "./";
    @Parameter(
            names = {"--log-directory", "-ld"},
            required = false,
            description = "Folder where the log files should be stored."
    )
    private String logDirectory = "./";

    private UIBackendArguments() {
    }

    public String getFileSource() {
        return fileSource;
    }

    public String getFileDestination() {
        return fileDestination;
    }

    public String getWorkingDirectory() {
        return this.workingDirectory;
    }

    public String getLogDirectory() {
        return this.logDirectory;
    }

    public static UIBackendArguments getInstance() {
        if (uiBackendArguments == null) {
            uiBackendArguments = new UIBackendArguments();
        }

        return uiBackendArguments;
    }

    public String toString() {
        return "UIBackendArguments {workingDirectory=" + this.workingDirectory + '\'' + ", logDirectory=" + this.logDirectory + '}';
    }
}
