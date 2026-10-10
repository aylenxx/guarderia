package com.guarderia.dto;

import com.guarderia.domain.TipoMovimiento;
import java.time.LocalDate;
import java.time.LocalTime;

public class MarcadoEntradaSalidaResponse {

    private Long id;
    private Long ninoId;
    private String nombreNino;
    private String documentoNino;
    private String aulaNombre;
    private TipoMovimiento tipo;
    private LocalDate fecha;
    private LocalTime horaServidor;
    private String personaEntregaRecoge;
    private String dniPersona;
    private String observaciones;
    private String mensaje;

    public MarcadoEntradaSalidaResponse() {
    }

    public MarcadoEntradaSalidaResponse(Long id, Long ninoId, String nombreNino, String documentoNino, String aulaNombre, TipoMovimiento tipo, LocalDate fecha, LocalTime horaServidor, String personaEntregaRecoge, String dniPersona, String observaciones, String mensaje) {
        this.id = id;
        this.ninoId = ninoId;
        this.nombreNino = nombreNino;
        this.documentoNino = documentoNino;
        this.aulaNombre = aulaNombre;
        this.tipo = tipo;
        this.fecha = fecha;
        this.horaServidor = horaServidor;
        this.personaEntregaRecoge = personaEntregaRecoge;
        this.dniPersona = dniPersona;
        this.observaciones = observaciones;
        this.mensaje = mensaje;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNinoId() {
        return ninoId;
    }

    public void setNinoId(Long ninoId) {
        this.ninoId = ninoId;
    }

    public String getNombreNino() {
        return nombreNino;
    }

    public void setNombreNino(String nombreNino) {
        this.nombreNino = nombreNino;
    }

    public String getDocumentoNino() {
        return documentoNino;
    }

    public void setDocumentoNino(String documentoNino) {
        this.documentoNino = documentoNino;
    }

    public String getAulaNombre() {
        return aulaNombre;
    }

    public void setAulaNombre(String aulaNombre) {
        this.aulaNombre = aulaNombre;
    }

    public TipoMovimiento getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimiento tipo) {
        this.tipo = tipo;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHoraServidor() {
        return horaServidor;
    }

    public void setHoraServidor(LocalTime horaServidor) {
        this.horaServidor = horaServidor;
    }

    public String getPersonaEntregaRecoge() {
        return personaEntregaRecoge;
    }

    public void setPersonaEntregaRecoge(String personaEntregaRecoge) {
        this.personaEntregaRecoge = personaEntregaRecoge;
    }

    public String getDniPersona() {
        return dniPersona;
    }

    public void setDniPersona(String dniPersona) {
        this.dniPersona = dniPersona;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
