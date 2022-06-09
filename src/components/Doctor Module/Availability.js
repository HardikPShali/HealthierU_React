import React, { Component, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import closeBtn from "../../images/svg/close-btn.svg";
import "./doctor.css";
const Availability = () => {
  const [value, onChange] = useState(["10:00", "11:00"]);
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [timeSlot, setTimeSlot] = useState(false);

  const setTimeData = [
    { id: 1, from: "10AM", to: "11AM" },
    { id: 2, from: "11.15AM", to: "11.30AM" },
    { id: 3, from: "1PM", to: "1.15PM" },
    { id: 4, from: "1.40PM", to: "2.10PM" },
  ];

 const saveTimeHandler = (event) => {

 }
 
  return (
    <Container>
      <div className="slot-time available-btn">
        <h3>Set Availability</h3>
        <p>There is no time slots. Please add your time slots</p>
        <button onClick={() => setTimeSlot(true)}>Set Time Slots</button>
      </div>
      {timeSlot ? (
        <Row className="time-slot-container">
          <Col sm={12} md={6} lg={6} xl={6}>
            <div className="slot-time-wrap">
              <div className="start-time-wrap">
                <h5>Set Time</h5>
                <TimeRangePicker
                  className=" mt-1 mb-3"
                  amPmAriaLabel="Select AM/PM"
                  value={value}
                  onchange={onChange}
                />
              </div>
              <div className="available-btn">
                <button onChange={saveTimeHandler}>Set Time</button>
              </div>
            </div>
          </Col>
          <Col sm={12} md={6} lg={6} xl={6}>
            <div className="selected-time">
              <h5>Select Time Slots</h5>
              {setTimeData.map((timeData) => (
                <div className="selected_time" key={timeData.id}>
                  <div className="select-time-wrap">
                    <div className="select-time-font">
                      <h6 className="select-time-font">{timeData.from}</h6>
                      <h6 className="select-time-font pl-2 pr-2">to</h6>
                      <h6 className="select-time-font">{timeData.to}</h6>
                    </div>
                  </div>
                  <div className="close-btn-select">
                    <img src={closeBtn} alt="close button" />
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      ) : null}
    </Container>
  );
};

export default Availability;
