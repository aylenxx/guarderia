package com.guarderia.dto;

import java.util.List;

public class VerificacionRecojoDto {

    private Long ninoId;
    private String nombreCompleto;
    private String documentoIdentidad;
    private String aulaNombre;
    private String alergias;
    private String indicacionesMedicas;
    private List<ContactoAutorizadoDto> personasAutorizadas;

    public VerificacionRecojoDto() {
    }

    public VerificacionRecojoDto(Long ninoId, String nombreCompleto, String documentoIdentidad, String aulaNombre, String alergias, String indicacionesMedicas, List<ContactoAutorizadoDto> personasAutorizadas) {
        this.ninoId = ninoId;
        this.nombreCompleto = nombreCompleto;
        this.documentoIdentidad = documentoIdentidad;
        this.aulaNombre = aulaNombre;
        this.alergias = alergias;
        this.indicacionesMedicas = indicacionesMedicas;
        this.personasAutorizadas = personasAutorizadas;
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

    public String getAulaNombre() {
        return aulaNombre;
    }

    public void setAulaNombre(String aulaNombre) {
        this.aulaNombre = aulaNombre;
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

    public List<ContactoAutorizadoDto> getPersonasAutorizadas() {
        return personasAutorizadas;
    }

    public void setPersonasAutorizadas(List<ContactoAutorizadoDto> personasAutorizadas) {
        this.personasAutorizadas = personasAutorizadas;
    }
}
