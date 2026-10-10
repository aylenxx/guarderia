package com.guarderia.controller;

import com.guarderia.dto.MarcadoEntradaSalidaRequest;
import com.guarderia.dto.MarcadoEntradaSalidaResponse;
import com.guarderia.dto.VerificacionRecojoDto;
import com.guarderia.service.RecepcionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recepcion")
public class RecepcionController {

    private final RecepcionService recepcionService;

    public RecepcionController(RecepcionService recepcionService) {
        this.recepcionService = recepcionService;
    }

    @GetMapping("/autorizados")
    @PreAuthorize("hasAnyRole('RECEPCION', 'DIRECTORA')")
    public ResponseEntity<List<VerificacionRecojoDto>> consultarAutorizados(
            @RequestParam(required = false) String termino) {
        List<VerificacionRecojoDto> lista = recepcionService.consultarAutorizadosRecojo(termino);
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/marcado")
    @PreAuthorize("hasRole('RECEPCION')")
    public ResponseEntity<MarcadoEntradaSalidaResponse> registrarMarcado(
            @Valid @RequestBody MarcadoEntradaSalidaRequest request) {
        MarcadoEntradaSalidaResponse response = recepcionService.registrarMarcado(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/marcados-hoy")
    @PreAuthorize("hasAnyRole('RECEPCION', 'DIRECTORA')")
    public ResponseEntity<List<MarcadoEntradaSalidaResponse>> listarMarcadosHoy() {
        List<MarcadoEntradaSalidaResponse> lista = recepcionService.listarMarcadosHoy();
        return ResponseEntity.ok(lista);
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
        response.put("mensaje", "Datos del formulario de recepción inválidos (RF13)");
        response.put("errores", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
