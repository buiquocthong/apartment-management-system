FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar master.jar

COPY src/main/resources/liquibase/master-changelog.xml /app/liquibase/master-changelog.xml

COPY src/main/resources/banner.txt /app/banner.txt

EXPOSE ${MASTER_PORT}

CMD ["java", "-jar", "master.jar"]