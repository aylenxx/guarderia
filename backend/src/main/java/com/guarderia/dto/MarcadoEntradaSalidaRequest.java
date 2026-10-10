package com.guarderia.dto;

import com.guarderia.domain.TipoMovimiento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MarcadoEntradaSalidaRequest {

    @NotNull(message = "El ID del niño es obligatorio")
    private Long ninoId;

    @NotNull(message = "El tipo de movimiento es obligatorio (ENTRADA o SALIDA)")
    private TipoMovimiento tipo;

    @NotBlank(message = "Debe indicar el nombre de la persona que entrega o recoge al niño")
    private String personaEntregaRecoge;

    private String dniPersona;

    private String observaciones;

    public MarcadoEntradaSalidaRequest() {
    }

    public MarcadoEntradaSalidaRequest(Long ninoId, TipoMovimiento tipo, String personaEntregaRecoge, String dniPersona, String observaciones) {
        this.ninoId = ninoId;
        this.tipo = tipo;
        this.personaEntregaRecoge = personaEntregaRecoge;
        this.dniPersona = dniPersona;
        this.observaciones = observaciones;
    }

    public Long getNinoId() {
        return ninoId;
    }

    public void setNinoId(Long ninoId) {
        this.ninoId = ninoId;
    }

    public TipoMovimiento getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimiento tipo) {
        this.tipo = tipo;
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
}
