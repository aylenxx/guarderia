package com.guarderia.dto;

import java.time.LocalTime;

public class AsistenciaItemDto {

    private Long ninoId;
    private String nombreCompleto;
    private String documentoIdentidad;
    private boolean presente;
    private LocalTime horaRegistro;
    private String observaciones;

    public AsistenciaItemDto() {
    }

    public AsistenciaItemDto(Long ninoId, String nombreCompleto, String documentoIdentidad, boolean presente, LocalTime horaRegistro, String observaciones) {
        this.ninoId = ninoId;
        this.nombreCompleto = nombreCompleto;
        this.documentoIdentidad = documentoIdentidad;
        this.presente = presente;
        this.horaRegistro = horaRegistro;
        this.observaciones = observaciones;
    }

    public Long getNinoId() {
        return ninoId;
    }

    public void setNinoId(Long ninoId) {
        this.ninoId = ninoId;
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

    public boolean isPresente() {
        return presente;
    }

    public void setPresente(boolean presente) {
        this.presente = presente;
    }

    public LocalTime getHoraRegistro() {
        return horaRegistro;
    }

    public void setHoraRegistro(LocalTime horaRegistro) {
        this.horaRegistro = horaRegistro;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
}
