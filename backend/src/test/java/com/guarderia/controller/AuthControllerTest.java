package com.guarderia.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guarderia.dto.LoginRequest;
import com.guarderia.dto.LoginResponse;
import com.guarderia.security.JwtAuthenticationFilter;
import com.guarderia.security.JwtTokenProvider;
import com.guarderia.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("HU08 / RF01: POST /api/auth/login retorna 200 y token ante credenciales válidas")
    void testLogin_Success() throws Exception {
        LoginRequest request = new LoginRequest("directora", "Directora123*");
        LoginResponse response = new LoginResponse("test-jwt-token", "directora", "Directora General", "DIRECTORA");

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.username").value("directora"))
                .andExpect(jsonPath("$.rol").value("DIRECTORA"))
                .andExpect(jsonPath("$.nombreCompleto").value("Directora General"));
    }

    @Test
    @DisplayName("HU08 / RF14: POST /api/auth/login retorna 401 ante credenciales incorrectas")
    void testLogin_Unauthorized() throws Exception {
        LoginRequest request = new LoginRequest("directora", "ClaveErronea");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Usuario o contraseña incorrectos"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.mensaje").value("Usuario o contraseña incorrectos"));
    }

    @Test
    @DisplayName("HU08 / RF13: POST /api/auth/login retorna 400 ante campos en blanco")
    void testLogin_ValidationFailed() throws Exception {
        LoginRequest request = new LoginRequest("", "");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.mensaje").value("Datos de formulario inválidos"))
                .andExpect(jsonPath("$.errores.username").exists())
                .andExpect(jsonPath("$.errores.password").exists());
    }
}
