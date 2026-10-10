package com.guarderia.service;

import com.guarderia.domain.Aula;
import com.guarderia.domain.ContactoAutorizado;
import com.guarderia.domain.Nino;
import com.guarderia.domain.RegistroEntradaSalida;
import com.guarderia.domain.TipoMovimiento;
import com.guarderia.dto.MarcadoEntradaSalidaRequest;
import com.guarderia.dto.MarcadoEntradaSalidaResponse;
import com.guarderia.dto.VerificacionRecojoDto;
import com.guarderia.repository.NinoRepository;
import com.guarderia.repository.RegistroEntradaSalidaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecepcionServiceTest {

    @Mock
    private NinoRepository ninoRepository;

    @Mock
    private RegistroEntradaSalidaRepository registroEntradaSalidaRepository;

    @InjectMocks
    private RecepcionService recepcionService;

    private Aula aula1;
    private Nino nino1;
    private ContactoAutorizado contacto1;

    @BeforeEach
    void setUp() {
        aula1 = new Aula("Aula 1", 15);
        aula1.setId(1L);

        nino1 = new Nino("Mateo", "Vargas", "71234567", LocalDate.of(2022, 3, 15),
                "Alergia al maní", "Ninguna", aula1);
        nino1.setId(10L);

        contacto1 = new ContactoAutorizado("Carla", "Rios", "Madre", "998877665", "40112233");
        contacto1.setId(100L);
        nino1.agregarContacto(contacto1);
    }

    @Test
    @DisplayName("HU06 / RF10, RNF05: Consultar personas autorizadas para recojo de niños")
    void testConsultarAutorizadosRecojo_Exitoso() {
        when(ninoRepository.findByActivoTrue()).thenReturn(List.of(nino1));

        List<VerificacionRecojoDto> lista = recepcionService.consultarAutorizadosRecojo(null);

        assertNotNull(lista);
        assertEquals(1, lista.size());
        assertEquals("Mateo Vargas", lista.get(0).getNombreCompleto());
        assertEquals("71234567", lista.get(0).getDocumentoIdentidad());
        assertEquals(1, lista.get(0).getPersonasAutorizadas().size());
        assertEquals("Carla", lista.get(0).getPersonasAutorizadas().get(0).getNombres());
        assertEquals("Alergia al maní", lista.get(0).getAlergias());
    }

    @Test
    @DisplayName("HU06: Consultar autorizados con filtro por DNI del niño")
    void testConsultarAutorizadosRecojo_ConFiltro() {
        when(ninoRepository.findByActivoTrue()).thenReturn(List.of(nino1));

        List<VerificacionRecojoDto> listaCoincide = recepcionService.consultarAutorizadosRecojo("71234567");
        assertEquals(1, listaCoincide.size());

        List<VerificacionRecojoDto> listaNoCoincide = recepcionService.consultarAutorizadosRecojo("99999999");
        assertEquals(0, listaNoCoincide.size());
    }

    @Test
    @DisplayName("HU07 / RF11, RF07, RF14: Registrar entrada o salida con hora asignada por el servidor")
    void testRegistrarMarcado_Exitoso() {
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino1));
        when(registroEntradaSalidaRepository.save(any(RegistroEntradaSalida.class))).thenAnswer(invocation -> {
            RegistroEntradaSalida r = invocation.getArgument(0);
            r.setId(500L);
            return r;
        });

        MarcadoEntradaSalidaRequest request = new MarcadoEntradaSalidaRequest(
                10L,
                TipoMovimiento.ENTRADA,
                "Carla Rios (Madre)",
                "40112233",
                "Ingreso normal"
        );

        MarcadoEntradaSalidaResponse response = recepcionService.registrarMarcado(request);

        assertNotNull(response);
        assertEquals(500L, response.getId());
        assertEquals(10L, response.getNinoId());
        assertEquals(TipoMovimiento.ENTRADA, response.getTipo());
        assertEquals("Carla Rios (Madre)", response.getPersonaEntregaRecoge());
        assertNotNull(response.getHoraServidor()); // RF07
        assertTrue(response.getMensaje().contains("HU07 / RF11, RF07"));

        verify(registroEntradaSalidaRepository, times(1)).save(any(RegistroEntradaSalida.class));
    }

    @Test
    @DisplayName("HU07: Rechaza marcado si el niño seleccionado no existe")
    void testRegistrarMarcado_NinoInexistente_Falla() {
        when(ninoRepository.findById(99L)).thenReturn(Optional.empty());

        MarcadoEntradaSalidaRequest request = new MarcadoEntradaSalidaRequest(
                99L,
                TipoMovimiento.SALIDA,
                "Carla Rios",
                "40112233",
                ""
        );

        assertThrows(IllegalArgumentException.class, () -> recepcionService.registrarMarcado(request));
        verify(registroEntradaSalidaRepository, never()).save(any(RegistroEntradaSalida.class));
    }

    @Test
    @DisplayName("HU07 / RF13: Rechaza marcado si no se especifica quién entrega o recoge al niño")
    void testRegistrarMarcado_SinPersona_Falla() {
        when(ninoRepository.findById(10L)).thenReturn(Optional.of(nino1));

        MarcadoEntradaSalidaRequest request = new MarcadoEntradaSalidaRequest(
                10L,
                TipoMovimiento.SALIDA,
                "   ",
                "",
                ""
        );

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> recepcionService.registrarMarcado(request));

        assertTrue(ex.getMessage().contains("Debe especificar la persona responsable"));
        verify(registroEntradaSalidaRepository, never()).save(any(RegistroEntradaSalida.class));
    }
}
