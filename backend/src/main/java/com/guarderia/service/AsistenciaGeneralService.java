package com.guarderia.service;

import com.guarderia.dto.AsistenciaGeneralDto;
import com.guarderia.repository.AsistenciaGeneralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AsistenciaGeneralService {

    @Autowired
    private AsistenciaGeneralRepository asistenciaGeneralRepository;

    public List<AsistenciaGeneralDto> obtenerConsolidadoPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        return asistenciaGeneralRepository.findAsistenciaConsolidadaByRangoFechas(fechaInicio, fechaFin);
    }
}
