FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar identity.jar

COPY src/main/resources/key/keystore.jks /app/key/keystore.jks

COPY src/main/resources/liquibase/master-changelog.xml /app/liquibase/master-changelog.xml

COPY src/main/resources/banner.txt /app/banner.txt

COPY src/main/resources/i18n/ /app/i18n/

EXPOSE ${IDENTITY_PORT}

CMD ["java", "-jar", "identity.jar"]