FROM openjdk:11-jre-slim

WORKDIR /app

COPY target/*.jar payment.jar

COPY src/main/resources/banner.txt /app/banner.txt

EXPOSE ${PAYMENT_PORT}

CMD ["java", "-jar", "payment.jar"]