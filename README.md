# bpmn.ai-ui
This project contanis a UI that helps in setting up your [bpmn.ai](https://github.com/viadee/bpmn.ai) preprocessing pipeline easily.

## How to run bpmn.ai-ui

### Using Docker

The easiest way to run bpmn.ai-ui is by using the provided [Docker image](https://hub.docker.com/r/viadee/bpmn.ai-ui).

In order to run bpmn.ai-ui you can use the following command:

    docker run -it --rm \
        --network ui-demo_default \
        -v <local_folder_for_bpmn.ai_files>:/data \
        -p 7000:7000 \
        viadee/bpmn.ai-ui:latest

This run the latest version of bpmn.ai-ui and maps your local folder as /data inside the container (has to be /data) and makes the UI available on port [7000](http://localhost:7000) on the docker host. It is configured to use all cpu cores available to the docker container.

By using "--network ui-demo_default" the docker container is joined into the docker network ui-demo_default. This should match the docker network of your kafka server if it is also running in a docker container.

### Using maven

You can run bpmn.ai-ui by building a standalone jar and run it on your machine.

#### Create a standalone jar

In the project root folder run the follwoing conmmand to build a standalone runnable jar:

    mvn clean package -PstandaloneJar

After a succesful build the standalone jar can be found under backend/target/bpmnai-ui-\<version\>-jar-with-dependencies.jar

#### Run the jar

In order to run the strandalone jar you can use the following command:

    java -Dspark.master="local[*]" -jar <path_to_bpmnai-ui-\<version\>-jar-with-dependencies.jar

*-Dspark.master="local[\*]"* will tell Apache Spark to use all available cpu cores. You can replace the asterisk with the number of cpu cores Spark should be using.

The UI will be available on port [7000](http://localhost:7000).

#### Add your own pipeline step

If you want to add you own pipeline steps while using the UI you simply change the bpmn.ai-core dependency of bpmn.ai-ui to your project containing your pipeline steps. Just make sure that your project is using bpmn.ai-core as a dependency with at least version 1.2.1.

For details on building your own pipeline step see the [bpmn.ai wiki](https://github.com/viadee/bpmn.ai/wiki/12_Tutorial-2-%E2%80%90-Create-a-custom-Preprocessing-step-for-bpmn.ai).