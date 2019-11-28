# How to use the Docker demo environment

In order to allow an easy start into bpmn.ai we provided a docker-compose file which will run a complete demo environment with all necessary components to see our preprocessing pipeline in action.

## Setup

In order to run the demo, Docker needs to be installed on the machine. The provided docker-compose file will then download the necessary images and run the necessary containers and setup the network connections for the containers. In detail it will run the following containers:
* [Camunda workflow engine](https://www.camunda.com)
* [Apache Kafka](https://kafka.apache.org/) (for storing the process events exported from Camunda)
* [Apache Zookeeper](https://zookeeper.apache.org/) (required by Apache Kafka)
* [Camunda Kafka Polling Client](https://github.com/viadee/camunda-kafka-polling-client) (for exporting process events from Camunda into Apache Kafka)
* [bpmn.ai UI web application](https://github.com/viadee/bpmn.ai-ui)

The data subfolders in for bpmnai, camunda and polling-client in the demo folder are each mapped into the respective container and will hold their data so it is preserved even after shutting down the containers.

## Camunda workflow engine
Camunda serves the demo process and will generate process events when running process instances. When started Camunda already contains the deployed demo claim process as well as data of one process instance ran, so that one can directly run bpmn.ai on it.

Camunda is exposed on port 7777 on the host machine so you can access it on your local machine by going to [http://localhost:7777/camunda](http://localhost:7777/camunda)

The login for Camunda is demo / demo.

If you want to start a process instance yourself you can do so in the [Camunda Tasklist app](http://localhost:7777/camunda/app/tasklist). Every manual process activity is assigned to the demo user for easy experimentation.

## Apache Kafka
Apache Kafka is used to store the process events from Camunda. bpmn.ai will access the data from the Apache Kafka topics. There are three topics available:
* processInstance
* activityInstance
* variableUpdate

Kafka is expoed on port 9093 on the host machine.

## Apache Zookeeper
Apache Kafka requires Apache Zookeeper, e. g. for topic and cluster management.

## Camunda Kafka Polling Client
The Camunda Kafka Polling Client is exporting the process instances history data from Camunda and imports it into the topics in Apache Kafka. By default it polls new data every 30 seconds. So after running a process instance it might take a while until it is available in Apache Kafka and therefore to bpmn.ai.

By default it initially only greps data from the time it was first started but in the demo it is configured to retrieve all data from 01.11.2019 so that the supplied demo data is retrieved.

For more information on configuration options you can check the [github repository](https://github.com/viadee/camunda-kafka-polling-client).

## bpmn.ai UI web application
The UI bpmn.ai web application is exposed on port 7000 on the host machine and can therefore be accessed by going to [http://localhost:7000](http://localhost:7000). The Spark UI is exposed on port 4040 on the host machine.

A video introducing bpmn.ai and showing how to use the UI can be accessed on [Youtube](https://www.youtube.com/watch?v=qvtbqt4BOvo).