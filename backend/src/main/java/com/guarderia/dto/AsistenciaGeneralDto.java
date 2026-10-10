package com.guarderia.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AsistenciaGeneralDto {
    private String nombreAula;
    private Long ninoId;
    private String nombreNino;
    private LocalDate fecha;
    private Boolean presente;
    private LocalTime horaRegistro;
    private String observaciones;

    public AsistenciaGeneralDto() {}

    public AsistenciaGeneralDto(String nombreAula, Long ninoId, String nombreNino, LocalDate fecha, Boolean presente, LocalTime horaRegistro, String observaciones) {
        this.nombreAula = nombreAula;
        this.ninoId = ninoId;
        this.nombreNino = nombreNino;
        this.fecha = fecha;
        this.presente = presente;
        this.horaRegistro = horaRegistro;
        this.observaciones = observaciones;
    }

    public String getNombreAula() { return nombreAula; }
    public void setNombreAula(String nombreAula) { this.nombreAula = nombreAula; }
    public Long getNinoId() { return ninoId; }
    public void setNinoId(Long ninoId) { this.ninoId = ninoId; }
    public String getNombreNino() { return nombreNino; }
    public void setNombreNino(String nombreNino) { this.nombreNino = nombreNino; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    public Boolean getPresente() { return presente; }
    public void setPresente(Boolean presente) { this.presente = presente; }
    public LocalTime getHoraRegistro() { return horaRegistro; }
    public void setHoraRegistro(LocalTime horaRegistro) { this.horaRegistro = horaRegistro; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}
