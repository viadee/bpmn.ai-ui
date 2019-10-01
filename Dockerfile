FROM ubuntu:18.04 AS build-env
RUN apt-get update && \
    apt-get -y install openjdk-8-jdk && \
    apt-get -y install maven && \
    apt-get -y install nodejs && \
    apt-get clean

COPY / /home
WORKDIR /home/frontend
RUN mvn clean package
WORKDIR /home/backend
RUN mvn -P standaloneJar clean package


FROM ubuntu:18.04

LABEL maintainer="mario.micudaj@viadee.de"

ARG APP_COMPONENT_DIR=/home/backend/target
COPY --from=build-env ${APP_COMPONENT_DIR}/lib /app/lib
COPY --from=build-env ${APP_COMPONENT_DIR}/dependency /app/bin
COPY --from=build-env ${APP_COMPONENT_DIR}/dependency/META-INF /app/bin/META-INF

RUN apt-get update && \
    apt-get -y install openjdk-8-jre-headless && \
    apt-get -y install libc6 && \
    apt-get clean

RUN addgroup --gid 1000 appuser && \
    adduser --uid 1000 --gid 1000 appuser && \
    mkdir -p /app && \
    mkdir -p /data

RUN chown -R appuser:appuser /app && \
    chown -R appuser:appuser /data && \
    find /app -type d -exec chmod 550 {} + && \
    find /app -type f -exec chmod 660 {} + && \
    chmod 770 /data

VOLUME /data
USER appuser

EXPOSE 7000
WORKDIR /data
ENTRYPOINT ["/usr/bin/java", "-Dspark.master=local[*]", "-cp", "/app/bin:/app/lib/*", "de.viadee.bpmnai.ui.backend.Application"]