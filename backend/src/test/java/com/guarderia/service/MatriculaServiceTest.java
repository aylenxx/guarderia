package com.guarderia.service;

import com.guarderia.domain.Aula;
import com.guarderia.domain.Nino;
import com.guarderia.dto.ContactoAutorizadoDto;
import com.guarderia.dto.MatriculaRequest;
import com.guarderia.dto.MatriculaResponse;
import com.guarderia.repository.AulaRepository;
import com.guarderia.repository.NinoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatriculaServiceTest {

    @Mock
    private NinoRepository ninoRepository;

    @Mock
    private AulaRepository aulaRepository;

    @InjectMocks
    private MatriculaService matriculaService;

    private Aula aula1;
    private MatriculaRequest requestValido;

    @BeforeEach
    void setUp() {
        aula1 = new Aula("Aula 1", 15);
        aula1.setId(1L);

        ContactoAutorizadoDto contacto = new ContactoAutorizadoDto(
                "María", "Pérez", "Madre", "987654321", "44556677"
        );

        requestValido = new MatriculaRequest();
        requestValido.setNombres("Lucas");
        requestValido.setApellidos("Gómez");
        requestValido.setDocumentoIdentidad("78945612");
        requestValido.setFechaNacimiento(LocalDate.of(2022, 5, 10));
        requestValido.setAlergias("Penicilina, Maní");
        requestValido.setIndicacionesMedicas("Inhalador en caso de crisis asmática");
        requestValido.setAulaId(1L);
        requestValido.setContactos(List.of(contacto));
    }

    @Test
    @DisplayName("HU01 / RF03, RF04: Matrícula exitosa con datos personales, alergias, indicaciones y contacto autorizado")
    void testRegistrarMatricula_Exitoso() {
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.existsByDocumentoIdentidad("78945612")).thenReturn(false);
        when(ninoRepository.save(any(Nino.class))).thenAnswer(invocation -> {
            Nino n = invocation.getArgument(0);
            n.setId(100L);
            return n;
        });

        MatriculaResponse response = matriculaService.registrarMatricula(requestValido);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Lucas Gómez", response.getNombreCompleto());
        assertEquals("78945612", response.getDocumentoIdentidad());
        assertEquals("Aula 1", response.getAulaNombre());
        assertEquals(1, response.getTotalContactos());
        assertEquals("Penicilina, Maní", response.getAlergias());

        verify(ninoRepository, times(1)).save(any(Nino.class));
    }

    @Test
    @DisplayName("HU01 / RF04, RF13: Rechaza matrícula si no se incluye al menos un contacto autorizado")
    void testRegistrarMatricula_SinContactos_Falla() {
        requestValido.setContactos(Collections.emptyList());
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.existsByDocumentoIdentidad("78945612")).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> matriculaService.registrarMatricula(requestValido));

        assertTrue(ex.getMessage().contains("Debe registrar al menos un contacto autorizado"));
        verify(ninoRepository, never()).save(any(Nino.class));
    }

    @Test
    @DisplayName("HU01 / RF13: Rechaza matrícula si ya existe un niño con el mismo documento de identidad")
    void testRegistrarMatricula_DocumentoDuplicado_Falla() {
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.existsByDocumentoIdentidad("78945612")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> matriculaService.registrarMatricula(requestValido));

        assertTrue(ex.getMessage().contains("Ya existe un niño registrado"));
        verify(ninoRepository, never()).save(any(Nino.class));
    }

    @Test
    @DisplayName("HU01: Rechaza matrícula si el aula seleccionada no existe")
    void testRegistrarMatricula_AulaInexistente_Falla() {
        when(aulaRepository.findById(99L)).thenReturn(Optional.empty());
        requestValido.setAulaId(99L);

        assertThrows(IllegalArgumentException.class, () -> matriculaService.registrarMatricula(requestValido));
        verify(ninoRepository, never()).save(any(Nino.class));
    }

    @Test
    @DisplayName("HU02 / RF08: Obtener detalle completo de un niño para edición")
    void testObtenerNinoPorId_Exitoso() {
        Nino nino = new Nino("Lucas", "Gómez", "78945612", LocalDate.of(2022, 5, 10), "Polvo", "Ninguna", aula1);
        nino.setId(10L);
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino));

        var detalle = matriculaService.obtenerNinoPorId(10L);

        assertNotNull(detalle);
        assertEquals(10L, detalle.getId());
        assertEquals("Lucas Gómez", detalle.getNombreCompleto());
        assertEquals("78945612", detalle.getDocumentoIdentidad());
        assertEquals("Aula 1", detalle.getAulaNombre());
    }

    @Test
    @DisplayName("HU02 / RF05, RF14: Modificar matrícula exitosamente con nuevos datos y contactos")
    void testModificarMatricula_Exitoso() {
        Nino nino = new Nino("Lucas", "Gómez", "78945612", LocalDate.of(2022, 5, 10), "Polvo", "Ninguna", aula1);
        nino.setId(10L);
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino));
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.existsByDocumentoIdentidadAndIdNot("78945612", 10L)).thenReturn(false);
        when(ninoRepository.save(any(Nino.class))).thenReturn(nino);

        requestValido.setAlergias("Polvo y Mariscos");
        MatriculaResponse response = matriculaService.modificarMatricula(10L, requestValido);

        assertNotNull(response);
        assertEquals("Polvo y Mariscos", response.getAlergias());
        assertTrue(response.getMensaje().contains("HU02 / RF05"));
        verify(ninoRepository, times(1)).save(nino);
    }

    @Test
    @DisplayName("HU02 / RF13: Rechaza modificación si el documento de identidad ya pertenece a otro niño")
    void testModificarMatricula_DocumentoDuplicadoOtroNino_Falla() {
        Nino nino = new Nino("Lucas", "Gómez", "78945612", LocalDate.of(2022, 5, 10), "Polvo", "Ninguna", aula1);
        nino.setId(10L);
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino));
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.existsByDocumentoIdentidadAndIdNot("78945612", 10L)).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> matriculaService.modificarMatricula(10L, requestValido));

        assertTrue(ex.getMessage().contains("Ya existe otro niño registrado"));
        verify(ninoRepository, never()).save(any(Nino.class));
    }

    @Test
    @DisplayName("HU02 / RF04, RF13: Rechaza modificación si se eliminan todos los contactos autorizados")
    void testModificarMatricula_SinContactos_Falla() {
        Nino nino = new Nino("Lucas", "Gómez", "78945612", LocalDate.of(2022, 5, 10), "Polvo", "Ninguna", aula1);
        nino.setId(10L);
        requestValido.setContactos(Collections.emptyList());

        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino));
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.existsByDocumentoIdentidadAndIdNot("78945612", 10L)).thenReturn(false);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> matriculaService.modificarMatricula(10L, requestValido));

        assertTrue(ex.getMessage().contains("Debe registrar al menos un contacto autorizado"));
        verify(ninoRepository, never()).save(any(Nino.class));
    }
}
