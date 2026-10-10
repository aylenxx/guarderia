package com.guarderia.controller;

import com.guarderia.dto.AsistenciaGeneralDto;
import com.guarderia.service.AsistenciaGeneralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias/general")
public class AsistenciaGeneralController {

    @Autowired
    private AsistenciaGeneralService asistenciaGeneralService;

    @GetMapping
    @PreAuthorize("hasRole('DIRECTORA')")
    public ResponseEntity<List<AsistenciaGeneralDto>> obtenerAsistenciaGeneral(
            @RequestParam("fechaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam("fechaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        
        if (fechaInicio.isAfter(fechaFin)) {
            return ResponseEntity.badRequest().build();
        }

        List<AsistenciaGeneralDto> asistencia = asistenciaGeneralService.obtenerConsolidadoPorRangoFechas(fechaInicio, fechaFin);
        return ResponseEntity.ok(asistencia);
    }
}
