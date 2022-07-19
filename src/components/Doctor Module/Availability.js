import React, { Component, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import { toast } from 'react-toastify';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import TimeRange from 'react-time-range';
import moment from 'moment';
import {
  addRecurringSLot,
  getRecurringSLots,
  toggleRecurSlots,
  deleteReccurSlot
} from '../../service/frontendapiservices';
import closeBtn from '../../images/svg/close-btn.svg';

import './doctor.css';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router';
const Availability = () => {
  const [value, setValue] = useState([]);
  const [count, setCount] = useState(1);
  const [state, setState] = useState({
    startTime: moment(),
    endTime: moment(),
  });
  const [times, setTimes] = useState({ time: [], days: [] });
  const [timesOfRecur, setTimesOfRecur] = useState({ time: [], days: [] });
  const [allTimeSlot, setAllTimeSlot] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const cookies = new Cookies();
  //getting time input value
  const handleValue = (value) => {
    console.log('value', value);
    setValue(value);
    setIsDisabled(false);
  };
  let history = useHistory();
  //saving time value into newTimeObj as Object,
  const saveTimeHandler = () => {
    const newTimeObj = { ...times };
    newTimeObj.time.push({ startTime: value[0], endTime: value[1] });
    // newTimeObj.time.push({ startTime: state.startTime, endTime: state.endTime });
    setTimes({
      ...newTimeObj,
    });
  };
  const handleTime = (e) => {
    const format = moment(e.startTime).format('HH:mm A');
    const f = format
      .replace('PM', '')
      .replace('AM', '')
      .replace(' ', '');
    const endformat = moment(e.endTime).format('HH:mm A');
    const endf = endformat
      .replace('PM', '')
      .replace('AM', '')
      .replace(' ', '');
    if (f && endf) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (f != endf) {
      setState({ startTime: moment(e.startTime), endTime: moment(e.endTime) });
      setValue([f, endf]);
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
      toast.success('Start and End Time cant be same.');
    }
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
  };
  const [allDays, setAllDays] = useState([
    { day: 'Monday', checked: false },
    { day: 'Tuesday', checked: false },
    { day: 'Wednesday', checked: false },
    { day: 'Thursday', checked: false },
    { day: 'Friday', checked: false },
    { day: 'Saturday', checked: false },
    { day: 'Sunday', checked: false },
  ]);
  const loadRecurSlots = async () => {
    const docId = cookies.get('profileDetails');
    const dataForGetSlots = {
      doctorId: docId.id,
    };
    const response = await getRecurringSLots(dataForGetSlots);
    if (response) {
      setAllTimeSlot(response.data.data);
    }
  };
  useEffect(() => {
    loadRecurSlots();
  }, []);
  const addDaySlot = async () => {
    setCount(count + 1);
    console.log('tempDays', tempDays);
    const newTimes = { ...times };
    newTimes.days = tempDays;
    const docId = cookies.get('profileDetails');
    console.log(times);
    clearTick();
    setTimes({ time: [], days: [] });
    const utcTimes = times.time.map((t) => {
      const currentDate = new Date();
      currentDate.setHours(
        t.startTime.split(':')[0],
        t.startTime.split(':')[1],
        0
      );
      t.startTime = currentDate
        .toISOString()
        .split('T')[1]
        .split('.')[0];

      const currentEndDate = new Date();
      currentEndDate.setHours(
        t.endTime.split(':')[0],
        t.endTime.split(':')[1],
        0
      );
      t.endTime = currentEndDate
        .toISOString()
        .split('T')[1]
        .split('.')[0];

      return t;
    });
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    const unique = tempDays.filter(onlyUnique);
    const data = {
      doctorId: docId.id,
      days: unique.join(),
      timeSlotsList: utcTimes,
      toggle: true,
    };
    const dataForRecurSlot = [];
    dataForRecurSlot.push(data);
    // console.log({ dataForRecurSlot });
    if (data.days.length === 0) {
      toast.error('Please select at least one day before adding time slots.');
    } else {
      // console.log({ data: data.days });
      const res = await addRecurringSLot(dataForRecurSlot);
      // console.log({ res });

      const afterSuccessOrFailEvent = async () => {
        setState({ startTime: moment(), endTime: moment() });
        loadRecurSlots();
        setTimeout(() => {
          history.go(0);
        }, 5000);
      }

      if (res.data.status === false) {
        toast.error(res.data.message);
        afterSuccessOrFailEvent();
      } else {
        toast.success('Recurring Slot Added');
        afterSuccessOrFailEvent();
      }
    }
  };
  const [isToggle, setIsToggle] = useState(false);
  const handleToggle = async (e, eachTimes) => {
    const docId = cookies.get('profileDetails');
    setIsToggle(e.target.checked);
    eachTimes.toggle = e.target.checked;
    setAllTimeSlot([...allTimeSlot]);
    const data = {
      recurId: eachTimes.recurId,
      doctorId: docId.id,
      toggle: e.target.checked,
      popUpResponse: 'Cancel',
    };
    const res = await toggleRecurSlots(data);
    if (res) {
      if (eachTimes.toggle === true) {
        toast.success(`Slots toggled ON`);
      } else {
        toast.success(`Slots toggled OFF`);
      }
    }
  };
  const handleCloseSlot = (timeData) => {
    setTimes({ ...times, time: [], days: [] })
  };
  const clearTick = () => {
    const clearAllDays = allDays.map((eachDay) => {
      eachDay.checked = false;
      return eachDay;
    });
    setAllDays(clearAllDays);
  };

  const convertHoursAndMinsToLocal = (hoursAndMins) => {
    if (hoursAndMins) {
      const [hr, min] = hoursAndMins.split(':');

      const currentDate = new Date();
      currentDate.setHours(hr);
      currentDate.setMinutes(min);
      currentDate.setSeconds(0);

      const localDate = convertUTCDateToLocalDate(currentDate);
      const convertedHoursAndMinsInLocal = moment(localDate).format('HH:mm:ss');
      return convertedHoursAndMinsInLocal;
    }
  };

  const convertUTCDateToLocalDate = (date) => {
    const dateUTC = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    return new Date(dateUTC);
  };
  //Delete Slot
  const [openRecurDelete, setOpenRecurDelete] = useState(false);
  const [selectedRecurSlot, setSelectedRecurSlot] = useState();

  const [openReschedule, setOpenReschedule] = useState(false);

  const handleRecurDeleteOpen = (eachTimes) => {
    setSelectedRecurSlot(eachTimes);
    setOpenRecurDelete(true);
  };
  const handleRecurDeleteClose = () => {
    setOpenRecurDelete(false);
  };

  const handleRescheduleOpen = (eachTimes) => {
    setSelectedRecurSlot(eachTimes);
    setOpenReschedule(true);
  };
  const handleRescheduleClose = () => {
    setOpenReschedule(false);
  };

  const handleDeleteReccurSlot = async (eachTimes) => {
    handleRecurDeleteClose();
    const docId = cookies.get('profileDetails');
    const res = await deleteReccurSlot(eachTimes.recurId, docId.id).catch(
      (err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          toast.error(`Something went wrong.Please try agin!`);
        }
      }
    );
    if (res) {
      toast.success(`Slots Deleted`);
      loadRecurSlots()
      history.go(0);
    }
  };
  return (
    <>
      <Container>
        {/* <div className="slot-time available-btn">
        <h3 style={{color: "var(--primary)"}}>Set Availability</h3>
      </div> */}

        <Row className="time-slot-container">
          <Col sm={12} md={6} lg={6} xSl={6}>
            <div className="slot-time-wrap">
              <div className="start-time-wrap">
                <h5>Set Time</h5>
                {/* <TimeRangePicker
                className=" mt-1 mb-3"
                amPmAriaLabel="Select AM/PM"
                disableClock="true"
                // required="true"
                rangeDivider=" to "
                //timeFormat="HH:mm"
                value={value}
                //locale="sv-sv"
                use24Hours="true"
                onChange={handleValue}
              /> */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <TimeRange
                    onChange={(e) => handleTime(e)}
                    startMoment={state.startTime}
                    endMoment={state.endTime}
                    use24Hours="true"
                  />
                  <div className="available-btn">
                    <button
                      disabled={isDisabled === true}
                      onClick={saveTimeHandler}
                    >
                      Set Time
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {times.time.length ? (
              <div className="times-container">
                <h5>Select Time Slots</h5>
                <div className="selected-time-container">
                  {times.time.map((timeData, timeIndex) => (
                    <div className="selected_time">
                      <div className="select-time-wrap">
                        <div className="select-time-font">
                          <h6 className="select-time-font">
                            {timeData.startTime}
                          </h6>
                          <h6 className="select-time-font pl-2 pr-2">to</h6>
                          <h6 className="select-time-font">{timeData.endTime}</h6>
                        </div>
                      </div>
                      <div className="close-btn-select">
                        <img
                          src={closeBtn}
                          alt="close button"
                          onClick={() => handleCloseSlot(timeData)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
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
                    <span className="checkmark"></span>
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
            {/* {allTimeSlot.length ? (<div className="selected-day-container"> */}
            <h5 className="mb-3" style={{ color: 'var(--primary)' }}>
              Select Time with Day Slots
            </h5>
            {allTimeSlot.map((eachTimes, index) => (
              <div className="selected-day-wrap" key={index}>
                <div className="selected-days">
                  <h5>{eachTimes.days.toString()}</h5>
                  {eachTimes.timeSlotsList.map((timeDtls, index) => (
                    <span className="mr-3" key={index}>
                      {convertHoursAndMinsToLocal(timeDtls.startTime)} to{' '}
                      {convertHoursAndMinsToLocal(timeDtls.endTime)}
                    </span>
                  ))}
                </div>
                <div className="selected-days-toggle">
                  <label className="switch">
                    <input
                      checked={eachTimes.toggle}
                      id="toggleSlots"
                      type="checkbox"
                      onChange={(e) => handleToggle(e, eachTimes)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="close-btn-delete" style={{ marginBottom: '4%' }}>
                  <img
                    src={closeBtn}
                    alt="close button"
                    onClick={() => handleRecurDeleteOpen(eachTimes)}
                  />
                </div>
              </div>
            ))}
            {/* </div>) : <></>} */}
          </Col>
        </Row>
      </Container>
      <Dialog
        onClose={handleRecurDeleteClose}
        aria-labelledby="customized-dialog-title"
        open={openRecurDelete}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleRecurDeleteClose}
        >
          Are you sure you want to remove this slot ?
        </DialogTitle>
        <DialogActions>
          <button
            autoFocus
            onClick={() => handleDeleteReccurSlot(selectedRecurSlot)}
            className="btn btn-primary"
            id="close-btn"
          >
            Ok
          </button>
          <button
            autoFocus
            onClick={handleRecurDeleteClose}
            className="btn btn-secondary"
            id="close-btn"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
      <Dialog
        onClose={handleRescheduleClose}
        aria-labelledby="customized-dialog-title"
        open={openReschedule}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleRescheduleClose}
        >
          There is already an appointment booked. Reschedule this appointment ?
        </DialogTitle>
        <DialogActions>
          <button
            autoFocus
            //onClick={() => handleReschedule()}
            className="btn btn-primary"
            id="close-btn"
          >
            Reschedule
          </button>
          <button
            autoFocus
            onClick={handleRescheduleClose}
            className="btn btn-secondary"
            id="close-btn"
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Availability;
