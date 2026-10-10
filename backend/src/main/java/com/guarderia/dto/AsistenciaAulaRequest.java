package com.guarderia.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class AsistenciaAulaRequest {

    @NotNull(message = "El aula es obligatoria")
    private Long aulaId;

    @NotNull(message = "La fecha de asistencia es obligatoria")
    private LocalDate fecha;

    @NotEmpty(message = "Debe registrar la asistencia de al menos un niño")
    private List<AsistenciaRegistroItem> registros;

    public static class AsistenciaRegistroItem {
        @NotNull(message = "El ID del niño es obligatorio")
        private Long ninoId;

        private boolean presente;
        private String observaciones;

        public AsistenciaRegistroItem() {
        }

        public AsistenciaRegistroItem(Long ninoId, boolean presente, String observaciones) {
            this.ninoId = ninoId;
            this.presente = presente;
            this.observaciones = observaciones;
        }

        public Long getNinoId() {
            return ninoId;
        }

        public void setNinoId(Long ninoId) {
            this.ninoId = ninoId;
        }

        public boolean isPresente() {
            return presente;
        }

        public void setPresente(boolean presente) {
            this.presente = presente;
        }

        public String getObservaciones() {
            return observaciones;
        }

        public void setObservaciones(String observaciones) {
            this.observaciones = observaciones;
        }
    }

    public AsistenciaAulaRequest() {
    }

    public AsistenciaAulaRequest(Long aulaId, LocalDate fecha, List<AsistenciaRegistroItem> registros) {
        this.aulaId = aulaId;
        this.fecha = fecha;
        this.registros = registros;
    }

    public Long getAulaId() {
        return aulaId;
    }

    public void setAulaId(Long aulaId) {
        this.aulaId = aulaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public List<AsistenciaRegistroItem> getRegistros() {
        return registros;
    }

    public void setRegistros(List<AsistenciaRegistroItem> registros) {
        this.registros = registros;
    }
}
