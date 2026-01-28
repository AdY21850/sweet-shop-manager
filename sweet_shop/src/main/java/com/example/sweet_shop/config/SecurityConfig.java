package com.example.sweet_shop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // =====================
                // ✅ CORS CONFIG
                // =====================
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // =====================
                // ✅ DISABLE CSRF (JWT)
                // =====================
                .csrf(csrf -> csrf.disable())

                // =====================
                // ✅ STATELESS SESSION
                // =====================
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // =====================
                // ✅ AUTHORIZATION RULES
                // =====================
                .authorizeHttpRequests(auth -> auth

                        // 🔥 CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 🔓 PUBLIC AUTH ROUTES
                        .requestMatchers("/api/auth/**").permitAll()

                        // 🔓 PUBLIC SWEETS FETCH
                        .requestMatchers(HttpMethod.GET, "/api/sweets/**").permitAll()

                        // 🔒 ADMIN ONLY ROUTES (SAFE ADDITION)
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🔒 USER + ADMIN ROUTES
                        .requestMatchers("/api/user/**").hasAnyRole("USER", "ADMIN")

                        // 🔒 EVERYTHING ELSE REQUIRES AUTH
                        .anyRequest().authenticated()
                )

                // =====================
                // ✅ JWT FILTER
                // =====================
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // =====================
                // ✅ DISABLE FORM LOGIN
                // =====================
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }

    // =====================
    // ✅ CORS CONFIGURATION
    // =====================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔥 Allow production + preview + local dev
        config.setAllowedOriginPatterns(List.of(
                "https://sweet-shop-manager-rho.vercel.app",
                "https://*.vercel.app",
                "http://localhost:*"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
