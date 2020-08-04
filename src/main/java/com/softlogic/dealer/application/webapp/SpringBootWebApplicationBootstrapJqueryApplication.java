package com.softlogic.dealer.application.webapp;

import com.softlogic.dealer.application.webapp.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(FileStorageProperties.class)
@SpringBootApplication
public class SpringBootWebApplicationBootstrapJqueryApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootWebApplicationBootstrapJqueryApplication.class, args);
    }
}
