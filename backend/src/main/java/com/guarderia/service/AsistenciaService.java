package com.guarderia.service;

import com.guarderia.domain.Asistencia;
import com.guarderia.domain.Aula;
import com.guarderia.domain.Nino;
import com.guarderia.dto.*;
import com.guarderia.repository.AsistenciaRepository;
import com.guarderia.repository.AulaRepository;
import com.guarderia.repository.NinoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final NinoRepository ninoRepository;
    private final AulaRepository aulaRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository, NinoRepository ninoRepository, AulaRepository aulaRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.ninoRepository = ninoRepository;
        this.aulaRepository = aulaRepository;
    }

    @Transactional(readOnly = true)
    public List<FichaNinoDto> obtenerFichasPorAula(Long aulaId) {
        Aula aula = aulaRepository.findById(aulaId)
                .orElseThrow(() -> new IllegalArgumentException("El aula especificada no existe"));

        List<Nino> ninos = ninoRepository.findByAulaIdAndActivoTrue(aulaId);

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

            return new FichaNinoDto(
                    n.getId(),
                    n.getNombres(),
                    n.getApellidos(),
                    n.getDocumentoIdentidad(),
                    n.getFechaNacimiento(),
                    n.getAlergias(),
                    n.getIndicacionesMedicas(),
                    aula.getId(),
                    aula.getNombre(),
                    contactos
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsistenciaItemDto> obtenerAsistenciaAula(Long aulaId, LocalDate fecha) {
        aulaRepository.findById(aulaId)
                .orElseThrow(() -> new IllegalArgumentException("El aula especificada no existe"));

        List<Nino> ninos = ninoRepository.findByAulaIdAndActivoTrue(aulaId);
        List<AsistenciaItemDto> resultado = new ArrayList<>();

        for (Nino nino : ninos) {
            Optional<Asistencia> asistenciaOpt = asistenciaRepository.findByNinoIdAndFecha(nino.getId(), fecha);
            if (asistenciaOpt.isPresent()) {
                Asistencia a = asistenciaOpt.get();
                resultado.add(new AsistenciaItemDto(
                        nino.getId(),
                        nino.getNombres() + " " + nino.getApellidos(),
                        nino.getDocumentoIdentidad(),
                        a.isPresente(),
                        a.getHoraRegistro(),
                        a.getObservaciones()
                ));
            } else {
                resultado.add(new AsistenciaItemDto(
                        nino.getId(),
                        nino.getNombres() + " " + nino.getApellidos(),
                        nino.getDocumentoIdentidad(),
                        true,
                        null,
                        ""
                ));
            }
        }

        return resultado;
    }

    @Transactional
    public AsistenciaAulaResponse registrarAsistenciaAula(AsistenciaAulaRequest request) {
        Aula aula = aulaRepository.findById(request.getAulaId())
                .orElseThrow(() -> new IllegalArgumentException("El aula especificada no existe"));

        if (request.getRegistros() == null || request.getRegistros().isEmpty()) {
            throw new IllegalArgumentException("Debe incluir al menos un registro de asistencia");
        }

        // Hora fijada estrictamente por el servidor (RF07)
        LocalTime horaServidor = LocalTime.now().withNano(0);
        int totalPresentes = 0;
        int totalAusentes = 0;

        for (AsistenciaAulaRequest.AsistenciaRegistroItem item : request.getRegistros()) {
            Nino nino = ninoRepository.findById(item.getNinoId())
                    .orElseThrow(() -> new IllegalArgumentException("El niño con ID " + item.getNinoId() + " no existe"));

            if (!nino.getAula().getId().equals(aula.getId())) {
                throw new IllegalArgumentException("El niño " + nino.getNombres() + " no pertenece al aula seleccionada");
            }

            Optional<Asistencia> asistenciaExistente = asistenciaRepository.findByNinoIdAndFecha(nino.getId(), request.getFecha());
            Asistencia asistencia;

            if (asistenciaExistente.isPresent()) {
                asistencia = asistenciaExistente.get();
                asistencia.setPresente(item.isPresente());
                asistencia.setHoraRegistro(horaServidor);
                asistencia.setObservaciones(item.getObservaciones() != null ? item.getObservaciones().trim() : "");
            } else {
                asistencia = new Asistencia(
                        nino,
                        request.getFecha(),
                        item.isPresente(),
                        horaServidor,
                        item.getObservaciones() != null ? item.getObservaciones().trim() : ""
                );
            }

            asistenciaRepository.save(asistencia);

            if (item.isPresente()) {
                totalPresentes++;
            } else {
                totalAusentes++;
            }
        }

        return new AsistenciaAulaResponse(
                aula.getId(),
                aula.getNombre(),
                request.getFecha(),
                horaServidor,
                request.getRegistros().size(),
                totalPresentes,
                totalAusentes,
                "Asistencia registrada exitosamente (HU04 / RF06, RF07)"
        );
    }
}
