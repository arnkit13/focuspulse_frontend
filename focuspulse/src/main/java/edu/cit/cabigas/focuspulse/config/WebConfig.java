package edu.cit.cabigas.focuspulse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allow all paths
                .allowedOriginPatterns("http://localhost:*", "https://*.vercel.app") // Allow requests from local frontend and Vercel
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow specific HTTP methods
                .allowCredentials(true); // Allow credentials (cookies, authorization headers)
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the "uploads" directory in the root of the project
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}