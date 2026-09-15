# Campus Event Hub — Frontend

A React + Vite frontend for the Campus Event Hub Spring Boot backend.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

The API base URL is read from `.env` (`VITE_API_BASE_URL`), defaulting to `http://localhost:8080`.

## Backend CORS

Add this configuration class to your Spring Boot project (do not modify existing controllers):

`src/main/java/com/example/campus_event_hub/config/WebConfig.java`

```java
package com.example.campus_event_hub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}
```
