import moment from "moment";

export const getAppointmentTime = (appointment) => {
    const currentTime = moment(new Date());
    const appointmentStartTime = moment(new Date(appointment.startTime));
    const appointmentEndTime = moment(
      new Date(appointment.endTime)
    );

    return { currentTime, appointmentStartTime, appointmentEndTime };
  };

export const videoCallEndCheck = (appointment) => {
    const {
      currentTime,
      appointmentStartTime,
      appointmentEndTime,
    } = getAppointmentTime(appointment);

    const videoDisableTime = appointmentEndTime.clone().subtract(5, "minutes");
  
    if (
      currentTime.isBefore(appointmentEndTime) && 
      currentTime.isSameOrAfter(videoDisableTime)
    ) {
      return true;
    }

    return false;
  }

export const isVideoGoingToEnd = (appointments) => {
  return appointments.some(videoCallEndCheck);
}
 
 export const videoEnableCheck = (appointment) => {
    const {
      currentTime,
      appointmentStartTime,
      appointmentEndTime,
    } = getAppointmentTime(appointment);

    const videoEnableTime = appointmentStartTime.clone().subtract(5, "minutes");

    if (
      currentTime.isSameOrAfter(videoEnableTime) &&
      currentTime.isBefore(appointmentEndTime)
    ) {
      return true;
    }

    return false;
  };

 export const chatEnableCheck = (appointment) => {
    const {
      currentTime,
      appointmentStartTime,
      appointmentEndTime,
    } = getAppointmentTime(appointment);

    const chatEnableTime = appointmentStartTime.clone().subtract(2, "days");

    const chatEndCondition = appointmentEndTime.clone().add(3, "days");

    if (
      currentTime.isSameOrAfter(chatEnableTime) &&
      currentTime.isBefore(chatEndCondition)
    ) {
      return true
    }

    return false
  };

export const videoValiation = (appointments) => {
    return appointments.some(videoEnableCheck);
}

export const chatValidation = (appointments) => {
    return appointments.some(chatEnableCheck);
}

