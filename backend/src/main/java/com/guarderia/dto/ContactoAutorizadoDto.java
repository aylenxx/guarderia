package com.guarderia.dto;

import jakarta.validation.constraints.NotBlank;

public class ContactoAutorizadoDto {

    private Long id;

    @NotBlank(message = "El nombre del contacto es obligatorio")
    private String nombres;

    @NotBlank(message = "El apellido del contacto es obligatorio")
    private String apellidos;

    @NotBlank(message = "El parentesco del contacto es obligatorio")
    private String parentesco;

    @NotBlank(message = "El teléfono del contacto es obligatorio")
    private String telefono;

    @NotBlank(message = "El documento del contacto es obligatorio")
    private String documentoIdentidad;

    public ContactoAutorizadoDto() {
    }

    public ContactoAutorizadoDto(String nombres, String apellidos, String parentesco, String telefono, String documentoIdentidad) {
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.parentesco = parentesco;
        this.telefono = telefono;
        this.documentoIdentidad = documentoIdentidad;
    }

    public ContactoAutorizadoDto(Long id, String nombres, String apellidos, String parentesco, String telefono, String documentoIdentidad) {
        this.id = id;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.parentesco = parentesco;
        this.telefono = telefono;
        this.documentoIdentidad = documentoIdentidad;
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

    public String getParentesco() {
        return parentesco;
    }

    public void setParentesco(String parentesco) {
        this.parentesco = parentesco;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }
}
