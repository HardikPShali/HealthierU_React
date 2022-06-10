import React, { Component, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

import closeBtn from "../../images/svg/close-btn.svg";
import "./doctor.css";
const Availability = () => {
  const [value, setValue] = useState([]);
  const [times, setTimes] = useState([]);

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
      },
    ]);
    value(" ");
  };
  
  const [monday, setMonday] = useState("");
  const mondayHandler =(e)=> {
    const isMonday = e.target.checked;
    console.log(isMonday);
    setMonday("Monday");
  }

  const [tuesday, setTuesday] = useState("");
  const tuesdayHandler =(e)=> {
    const isTuesday = e.target.checked;
    setTuesday("Tuesday");
  }
  
  const [wednesday, setWednesday] = useState("");
  const wednesdayHandler =(e)=> {
    const isWednesday = e.target.checked;
    setWednesday("Wednesday");

  }

  const [thursday, setThursday] = useState("");
  const thursdayHandler =(e)=> {
    const isThursday = e.target.checked;
    setThursday("Thursday");
  }

  const [friday, setFriday] = useState("");
  const fridayHandler =(e)=> {
    const isFriday = e.target.checked;
    setFriday("Friday");
  }

  const [saturday, setSaturday] = useState("");
  const saturdayHandler =(e)=> {
    const isSaturday = e.target.checked;
    setSaturday("Saturday");
  }

  const [sunday, setSunday] = useState("");
  const sundayHandler =(e)=> {
    const isSunday = e.target.checked;
    setSunday("Sunday");
  }

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
            <div className="days-wrapper">
              <div className="day-wrapper">
                <h6>Monday</h6>
                <input
                  type="checkbox"
                  // value={monday}
                  onChange={mondayHandler}
                />
              </div>
              <div className="day-wrapper">
                <h6>Tuesday</h6>
                <input
                  type="checkbox"
                  // value={tuesday}
                  onChange={tuesdayHandler}
                />
              </div>
              <div className="day-wrapper">
                <h6>Wednesday</h6>
                <input
                  type="checkbox"
                  // value={wednesday}
                  onChange={wednesdayHandler}
                />
              </div>
              <div className="day-wrapper">
                <h6>Thursday</h6>
                <input
                  type="checkbox"
                  // value={thursday}
                  onChange={thursdayHandler}
                />
              </div>
              <div className="day-wrapper">
                <h6>Friday</h6>
                <input
                  type="checkbox"
                  // value={friday}
                  onChange={fridayHandler}
                />
              </div>
              <div className="day-wrapper">
                <h6>Saturday</h6>
                <input
                  type="checkbox"
                  // value={saturday}
                  onChange={saturdayHandler}
                />
              </div>
              <div className="day-wrapper">
                <h6>Sunday</h6>
                <input
                  type="checkbox"
                  // value={sunday}
                  onChange={sundayHandler}
                />
              </div>
              <div className="available-btn">
                <button>Add Time Slots</button>
              </div>
            </div>
          </Col>
          <Col sm={12} md={6} lg={6} xl={6}>
            <div className="selected-time-container">
              <h5>Select Time Slots</h5>

              {times.map((timeData) => (
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
            <div className="selected-day-container">
              <h5>Select Time with Day Slots</h5>
              <div className="selected-day-wrap">
                <div className="selected-days">
                  <h5>Monday to Friday</h5>
                  <span className="mr-3">10AM to 12PM</span>
                  <span>1AM to 2PM</span>
                </div>
                <div className="selected-days-toggle">
                  <label class="switch">
                    <input type="checkbox" />
                    <span class="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Availability;
