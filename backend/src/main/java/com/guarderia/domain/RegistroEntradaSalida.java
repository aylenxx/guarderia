package com.guarderia.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "registros_entrada_salida")
public class RegistroEntradaSalida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "nino_id", nullable = false)
    private Nino nino;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoMovimiento tipo;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false, length = 120)
    private String personaEntregaRecoge;

    @Column(length = 20)
    private String dniPersona;

    @Column(length = 255)
    private String observaciones;

    public RegistroEntradaSalida() {
    }

    public RegistroEntradaSalida(Nino nino, TipoMovimiento tipo, LocalDate fecha, LocalTime hora, String personaEntregaRecoge, String dniPersona, String observaciones) {
        this.nino = nino;
        this.tipo = tipo;
        this.fecha = fecha;
        this.hora = hora;
        this.personaEntregaRecoge = personaEntregaRecoge;
        this.dniPersona = dniPersona;
        this.observaciones = observaciones;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Nino getNino() {
        return nino;
    }

    public void setNino(Nino nino) {
        this.nino = nino;
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

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
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
