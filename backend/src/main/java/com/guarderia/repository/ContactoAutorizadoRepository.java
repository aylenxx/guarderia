package com.guarderia.repository;

import com.guarderia.domain.ContactoAutorizado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactoAutorizadoRepository extends JpaRepository<ContactoAutorizado, Long> {
    List<ContactoAutorizado> findByNinoId(Long ninoId);
}
