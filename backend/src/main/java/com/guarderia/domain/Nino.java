package com.guarderia.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ninos")
public class Nino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String nombres;

    @Column(nullable = false, length = 80)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 20)
    private String documentoIdentidad;

    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @Column(length = 255)
    private String alergias;

    @Column(length = 255)
    private String indicacionesMedicas;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aula_id", nullable = false)
    private Aula aula;

    @Column(nullable = false)
    private LocalDateTime fechaMatricula = LocalDateTime.now();

    @Column(nullable = false)
    private boolean activo = true;

    @OneToMany(mappedBy = "nino", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ContactoAutorizado> contactosAutorizados = new ArrayList<>();

    public Nino() {
    }

    public Nino(String nombres, String apellidos, String documentoIdentidad, LocalDate fechaNacimiento,
                String alergias, String indicacionesMedicas, Aula aula) {
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.documentoIdentidad = documentoIdentidad;
        this.fechaNacimiento = fechaNacimiento;
        this.alergias = alergias;
        this.indicacionesMedicas = indicacionesMedicas;
        this.aula = aula;
        this.fechaMatricula = LocalDateTime.now();
        this.activo = true;
    }

    public void agregarContacto(ContactoAutorizado contacto) {
        this.contactosAutorizados.add(contacto);
        contacto.setNino(this);
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

    public Aula getAula() {
        return aula;
    }

    public void setAula(Aula aula) {
        this.aula = aula;
    }

    public LocalDateTime getFechaMatricula() {
        return fechaMatricula;
    }

    public void setFechaMatricula(LocalDateTime fechaMatricula) {
        this.fechaMatricula = fechaMatricula;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public List<ContactoAutorizado> getContactosAutorizados() {
        return contactosAutorizados;
    }

    public void setContactosAutorizados(List<ContactoAutorizado> contactosAutorizados) {
        this.contactosAutorizados = contactosAutorizados;
    }
}
