export const getAppointmentMode = (appMode) => {
    if (appMode === 'First Consultation') return "CONSULTATION";
    return "FOLLOW_UP";
}

export const getAppointmentModeForAvailabilitySlotsDisplay = (appMode) => {
    if (appMode === 'First Consultation') return "FIRST_CONSULTATION";
    return "FOLLOW_UP";
}

export const getAppointmentModeToDisplayAsLabel = (appMode) => {
    if (appMode === 'First Consultation') return "Consultation (1 Hr)";
    return "Follow Up (30 Mins)";
}