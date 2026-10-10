package com.guarderia.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MatriculaResponse {

    private Long id;
    private String nombres;
    private String apellidos;
    private String nombreCompleto;
    private String documentoIdentidad;
    private LocalDate fechaNacimiento;
    private String alergias;
    private String indicacionesMedicas;
    private Long aulaId;
    private String aulaNombre;
    private LocalDateTime fechaMatricula;
    private int totalContactos;
    private String mensaje;

    public MatriculaResponse() {
    }

    public MatriculaResponse(Long id, String nombres, String apellidos, String documentoIdentidad,
                             LocalDate fechaNacimiento, String alergias, String indicacionesMedicas,
                             Long aulaId, String aulaNombre, LocalDateTime fechaMatricula,
                             int totalContactos, String mensaje) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.nombreCompleto = nombres + " " + apellidos;
        this.documentoIdentidad = documentoIdentidad;
        this.fechaNacimiento = fechaNacimiento;
        this.alergias = alergias;
        this.indicacionesMedicas = indicacionesMedicas;
        this.aulaId = aulaId;
        this.aulaNombre = aulaNombre;
        this.fechaMatricula = fechaMatricula;
        this.totalContactos = totalContactos;
        this.mensaje = mensaje;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public String getIndicacionesMedicas() {
        return indicacionesMedicas;
    }

    public void setIndicacionesMedicas(String indicacionesMedicas) {
        this.indicacionesMedicas = indicacionesMedicas;
    }

    public Long getAulaId() {
        return aulaId;
    }

    public void setAulaId(Long aulaId) {
        this.aulaId = aulaId;
    }

    public String getAulaNombre() {
        return aulaNombre;
    }

    public void setAulaNombre(String aulaNombre) {
        this.aulaNombre = aulaNombre;
    }

    public LocalDateTime getFechaMatricula() {
        return fechaMatricula;
    }

    public void setFechaMatricula(LocalDateTime fechaMatricula) {
        this.fechaMatricula = fechaMatricula;
    }

    public int getTotalContactos() {
        return totalContactos;
    }

    public void setTotalContactos(int totalContactos) {
        this.totalContactos = totalContactos;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
