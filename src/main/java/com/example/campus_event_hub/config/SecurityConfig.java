package com.example.campus_event_hub.config;

import com.example.campus_event_hub.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .cors(Customizer.withDefaults())

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Login
                        .requestMatchers("/api/auth/**").permitAll()

                        // Error
                        .requestMatchers("/error").permitAll()

                        // Admin Signup
                        .requestMatchers("/api/admin/signup").permitAll()

                        // Colleges
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/colleges"
                        ).permitAll()

                        // Student registrations
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/events/registrations/by-email"
                        ).permitAll()

                        // Admin registration access
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/events/registrations"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/events/*/registrations"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/events/registration/*"
                        ).hasRole("ADMIN")

                        // Student cancellation
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/events/registration/student/*"
                        ).permitAll()

                        // Public events
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/events"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/events/*"
                        ).permitAll()

                        // Student registration
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/events/*/register"
                        ).permitAll()

                        // Admin event management
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/events"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/events/*"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/events/*"
                        ).hasRole("ADMIN")

                        // Everything else requires login
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider authenticationProvider =
                new DaoAuthenticationProvider(userDetailsService);

        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authenticationProvider);
    }
}