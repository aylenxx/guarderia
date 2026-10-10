package com.guarderia.service;

import com.guarderia.domain.Asistencia;
import com.guarderia.domain.Aula;
import com.guarderia.domain.Nino;
import com.guarderia.dto.AsistenciaAulaRequest;
import com.guarderia.dto.AsistenciaAulaResponse;
import com.guarderia.dto.FichaNinoDto;
import com.guarderia.repository.AsistenciaRepository;
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
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AsistenciaServiceTest {

    @Mock
    private AsistenciaRepository asistenciaRepository;

    @Mock
    private NinoRepository ninoRepository;

    @Mock
    private AulaRepository aulaRepository;

    @InjectMocks
    private AsistenciaService asistenciaService;

    private Aula aula1;
    private Nino nino1;

    @BeforeEach
    void setUp() {
        aula1 = new Aula("Aula 1", 15);
        aula1.setId(1L);

        nino1 = new Nino("Lucas", "Gómez", "78945612", LocalDate.of(2022, 5, 10),
                "Alergia a mariscos", "Usar inhalador", aula1);
        nino1.setId(10L);
    }

    @Test
    @DisplayName("HU05 / RF08, RF09: Consultar fichas del aula con alergias, indicaciones y contactos")
    void testObtenerFichasPorAula_Exitoso() {
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.findByAulaIdAndActivoTrue(1L)).thenReturn(List.of(nino1));

        List<FichaNinoDto> fichas = asistenciaService.obtenerFichasPorAula(1L);

        assertNotNull(fichas);
        assertEquals(1, fichas.size());
        assertEquals("Lucas Gómez", fichas.get(0).getNombreCompleto());
        assertEquals("Alergia a mariscos", fichas.get(0).getAlergias());
        assertEquals("Usar inhalador", fichas.get(0).getIndicacionesMedicas());
    }

    @Test
    @DisplayName("HU04 / RF06, RF07, RF14: Registrar asistencia de aula con hora obtenida desde el servidor")
    void testRegistrarAsistenciaAula_Exitoso() {
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino1));
        when(asistenciaRepository.findByNinoIdAndFecha(10L, LocalDate.now())).thenReturn(Optional.empty());

        AsistenciaAulaRequest.AsistenciaRegistroItem item =
                new AsistenciaAulaRequest.AsistenciaRegistroItem(10L, true, "Llegó puntual");
        AsistenciaAulaRequest request = new AsistenciaAulaRequest(1L, LocalDate.now(), List.of(item));

        AsistenciaAulaResponse response = asistenciaService.registrarAsistenciaAula(request);

        assertNotNull(response);
        assertEquals(1L, response.getAulaId());
        assertEquals(1, response.getTotalRegistrados());
        assertEquals(1, response.getTotalPresentes());
        assertEquals(0, response.getTotalAusentes());
        assertNotNull(response.getHoraRegistroServidor()); // RF07
        assertTrue(response.getMensaje().contains("HU04 / RF06, RF07"));

        verify(asistenciaRepository, times(1)).save(any(Asistencia.class));
    }

    @Test
    @DisplayName("HU04 / RF13: Rechaza registro si el niño no pertenece al aula seleccionada")
    void testRegistrarAsistenciaAula_NinoNoPerteneceAula_Falla() {
        Aula aula2 = new Aula("Aula 2", 15);
        aula2.setId(2L);
        nino1.setAula(aula2); // Niño está en aula 2

        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino1));

        AsistenciaAulaRequest.AsistenciaRegistroItem item =
                new AsistenciaAulaRequest.AsistenciaRegistroItem(10L, true, "");
        AsistenciaAulaRequest request = new AsistenciaAulaRequest(1L, LocalDate.now(), List.of(item));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> asistenciaService.registrarAsistenciaAula(request));

        assertTrue(ex.getMessage().contains("no pertenece al aula seleccionada"));
        verify(asistenciaRepository, never()).save(any(Asistencia.class));
    }

    @Test
    @DisplayName("HU04: Actualiza asistencia existente si ya fue registrada previamente en el día")
    void testRegistrarAsistenciaAula_ActualizaExistente() {
        when(aulaRepository.findById(1L)).thenReturn(Optional.of(aula1));
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino1));

        Asistencia existente = new Asistencia(nino1, LocalDate.now(), false, LocalTime.of(8, 0), "Ausente");
        when(asistenciaRepository.findByNinoIdAndFecha(10L, LocalDate.now())).thenReturn(Optional.of(existente));

        AsistenciaAulaRequest.AsistenciaRegistroItem item =
                new AsistenciaAulaRequest.AsistenciaRegistroItem(10L, true, "Llegó tarde justificado");
        AsistenciaAulaRequest request = new AsistenciaAulaRequest(1L, LocalDate.now(), List.of(item));

        AsistenciaAulaResponse response = asistenciaService.registrarAsistenciaAula(request);

        assertNotNull(response);
        assertEquals(1, response.getTotalPresentes());
        assertTrue(existente.isPresente());
        assertEquals("Llegó tarde justificado", existente.getObservaciones());
        verify(asistenciaRepository, times(1)).save(existente);
    }
}
