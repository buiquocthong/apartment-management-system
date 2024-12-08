FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar gateway.jar

COPY src/main/resources/banner.txt /app/banner.txt

EXPOSE ${API_GATEWAY_PORT}

CMD ["java", "-jar", "gateway.jar"]