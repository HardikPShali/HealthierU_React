import React, { Component, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import closeBtn from "../../images/svg/close-btn.svg";
import "./doctor.css";
const Availability = () => {
  const [value, setValue] = useState([]);
  const [times, setTimes] = useState({ time: [], days: [] });
  const [allTimeSlot, setAllTimeSlot] = useState([]);

  const handleValue = (value) => {
    console.log(value);
    setValue(value);
  };

  const saveTimeHandler = () => {
    const newTimeObj = { ...times };
    newTimeObj.time.push({ from: value[0], to: value[1] });
    setTimes({
      ...newTimeObj,
    });
  };
  const [tempDays, setTempDays] = useState([]);

  const dayHandler = (e, dayIndex) => {
    const isDayChecked = e.target.checked;
    const newAllDays = allDays.map((eachValue, eachIndex) => {
      if (eachIndex === dayIndex) {
        eachValue.checked = isDayChecked;
      }
      return eachValue;
    });

    if (isDayChecked) {
      setTempDays([...tempDays, e.target.value]);
    } else {
      const uncheckedItem = tempDays.indexOf(e.target.value);
      const newTempDays = tempDays.splice(uncheckedItem, 1);
      setTempDays(newTempDays);
    }
    setAllDays(newAllDays);
    // console.log(allDays);
  };
  const [allDays, setAllDays] = useState([
    { day: "Monday", checked: false },
    { day: "Tuesday", checked: false },
    { day: "Wednesday", checked: false },
    { day: "Thursday", checked: false },
    { day: "Friday", checked: false },
    { day: "Saturday", checked: false },
    { day: "Sunday", checked: false },
  ]);

  const addDaySlot = () => {
    console.log(tempDays);
    const newTimes = { ...times };
    newTimes.days = tempDays;

    // setTimes(newTimes);

    setAllTimeSlot([...allTimeSlot, newTimes]);
    console.log(times);
    clearTick();
    setTimes({ time: [], days: [] });
  };

  const clearTick = () => {
    const clearAllDays = allDays.map((eachDay) => {
      eachDay.checked = false;
      return eachDay;
    });
    setAllDays(clearAllDays);
  };
  return (
    <Container>
      <div className="slot-time available-btn">
        <h3>Set Availability</h3>
      </div>

      <Row className="time-slot-container">
        <Col sm={12} md={6} lg={6} xSl={6}>
          <div className="slot-time-wrap">
            <div className="start-time-wrap">
              <h5>Set Time</h5>
              <TimeRangePicker
                className=" mt-1 mb-3"
                amPmAriaLabel="Select AM/PM"
                disableClock="true"
                // required="true"
                rangeDivider=" to "
                // format={"hh:mm:ss a"}
                value={value}
                onChange={handleValue}
              />
            </div>
            <div className="available-btn">
              <button onClick={saveTimeHandler}>Set Time</button>
            </div>
          </div>
        {times.time.length ? (  <div className="times-container">
            <h5>Select Time Slots</h5>
            <div className="selected-time-container">
              {times.time.map((timeData, timeIndex) => (
                <div className="selected_time">
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
          </div>): <></>}
          {times.time.length ? (
            <div className="days-wrapper">
              {allDays.map((dayValue, dayIndex) => (
                <label className="day-wrapper">
                  {dayValue.day}
                  <input
                    type="checkbox"
                    checked={dayValue.checked}
                    onChange={(e) => dayHandler(e, dayIndex)}
                    value={dayValue.day}
                  />
                  <span class="checkmark"></span>
                </label>
              ))}
              <div className="available-btn">
                <button onClick={addDaySlot}>Add Time Slots</button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Col>
        <Col sm={12} md={6} lg={6} xl={6}>
          {allTimeSlot.length ? (<div className="selected-day-container">
            <h5>Select Time with Day Slots</h5>
            {allTimeSlot.map((eachTimes) => (
              <div className="selected-day-wrap">
                <div className="selected-days">
                  <h5>{eachTimes.days.toString()}</h5>
                  {eachTimes.time.map((timeDtls) => (
                    <span className="mr-3">
                      {timeDtls.from} to {timeDtls.to}
                    </span>
                  ))}
                </div>
                <div className="selected-days-toggle">
                  <label class="switch">
                    <input type="checkbox" />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>): <></>}
        </Col>
      </Row>
    </Container>
  );
};

export default Availability;
