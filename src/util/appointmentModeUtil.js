export const getAppointmentMode = (appMode) =>{
if(appMode === 'First Consultation') return "CONSULTATION";
return "FOLLOW_UP";
}