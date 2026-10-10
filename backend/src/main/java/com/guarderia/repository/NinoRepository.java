package com.guarderia.repository;

import com.guarderia.domain.Nino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NinoRepository extends JpaRepository<Nino, Long> {

    Optional<Nino> findByDocumentoIdentidad(String documentoIdentidad);

    boolean existsByDocumentoIdentidad(String documentoIdentidad);

    boolean existsByDocumentoIdentidadAndIdNot(String documentoIdentidad, Long id);

    List<Nino> findByAulaIdAndActivoTrue(Long aulaId);

    List<Nino> findByActivoTrue();
}
