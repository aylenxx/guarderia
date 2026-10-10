package com.guarderia.config;

import com.guarderia.domain.*;
import com.guarderia.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AulaRepository aulaRepository;
    private final NinoRepository ninoRepository;
    private final AsistenciaRepository asistenciaRepository;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, AulaRepository aulaRepository, NinoRepository ninoRepository, AsistenciaRepository asistenciaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.aulaRepository = aulaRepository;
        this.ninoRepository = ninoRepository;
        this.asistenciaRepository = asistenciaRepository;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            Usuario directora = new Usuario("directora", passwordEncoder.encode("Directora123*"), "Directora General", Rol.DIRECTORA, true);
            Usuario profesora = new Usuario("profesora", passwordEncoder.encode("Profesora123*"), "Profesora de Aula", Rol.PROFESORA, true);
            Usuario recepcion = new Usuario("recepcion", passwordEncoder.encode("Recepcion123*"), "Personal de Recepción", Rol.RECEPCION, true);
            usuarioRepository.save(directora);
            usuarioRepository.save(profesora);
            usuarioRepository.save(recepcion);
        }

        Aula aula1 = null;
        Aula aula2 = null;
        if (aulaRepository.count() == 0) {
            aula1 = aulaRepository.save(new Aula("Aula 1", 15));
            aula2 = aulaRepository.save(new Aula("Aula 2", 15));
        } else {
            List<Aula> aulas = aulaRepository.findAll();
            if (aulas.size() >= 2) {
                aula1 = aulas.get(0);
                aula2 = aulas.get(1);
            }
        }

        if (ninoRepository.count() == 0 && aula1 != null && aula2 != null) {
            logger.info("Generando 10 niños ficticios con asistencias...");
            String[] nombres = {"Mateo", "Valentina", "Santiago", "Camila", "Sebastián", "Isabella", "Matias", "Valeria", "Diego", "Mariana"};
            String[] apellidos = {"García", "López", "Martínez", "Rodríguez", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores"};
            String[] alergias = {"Polvo", "Maní", "Ninguna", "Picaduras de abeja", "Lactosa"};
            
            Random random = new Random();
            List<Nino> ninosGenerados = new ArrayList<>();

            for (int i = 0; i < 10; i++) {
                Aula aulaAsignada = (i < 5) ? aula1 : aula2;
                Nino nino = new Nino(
                    nombres[i], 
                    apellidos[i], 
                    "7000000" + i, 
                    LocalDate.of(2020 + random.nextInt(3), random.nextInt(12) + 1, random.nextInt(28) + 1),
                    alergias[random.nextInt(alergias.length)],
                    "Control pediátrico al día",
                    aulaAsignada
                );

                ContactoAutorizado contacto = new ContactoAutorizado("Padre " + nombres[i], apellidos[i], "Padre/Madre", "98765432" + i, "4000000" + i);
                contacto.setNino(nino);
                nino.getContactosAutorizados().add(contacto);

                ninosGenerados.add(ninoRepository.save(nino));
            }

            // Generar asistencia para los últimos 5 días (ej. de lunes a viernes)
            LocalDate hoy = LocalDate.now();
            for (int i = 0; i < 5; i++) {
                LocalDate fechaAsistencia = hoy.minusDays(i);
                for (Nino nino : ninosGenerados) {
                    boolean presente = random.nextInt(100) > 15; // 85% de probabilidad de asistir
                    String obs = "";
                    LocalTime horaReg = LocalTime.of(8, random.nextInt(30)); // 8:00 a 8:29
                    
                    if (presente) {
                        if (random.nextInt(100) > 70) {
                            obs = "Tardanza: Llegó después de la hora";
                            horaReg = LocalTime.of(8, 45 + random.nextInt(15)); // Llegó tarde
                        } else {
                            obs = "A tiempo";
                        }
                    } else {
                        obs = "Ausencia justificada por enfermedad";
                    }

                    Asistencia asistencia = new Asistencia(nino, fechaAsistencia, presente, horaReg, obs);
                    asistenciaRepository.save(asistencia);
                }
            }
            logger.info("Datos ficticios generados exitosamente.");
        }
    }
}
