package com.guarderia.domain;

/**
 * Roles autorizados del sistema según agent_handover.md:
 * - Directora
 * - Profesora
 * - Recepción
 * (Nota: No existe rol Padres según el alcance oficial).
 */
public enum Rol {
    DIRECTORA,
    PROFESORA,
    RECEPCION
}
