package com.guarderia.service;

import com.guarderia.domain.Nino;
import com.guarderia.domain.RegistroEntradaSalida;
import com.guarderia.dto.ContactoAutorizadoDto;
import com.guarderia.dto.MarcadoEntradaSalidaRequest;
import com.guarderia.dto.MarcadoEntradaSalidaResponse;
import com.guarderia.dto.VerificacionRecojoDto;
import com.guarderia.repository.NinoRepository;
import com.guarderia.repository.RegistroEntradaSalidaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecepcionService {

    private final NinoRepository ninoRepository;
    private final RegistroEntradaSalidaRepository registroEntradaSalidaRepository;

    public RecepcionService(NinoRepository ninoRepository, RegistroEntradaSalidaRepository registroEntradaSalidaRepository) {
        this.ninoRepository = ninoRepository;
        this.registroEntradaSalidaRepository = registroEntradaSalidaRepository;
    }

    @Transactional(readOnly = true)
    public List<VerificacionRecojoDto> consultarAutorizadosRecojo(String termino) {
        List<Nino> ninos = ninoRepository.findByActivoTrue();

        if (termino != null && !termino.trim().isEmpty()) {
            String termLower = termino.trim().toLowerCase();
            ninos = ninos.stream().filter(n ->
                    n.getDocumentoIdentidad().contains(termLower) ||
                    n.getNombres().toLowerCase().contains(termLower) ||
                    n.getApellidos().toLowerCase().contains(termLower)
            ).collect(Collectors.toList());
        }

        return ninos.stream().map(n -> {
            List<ContactoAutorizadoDto> contactos = n.getContactosAutorizados().stream()
                    .map(c -> new ContactoAutorizadoDto(
                            c.getId(),
                            c.getNombres(),
                            c.getApellidos(),
                            c.getParentesco(),
                            c.getTelefono(),
                            c.getDocumentoIdentidad()
                    ))
                    .collect(Collectors.toList());

            return new VerificacionRecojoDto(
                    n.getId(),
                    n.getNombres() + " " + n.getApellidos(),
                    n.getDocumentoIdentidad(),
                    n.getAula().getNombre(),
                    n.getAlergias(),
                    n.getIndicacionesMedicas(),
                    contactos
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public MarcadoEntradaSalidaResponse registrarMarcado(MarcadoEntradaSalidaRequest request) {
        Nino nino = ninoRepository.findById(request.getNinoId())
                .orElseThrow(() -> new IllegalArgumentException("El niño seleccionado no existe"));

        if (!nino.isActivo()) {
            throw new IllegalArgumentException("El niño seleccionado no se encuentra con matrícula activa");
        }

        if (request.getPersonaEntregaRecoge() == null || request.getPersonaEntregaRecoge().trim().isEmpty()) {
            throw new IllegalArgumentException("Debe especificar la persona responsable que entrega o recoge al niño");
        }

        // Hora sellada de forma estricta por el servidor (RF07)
        LocalTime horaServidor = LocalTime.now().withNano(0);
        LocalDate fechaHoy = LocalDate.now();

        RegistroEntradaSalida registro = new RegistroEntradaSalida(
                nino,
                request.getTipo(),
                fechaHoy,
                horaServidor,
                request.getPersonaEntregaRecoge().trim(),
                request.getDniPersona() != null ? request.getDniPersona().trim() : "",
                request.getObservaciones() != null ? request.getObservaciones().trim() : ""
        );

        RegistroEntradaSalida guardado = registroEntradaSalidaRepository.save(registro);

        String accionTexto = request.getTipo().name().equals("ENTRADA") ? "Entrada" : "Salida";

        return new MarcadoEntradaSalidaResponse(
                guardado.getId(),
                nino.getId(),
                nino.getNombres() + " " + nino.getApellidos(),
                nino.getDocumentoIdentidad(),
                nino.getAula().getNombre(),
                guardado.getTipo(),
                guardado.getFecha(),
                guardado.getHora(),
                guardado.getPersonaEntregaRecoge(),
                guardado.getDniPersona(),
                guardado.getObservaciones(),
                accionTexto + " registrada exitosamente en puerta (HU07 / RF11, RF07)"
        );
    }

    @Transactional(readOnly = true)
    public List<MarcadoEntradaSalidaResponse> listarMarcadosHoy() {
        LocalDate hoy = LocalDate.now();
        return registroEntradaSalidaRepository.findByFechaOrderByHoraDesc(hoy).stream()
                .map(r -> new MarcadoEntradaSalidaResponse(
                        r.getId(),
                        r.getNino().getId(),
                        r.getNino().getNombres() + " " + r.getNino().getApellidos(),
                        r.getNino().getDocumentoIdentidad(),
                        r.getNino().getAula().getNombre(),
                        r.getTipo(),
                        r.getFecha(),
                        r.getHora(),
                        r.getPersonaEntregaRecoge(),
                        r.getDniPersona(),
                        r.getObservaciones(),
                        "Registrado"
                ))
                .collect(Collectors.toList());
    }
}
