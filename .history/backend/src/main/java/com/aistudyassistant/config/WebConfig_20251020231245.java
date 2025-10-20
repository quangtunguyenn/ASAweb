package com.aistudyassistant.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve frontend files from the frontend directory
        registry.addResourceHandler("/**")
                .addResourceLocations("file:frontend/", "classpath:/static/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Map root to index-new.html
        registry.addViewController("/").setViewName("forward:/frontend/index-new.html");
    }
}
