FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'if [ ! -z "$FIREBASE_SERVICE_ACCOUNT_BASE64" ]; then' >> /entrypoint.sh && \
    echo '  echo "$FIREBASE_SERVICE_ACCOUNT_BASE64" | base64 -d > /app/firebase-service-account.json' >> /entrypoint.sh && \
    echo 'fi' >> /entrypoint.sh && \
    echo 'exec java -jar app.jar' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
