package com.guarderia.dto;

import java.time.LocalDate;
import java.util.List;

public class FichaNinoDto {

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
    private List<ContactoAutorizadoDto> contactos;

    public FichaNinoDto() {
    }

    public FichaNinoDto(Long id, String nombres, String apellidos, String documentoIdentidad,
                        LocalDate fechaNacimiento, String alergias, String indicacionesMedicas,
                        Long aulaId, String aulaNombre, List<ContactoAutorizadoDto> contactos) {
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
        this.contactos = contactos;
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

    public List<ContactoAutorizadoDto> getContactos() {
        return contactos;
    }

    public void setContactos(List<ContactoAutorizadoDto> contactos) {
        this.contactos = contactos;
    }
}
