package com.guarderia.controller;

import com.guarderia.dto.*;
import com.guarderia.service.AsistenciaService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    @GetMapping("/fichas/aula/{aulaId}")
    @PreAuthorize("hasAnyRole('PROFESORA', 'DIRECTORA')")
    public ResponseEntity<List<FichaNinoDto>> obtenerFichasAula(@PathVariable Long aulaId) {
        List<FichaNinoDto> fichas = asistenciaService.obtenerFichasPorAula(aulaId);
        return ResponseEntity.ok(fichas);
    }

    @GetMapping("/aula/{aulaId}")
    @PreAuthorize("hasAnyRole('PROFESORA', 'DIRECTORA')")
    public ResponseEntity<List<AsistenciaItemDto>> obtenerAsistenciaAula(
            @PathVariable Long aulaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        if (fecha == null) {
            fecha = LocalDate.now();
        }
        List<AsistenciaItemDto> items = asistenciaService.obtenerAsistenciaAula(aulaId, fecha);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/aula")
    @PreAuthorize("hasRole('PROFESORA')")
    public ResponseEntity<AsistenciaAulaResponse> registrarAsistenciaAula(
            @Valid @RequestBody AsistenciaAulaRequest request) {
        AsistenciaAulaResponse response = asistenciaService.registrarAsistenciaAula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> error = new HashMap<>();
        error.put("status", HttpStatus.BAD_REQUEST.value());
        error.put("error", "Bad Request");
        error.put("mensaje", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");
        response.put("mensaje", "Datos del formulario de asistencia inválidos (RF13)");
        response.put("errores", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
