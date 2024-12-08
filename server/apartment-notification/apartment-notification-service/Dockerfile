FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar notification.jar

COPY src/main/resources/banner.txt /app/banner.txt

EXPOSE ${NOTIFICATION_PORT}

CMD ["java", "-jar", "notification.jar"]