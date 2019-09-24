export class ConfigurationFileLocation {
    configLocation: string;
    sourceLocation: string;
    targetLocation: string;
}

export class Configuration {
    preprocessingConfiguration: PreprocessingConfiguration;
}

export class PreprocessingConfiguration {
    dataLevel: string;
    variableConfiguration: VariableConfiguration[];
    pipelineStepConfiguration: PipelineStepConfiguration;
}

export class VariableConfiguration {
    variableName: string;
    variableType: string;
    parseFormat: string;
    useVariable: boolean;
    comment: string;
}

export class PipelineStepConfiguration {
    steps: Step[];
}

export class Step {
    id: string;
    className: string;
    comment: string;
    active: boolean;
    dependsOn: string;
    parameters;
    parameterCount: number;
    definition: StepDefinition;
}

export class StepDefinition {
    id: string;
    className: string;
    name: string;
    description: string;
    parameters: ParameterDefinition[];
}

export class ParameterDefinition {
    name: string;
    description: string;
    dataType: string;
    required: boolean;
}

export class KafkaTestReponse {
    message: string;
    resultCode: number;
}

export class ResultPreviewData {
    header: string[] = [];
    data: Object[] = [];
    activites: Object[] = [];
}

export class JobStatus {
    jobId: string;
    running: boolean;
    finished: boolean;
    resultOk: boolean;
    message: string;
}

export class WebSocketMessage {
    jobRunning: boolean;
    jobFinished: boolean;
    jobName: string;
    jobResultOK: boolean;
    handleMessage: boolean;
    message: string;
}
