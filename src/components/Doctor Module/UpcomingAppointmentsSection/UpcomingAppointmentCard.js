import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import moment from "moment";
import { useHistory } from "react-router";
import calendarSmall from "../../../images/svg/calender-beige.svg";
import timeSmall from "../../../images/svg/time-teal.svg";
import useRole from "../../../custom-hooks/useRole";
import { ROLES } from "../../../util/configurations";

const UpcomingAppointmentCard = ({ appointment }) => {
  const [appointmentPersonKey, setAppointmentPersonKey] = useState("");
  const [roles] = useRole();
  const history = useHistory();
  useEffect(() => {
    const key = roles.some((role) => role === ROLES.ROLE_PATIENT)
      ? "doctor"
      : "patient";
    setAppointmentPersonKey(key);
  }, []);
  const handleClickToAppointmentsPage = () => {
    history.push(`/doctor/my-appointments?APID=${appointment.id}`);
  }
  return (

    <div className="row align-items-start" style={{ cursor: 'pointer' }} onClick={handleClickToAppointmentsPage}>
      {/* {console.log('UA', appointment)} */}
      <div className="col-md-3">
        {
          appointment.patient.picture ? (
            <img
              src={appointment.patient.picture}
              alt={`${appointment.patient.firstName}-image`}
              className="img-circle ml-3 mt-3"
            />
          ) : (
            <Avatar
              round={true}
              name={
                appointment.patient.firstName
              }
              size={60}
              className="my-appointments-avatar-doctor"
            />
          )
        }
      </div>
      <div className="col-md-9">
        <div className="upcoming-appointment-card__card-details">
          <h5 className="upcoming-appointment-card__doctor-name">
            {appointment[appointmentPersonKey] &&
              appointment[appointmentPersonKey].firstName +
              " " +
              (appointment[appointmentPersonKey].lastName || "")}
          </h5>
          <span className="upcoming-appointment-card__specality">
            {appointmentPersonKey === "doctor" &&
              appointment[appointmentPersonKey] &&
              appointment[appointmentPersonKey].specialities.length &&
              appointment[appointmentPersonKey].specialities[0].name}

            {appointmentPersonKey === "patient" &&
              appointment.appointmentMode}
          </span>
          <div className="upcoming-appointment-card__card-details--date-div">
            <div className="upcoming-appointment-card__card-time-row">
              <img src={calendarSmall} />
              <span className="upcoming-appointment-card__common-span">
                {moment(appointment.startTime).format("DD/MM/YY")}
              </span>
            </div>
            <div className="upcoming-appointment-card__card-time-row ml-4">
              <img src={timeSmall} />
              <span className="upcoming-appointment-card__common-span">
                {moment(appointment.startTime).format("hh:mm A")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingAppointmentCard;
