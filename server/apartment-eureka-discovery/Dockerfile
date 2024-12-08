FROM openjdk:11-jre-slim

ENV EUREKA_PORT=8761
ENV EUREKA_HOSTNAME=localhost
ENV EUREKA_USER=admin
ENV EUREKA_PW=admin
ENV EUREKA_ZONE_URI=http://admin:admin@localhost:8761/eureka
ENV SPRING_PROFILES_ACTIVE=default

COPY target/*.jar eureka.jar

COPY src/main/resources/banner.txt /app/banner.txt

EXPOSE ${EUREKA_PORT}

ENTRYPOINT ["java", "-jar", "eureka.jar"]
