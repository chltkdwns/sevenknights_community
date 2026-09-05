# Spring Boot API — Java 21 multi-stage build
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace

COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN chmod +x gradlew

# 의존성만 먼저 받아 레이어 캐시를 활용한다.
RUN ./gradlew dependencies --no-daemon || true

COPY src ./src
# bootJar만 생성하고 테스트는 이미지 빌드에서 제외한다.
RUN ./gradlew bootJar -x test --no-daemon \
    && JAR="$(find build/libs -maxdepth 1 -type f -name '*.jar' ! -name '*-plain.jar' | head -n 1)" \
    && cp "$JAR" /workspace/app.jar

FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

RUN groupadd --system spring && useradd --system --gid spring spring \
    && mkdir -p /app/uploads \
    && chown -R spring:spring /app

COPY --from=build /workspace/app.jar /app/app.jar

USER spring:spring
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
