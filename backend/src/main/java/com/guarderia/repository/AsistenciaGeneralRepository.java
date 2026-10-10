package com.guarderia.repository;

import com.guarderia.domain.Asistencia;
import com.guarderia.dto.AsistenciaGeneralDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaGeneralRepository extends JpaRepository<Asistencia, Long> {

    @Query("SELECT new com.guarderia.dto.AsistenciaGeneralDto(" +
           "a.nino.aula.nombre, a.nino.id, a.nino.nombres || ' ' || a.nino.apellidos, " +
           "a.fecha, a.presente, a.horaRegistro, a.observaciones) " +
           "FROM Asistencia a WHERE a.fecha BETWEEN :fechaInicio AND :fechaFin " +
           "ORDER BY a.fecha DESC, a.nino.aula.nombre, a.nino.apellidos")
    List<AsistenciaGeneralDto> findAsistenciaConsolidadaByRangoFechas(
            @Param("fechaInicio") LocalDate fechaInicio, 
            @Param("fechaFin") LocalDate fechaFin);
}
