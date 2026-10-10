package com.guarderia.service;

import com.guarderia.domain.Aula;
import com.guarderia.domain.ContactoAutorizado;
import com.guarderia.domain.Nino;
import com.guarderia.dto.ContactoAutorizadoDto;
import com.guarderia.dto.MatriculaDetalleResponse;
import com.guarderia.dto.MatriculaRequest;
import com.guarderia.dto.MatriculaResponse;
import com.guarderia.repository.AulaRepository;
import com.guarderia.repository.NinoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatriculaService {

    private final NinoRepository ninoRepository;
    private final AulaRepository aulaRepository;

    public MatriculaService(NinoRepository ninoRepository, AulaRepository aulaRepository) {
        this.ninoRepository = ninoRepository;
        this.aulaRepository = aulaRepository;
    }

    @Transactional
    public MatriculaResponse registrarMatricula(MatriculaRequest request) {
        Aula aula = aulaRepository.findById(request.getAulaId())
                .orElseThrow(() -> new IllegalArgumentException("El aula seleccionada no existe"));

        String docTrimmed = request.getDocumentoIdentidad().trim();
        if (ninoRepository.existsByDocumentoIdentidad(docTrimmed)) {
            throw new IllegalArgumentException("Ya existe un niño registrado con el documento de identidad: " + docTrimmed);
        }

        if (request.getContactos() == null || request.getContactos().isEmpty()) {
            throw new IllegalArgumentException("Debe registrar al menos un contacto autorizado para el recojo del niño (RF04)");
        }

        Nino nino = new Nino(
                request.getNombres().trim(),
                request.getApellidos().trim(),
                docTrimmed,
                request.getFechaNacimiento(),
                request.getAlergias() != null ? request.getAlergias().trim() : "",
                request.getIndicacionesMedicas() != null ? request.getIndicacionesMedicas().trim() : "",
                aula
        );

        for (ContactoAutorizadoDto cDto : request.getContactos()) {
            ContactoAutorizado contacto = new ContactoAutorizado(
                    cDto.getNombres().trim(),
                    cDto.getApellidos().trim(),
                    cDto.getParentesco().trim(),
                    cDto.getTelefono().trim(),
                    cDto.getDocumentoIdentidad().trim()
            );
            nino.agregarContacto(contacto);
        }

        Nino saved = ninoRepository.save(nino);

        return new MatriculaResponse(
                saved.getId(),
                saved.getNombres(),
                saved.getApellidos(),
                saved.getDocumentoIdentidad(),
                saved.getFechaNacimiento(),
                saved.getAlergias(),
                saved.getIndicacionesMedicas(),
                aula.getId(),
                aula.getNombre(),
                saved.getFechaMatricula(),
                saved.getContactosAutorizados().size(),
                "Matrícula registrada exitosamente (HU01 / RF03)"
        );
    }

    @Transactional(readOnly = true)
    public MatriculaDetalleResponse obtenerNinoPorId(Long id) {
        Nino nino = ninoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El niño con ID " + id + " no existe"));

        List<ContactoAutorizadoDto> contactos = nino.getContactosAutorizados().stream()
                .map(c -> new ContactoAutorizadoDto(
                        c.getId(),
                        c.getNombres(),
                        c.getApellidos(),
                        c.getParentesco(),
                        c.getTelefono(),
                        c.getDocumentoIdentidad()
                ))
                .collect(Collectors.toList());

        return new MatriculaDetalleResponse(
                nino.getId(),
                nino.getNombres(),
                nino.getApellidos(),
                nino.getDocumentoIdentidad(),
                nino.getFechaNacimiento(),
                nino.getAlergias(),
                nino.getIndicacionesMedicas(),
                nino.getAula().getId(),
                nino.getAula().getNombre(),
                nino.getFechaMatricula(),
                nino.isActivo(),
                contactos
        );
    }

    @Transactional
    public MatriculaResponse modificarMatricula(Long id, MatriculaRequest request) {
        Nino nino = ninoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("El niño con ID " + id + " no existe"));

        Aula aula = aulaRepository.findById(request.getAulaId())
                .orElseThrow(() -> new IllegalArgumentException("El aula seleccionada no existe"));

        String docTrimmed = request.getDocumentoIdentidad().trim();
        if (ninoRepository.existsByDocumentoIdentidadAndIdNot(docTrimmed, id)) {
            throw new IllegalArgumentException("Ya existe otro niño registrado con el documento de identidad: " + docTrimmed);
        }

        if (request.getContactos() == null || request.getContactos().isEmpty()) {
            throw new IllegalArgumentException("Debe registrar al menos un contacto autorizado para el recojo del niño (RF04)");
        }

        nino.setNombres(request.getNombres().trim());
        nino.setApellidos(request.getApellidos().trim());
        nino.setDocumentoIdentidad(docTrimmed);
        nino.setFechaNacimiento(request.getFechaNacimiento());
        nino.setAlergias(request.getAlergias() != null ? request.getAlergias().trim() : "");
        nino.setIndicacionesMedicas(request.getIndicacionesMedicas() != null ? request.getIndicacionesMedicas().trim() : "");
        nino.setAula(aula);

        nino.getContactosAutorizados().clear();
        for (ContactoAutorizadoDto cDto : request.getContactos()) {
            ContactoAutorizado contacto = new ContactoAutorizado(
                    cDto.getNombres().trim(),
                    cDto.getApellidos().trim(),
                    cDto.getParentesco().trim(),
                    cDto.getTelefono().trim(),
                    cDto.getDocumentoIdentidad().trim()
            );
            nino.agregarContacto(contacto);
        }

        Nino saved = ninoRepository.save(nino);

        return new MatriculaResponse(
                saved.getId(),
                saved.getNombres(),
                saved.getApellidos(),
                saved.getDocumentoIdentidad(),
                saved.getFechaNacimiento(),
                saved.getAlergias(),
                saved.getIndicacionesMedicas(),
                aula.getId(),
                aula.getNombre(),
                saved.getFechaMatricula(),
                saved.getContactosAutorizados().size(),
                "Matrícula actualizada exitosamente (HU02 / RF05)"
        );
    }

    @Transactional(readOnly = true)
    public List<Aula> listarAulas() {
        return aulaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<MatriculaResponse> listarMatriculados() {
        return ninoRepository.findByActivoTrue().stream()
                .map(n -> new MatriculaResponse(
                        n.getId(),
                        n.getNombres(),
                        n.getApellidos(),
                        n.getDocumentoIdentidad(),
                        n.getFechaNacimiento(),
                        n.getAlergias(),
                        n.getIndicacionesMedicas(),
                        n.getAula().getId(),
                        n.getAula().getNombre(),
                        n.getFechaMatricula(),
                        n.getContactosAutorizados().size(),
                        "Registrado"
                ))
                .collect(Collectors.toList());
    }
}
