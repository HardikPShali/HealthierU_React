import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import home2 from "../../../images/home-2.png";
import moment from "moment";
import calendarSmall from "../../../images/svg/calender-beige.svg";
import timeSmall from "../../../images/svg/time-teal.svg";
import useRole from "../../../custom-hooks/useRole";
import { ROLES } from "../../../util/configurations";
import Avatar from "react-avatar";

const UpcomingAppointmentCard = ({ appointment }) => {
  const [appointmentPersonKey, setAppointmentPersonKey] = useState("");
  const [roles] = useRole();

  const history = useHistory();

  const handleClickToAppointmentsPage = () => {
    history.push('/patient/myappointment');
  }

  useEffect(() => {
    const key = roles.some((role) => role === ROLES.ROLE_PATIENT)
      ? "doctor"
      : "patient";
    setAppointmentPersonKey(key);
  }, []);

  return (
    // console.log('UA', appointments)
    <div className="row align-items-start" style={{ cursor: 'pointer' }} onClick={handleClickToAppointmentsPage}>
      {/* {console.log('UA', appointment)} */}
      <div className="col-md-3">
        {/* <img src={appointment.doctor.picture} alt="nutrition" className="img-circle ml-3 mt-3" /> */}
        {
          appointment.doctor ? (
            <img
              src={appointment.doctor.picture}
              alt={`${appointment.doctor.firstName}-image`}
              className="img-circle ml-3 mt-3"
            />
          ) : (
            <Avatar
              round={true}
              name={
                appointment.doctor.firstName +
                ' ' +
                (appointment.doctor.lastName || "")
              }
              size={60}
              className="my-appointment-avatar"
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
              appointment.unifiedAppointment &&
              appointment.unifiedAppointment.split(
                "#"
              )[1].replace("_", " ")}
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
