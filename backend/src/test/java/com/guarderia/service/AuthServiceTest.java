package com.guarderia.service;

import com.guarderia.domain.Rol;
import com.guarderia.domain.Usuario;
import com.guarderia.dto.LoginRequest;
import com.guarderia.dto.LoginResponse;
import com.guarderia.repository.UsuarioRepository;
import com.guarderia.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private Usuario usuarioDirectora;

    @BeforeEach
    void setUp() {
        usuarioDirectora = new Usuario(
                "directora",
                "encodedPassword123",
                "Directora General",
                Rol.DIRECTORA,
                true
        );
        usuarioDirectora.setId(1L);
    }

    @Test
    @DisplayName("HU08 / RF01: Inicio de sesión exitoso con credenciales válidas")
    void testLogin_Success() {
        LoginRequest request = new LoginRequest("directora", "Directora123*");

        when(usuarioRepository.findByUsername("directora")).thenReturn(Optional.of(usuarioDirectora));
        when(passwordEncoder.matches("Directora123*", "encodedPassword123")).thenReturn(true);
        when(tokenProvider.generateToken("directora", "DIRECTORA")).thenReturn("mock-jwt-token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("directora", response.getUsername());
        assertEquals("DIRECTORA", response.getRol());
        assertEquals("Directora General", response.getNombreCompleto());

        verify(usuarioRepository, times(1)).findByUsername("directora");
        verify(passwordEncoder, times(1)).matches("Directora123*", "encodedPassword123");
        verify(tokenProvider, times(1)).generateToken("directora", "DIRECTORA");
    }

    @Test
    @DisplayName("HU08 / RF14: Inicio de sesión falla cuando el usuario no existe")
    void testLogin_UserNotFound() {
        LoginRequest request = new LoginRequest("noexiste", "Password123*");

        when(usuarioRepository.findByUsername("noexiste")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(tokenProvider, never()).generateToken(anyString(), anyString());
    }

    @Test
    @DisplayName("HU08 / RF14: Inicio de sesión falla cuando la contraseña es incorrecta")
    void testLogin_WrongPassword() {
        LoginRequest request = new LoginRequest("directora", "PasswordIncorrecta");

        when(usuarioRepository.findByUsername("directora")).thenReturn(Optional.of(usuarioDirectora));
        when(passwordEncoder.matches("PasswordIncorrecta", "encodedPassword123")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(tokenProvider, never()).generateToken(anyString(), anyString());
    }

    @Test
    @DisplayName("HU08: Inicio de sesión falla si el usuario está inactivo")
    void testLogin_InactiveUser() {
        usuarioDirectora.setActivo(false);
        LoginRequest request = new LoginRequest("directora", "Directora123*");

        when(usuarioRepository.findByUsername("directora")).thenReturn(Optional.of(usuarioDirectora));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(tokenProvider, never()).generateToken(anyString(), anyString());
    }
}
