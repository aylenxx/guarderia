package com.guarderia.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AsistenciaAulaResponse {

    private Long aulaId;
    private String aulaNombre;
    private LocalDate fecha;
    private LocalTime horaRegistroServidor;
    private int totalRegistrados;
    private int totalPresentes;
    private int totalAusentes;
    private String mensaje;

    public AsistenciaAulaResponse() {
    }

    public AsistenciaAulaResponse(Long aulaId, String aulaNombre, LocalDate fecha, LocalTime horaRegistroServidor, int totalRegistrados, int totalPresentes, int totalAusentes, String mensaje) {
        this.aulaId = aulaId;
        this.aulaNombre = aulaNombre;
        this.fecha = fecha;
        this.horaRegistroServidor = horaRegistroServidor;
        this.totalRegistrados = totalRegistrados;
        this.totalPresentes = totalPresentes;
        this.totalAusentes = totalAusentes;
        this.mensaje = mensaje;
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

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraRegistroServidor() {
        return horaRegistroServidor;
    }

    public void setHoraRegistroServidor(LocalTime horaRegistroServidor) {
        this.horaRegistroServidor = horaRegistroServidor;
    }

    public int getTotalRegistrados() {
        return totalRegistrados;
    }

    public void setTotalRegistrados(int totalRegistrados) {
        this.totalRegistrados = totalRegistrados;
    }

    public int getTotalPresentes() {
        return totalPresentes;
    }

    public void setTotalPresentes(int totalPresentes) {
        this.totalPresentes = totalPresentes;
    }

    public int getTotalAusentes() {
        return totalAusentes;
    }

    public void setTotalAusentes(int totalAusentes) {
        this.totalAusentes = totalAusentes;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
