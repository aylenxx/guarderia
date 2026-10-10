package com.guarderia.repository;

import com.guarderia.domain.RegistroEntradaSalida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RegistroEntradaSalidaRepository extends JpaRepository<RegistroEntradaSalida, Long> {

    List<RegistroEntradaSalida> findByFechaOrderByHoraDesc(LocalDate fecha);

    List<RegistroEntradaSalida> findByNinoIdAndFecha(Long ninoId, LocalDate fecha);
}
