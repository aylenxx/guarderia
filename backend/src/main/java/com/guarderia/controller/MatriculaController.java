package com.guarderia.controller;

import com.guarderia.domain.Aula;
import com.guarderia.dto.MatriculaDetalleResponse;
import com.guarderia.dto.MatriculaRequest;
import com.guarderia.dto.MatriculaResponse;
import com.guarderia.service.MatriculaService;
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
@RequestMapping("/api/matriculas")
public class MatriculaController {

    private final MatriculaService matriculaService;

    public MatriculaController(MatriculaService matriculaService) {
        this.matriculaService = matriculaService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DIRECTORA')")
    public ResponseEntity<MatriculaResponse> registrarMatricula(@Valid @RequestBody MatriculaRequest request) {
        MatriculaResponse response = matriculaService.registrarMatricula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('DIRECTORA')")
    public ResponseEntity<List<MatriculaResponse>> listarMatriculas() {
        List<MatriculaResponse> list = matriculaService.listarMatriculados();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTORA')")
    public ResponseEntity<MatriculaDetalleResponse> obtenerMatricula(@PathVariable Long id) {
        MatriculaDetalleResponse response = matriculaService.obtenerNinoPorId(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DIRECTORA')")
    public ResponseEntity<MatriculaResponse> modificarMatricula(@PathVariable Long id, @Valid @RequestBody MatriculaRequest request) {
        MatriculaResponse response = matriculaService.modificarMatricula(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/aulas")
    @PreAuthorize("hasAnyRole('DIRECTORA', 'PROFESORA', 'RECEPCION')")
    public ResponseEntity<List<Aula>> listarAulas() {
        List<Aula> aulas = matriculaService.listarAulas();
        return ResponseEntity.ok(aulas);
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
        response.put("mensaje", "Datos del formulario de matrícula inválidos (RF13)");
        response.put("errores", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
