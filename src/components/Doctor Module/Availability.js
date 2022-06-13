import React, { Component, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import closeBtn from "../../images/svg/close-btn.svg";
import "./doctor.css";
const Availability = () => {
  const [value, setValue] = useState([]);
  const [times, setTimes] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(0);

  const getSelectedTimeDtls = (value) => {
    setSelectedTimeSlot(value);
    console.log(selectedTimeSlot);
    tempDays = [];
  };

  const handleValue = (value) => {
    console.log(value);
    setValue(value);
  };

  const saveTimeHandler = () => {
    setTimes([
      ...times,
      {
        from: value[0],
        to: value[1],
        id: new Date().getMilliseconds(),
        days: [],
      },
    ]);
    value(" ");
  };

  const tempDays = [];
  const dayHandler = (e) => {
    const isDayChecked = e.target.checked;

    if (isDayChecked) {
      tempDays.push(e.target.value);
    } else {
      let uncheckedItem = tempDays.indexOf(e.target.value);
      tempDays.splice(uncheckedItem, 1);
    }
    // console.log(tempDays);
  };

  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const addDaySlot = () => {
    const newTimes = times.map((eachTime, eachIndex) => {
      if (eachIndex === selectedTimeSlot) {
        eachTime.days = tempDays;
      }
      return eachTime;
    });

    setTimes(newTimes);
    console.log(times);
  };

  return (
    <Container>
      <div className="slot-time available-btn">
        <h3>Set Availability</h3>
        <p>There is no time slots. Please add your time slots.</p>
        <button>Set Time Slots</button>
      </div>
      {value && (
        <Row className="time-slot-container">
          <Col sm={12} md={6} lg={6} xSl={6}>
            <div className="slot-time-wrap">
              <div className="start-time-wrap">
                <h5>Set Time</h5>
                <TimeRangePicker
                  className=" mt-1 mb-3"
                  amPmAriaLabel="Select AM/PM"
                  value={value}
                  onChange={handleValue}
                />
              </div>
              <div className="available-btn">
                <button onClick={saveTimeHandler}>Set Time</button>
              </div>
            </div>
            {value && (
              <div className="days-wrapper">
                {allDays.map((dayValue) => (
                  <label className="day-wrapper">
                    {dayValue}
                    <input
                      type="checkbox"
                      onChange={dayHandler}
                      value={dayValue}
                    />
                    <span class="checkmark"></span>
                  </label>
                ))}
                <div className="available-btn">
                  <button onClick={addDaySlot}>Add Time Slots</button>
                </div>
              </div>
            )}
          </Col>
          <Col sm={12} md={6} lg={6} xl={6}>
            <div className="selected-time-container">
              <h5>Select Time Slots</h5>

              {times.map((timeData, timeIndex) => (
                <div
                  onClick={() => getSelectedTimeDtls(timeIndex)}
                  className="selected_time"
                  key={timeData.id}
                >
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
            <div className="selected-day-container">
              <h5>Select Time with Day Slots</h5>
              {times.map((eachTimes) =>
                eachTimes.days.length ? (
                  <div className="selected-day-wrap">
                    <div className="selected-days">
                      <h5>{eachTimes.days.toString()}</h5>
                      <span className="mr-3">{eachTimes.from} to {eachTimes.to}</span>
                    </div>
                    <div className="selected-days-toggle">
                      <label class="switch">
                        <input type="checkbox" />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <> </>
                )
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Availability;
