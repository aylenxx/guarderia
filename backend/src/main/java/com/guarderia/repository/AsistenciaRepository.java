package com.guarderia.repository;

import com.guarderia.domain.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    Optional<Asistencia> findByNinoIdAndFecha(Long ninoId, LocalDate fecha);

    List<Asistencia> findByNinoAulaIdAndFecha(Long aulaId, LocalDate fecha);

    List<Asistencia> findByFecha(LocalDate fecha);
}
