import React, { useEffect, useState } from 'react';
import { Navbar, Container } from 'react-bootstrap'; //NavDropdown, Row, Col, Nav
import { Link, NavLink } from 'react-router-dom';
import logo from '../../images/logo/logo-with-quote.png';
import './doctor.css';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Cookies from 'universal-cookie';
import profileicon from '../../images/Icons/profile.svg';
import { getDoctorByUserId } from '../../service/frontendapiservices';
import { updateDoctorTimeZone } from '../../service/frontendapiservices';
import { toast } from 'react-toastify';
import NotificationMenu from '../CommonModule/NotificationMenu';
import momentTz from 'moment-timezone';
// import TimezoneSelect from "react-timezone-select";
// import Dialog from "@material-ui/core/Dialog";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogActions from "@material-ui/core/DialogActions";
// import Button from "@material-ui/core/Button";
// import { ValidatorForm } from "react-material-ui-form-validator";
// import LocalStorageService from "./../../util/LocalStorageService";
// import axios from "axios";
// import SearchIcon from "@material-ui/icons/Search";

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  // const [currentDoctorState, setCurrentDoctorState] = useState();
  //const cookies = new Cookies();
  console.log('props in head ::: ', props);
  const systemTimeZone = momentTz.tz.guess();
  // const docId = props.currentDoctor.id;
  // const currentTimezone = props.currentDoctor.doctorTimeZone;
  // const [timeZone, setTimezone] = useState({
  //   id: "",
  //   doctorTimeZone: "",
  // });

  // const { doctorTimeZone } = timeZone;
  // const [open, setOpen] = useState(false);

  const cookies = new Cookies();
  const currentLoggedInUser = cookies.get('currentUser');
  const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;

  const currentProfileDets = cookies.get('profileDetails');

  useEffect(() => {
    getCurrentDoctor();
  }, []);
  const getCurrentDoctor = async () => {
    const res = await getDoctorByUserId(loggedInUserId);
    //axios(payload).then(res => {
    if (res && res.data) {
      res.data.doctors.map((value, index) => {
        if (value && value.doctorTimeZone !== systemTimeZone) {
          handleSubmit(value.id, systemTimeZone);
        }
        return value;
      });
    }
    return res;
  };
  // const handleClickOpen = () => {
  //   setTimezone({
  //     ...timeZone,
  //     id: docId,
  //     doctorTimeZone: currentTimezone ? currentTimezone : "",
  //   });
  //   handleClose();
  //   setOpen(true);
  // };
  // const handleCloseOpen = () => {
  //   setOpen(false);
  // };

  // const handleChange = (e) => {
  //   setTimezone({ ...timeZone, doctorTimeZone: e.value });
  // };
  const handleSubmit = async (id, timezone) => {
    const payload = {
      id: id,
      doctorTimeZone: timezone,
    };
    const response = await updateDoctorTimeZone(payload);
    if (response) {
      //handleCloseOpen();
      toast(`Your timezone has been changed to : ${timezone}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    patientDetailsList,
    unReadMessageList,
    currentDoctor: { picture = null },
  } = props;
  const unReadMessageCount =
    (unReadMessageList && Object.keys(unReadMessageList).length) || 0;
  return (
    <Navbar variant="dark" expand="lg" id="navbar" sticky='top'>
      <Container className="p-0">
        <NavLink to="/doctor" className="m-0 mr-auto">
          <img
            src={logo}
            id="icon"
            alt="HealthierU Logo"
            style={{ width: '160px' }}
          />
        </NavLink>
        {/* <span className="ml-2 text-light" style={{fontSize: "12px"}}>Hi! &nbsp;{props.currentDoctor.firstName}</span> */}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <NavLink to="#" style={{ cursor: 'default', margin: '5px' }}>
            Current TimeZone:{' '}
            <span className="p-1 border ml-1 mr-1" style={{ cursor: 'default' }}>{systemTimeZone}</span>
          </NavLink>
          <NavLink to="/doctor" style={{ margin: '5px' }}>Home</NavLink>
          <div className="dropdown headerNavbar">
            <button
              type="button"
              className="btn dropdown-toggle"
              data-toggle="dropdown"
            >
              My Patients
            </button>
            <div className="dropdown-menu">
              <NavLink to="/doctor/mypatient" className="dropdown-item">
                My Patients
              </NavLink>
              <NavLink to="/doctor/myrecord" className="dropdown-item">
                Patient Records
              </NavLink>
              <NavLink to="/doctor/appointment" className="dropdown-item">
                My Calendar
              </NavLink>
              <NavLink to="/doctor/chat" className="dropdown-item">
                Chat
              </NavLink>
            </div>
          </div>
          {/* delete below */}
          {/* <NavDropdown title="My Patients" id="basic-nav-dropdown">
                        <div className="dropdown-item" ><NavLink to="/doctor/mypatient" className="dropdown-link"><b>My Patients</b></NavLink></div>
                        <div className="dropdown-item" ><NavLink to="/doctor/myrecord" className="dropdown-link"><b>Patient Records</b></NavLink></div>
                        <div className="dropdown-item" ><NavLink to="/doctor/appointment" className="dropdown-link"><b>My Calendar</b></NavLink></div>
                        <div className="dropdown-item" ><NavLink to="/doctor/chat" className="dropdown-link"><b>Chat</b></NavLink></div>
                    </NavDropdown> */}
          {/* <NavLink to="/doctor/shop" style={{ marginRight: '20px' }}>Shop</NavLink> */}
          {/* ```<NavLink to="#search">
            <SearchIcon id="search-icon" />
          </NavLink>``` */}

          {unReadMessageCount > 0 && (
            <div className="dropdown headerNavbar notification-Navbar">
              <IconButton
                aria-label="show 17 new notifications"
                color="inherit"
                type="button"
                data-toggle="dropdown"
              >
                <Badge badgeContent={unReadMessageCount} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <div
                className="dropdown-menu notification-Menu"
                style={{ width: '200px' }}
              >
                <NotificationMenu
                  unReadMessageList={unReadMessageList}
                  detailsList={patientDetailsList}
                  module={'doctor'}
                />
              </div>
            </div>
          )}
          <NavLink to="#">
            {currentProfileDets.picture ? (
              <img
                id="profilePicId"
                src={currentProfileDets.picture}
                alt=""
                onClick={handleClick}
                className="profile-icon"
              />
            ) : (
              <img
                src={profileicon}
                onClick={handleClick}
                alt=""
                className="profile-icon"
                width="35"
              />
            )}
            {/* (<Avatar onClick={handleClick} name={currentDoctor && (currentDoctor.firstName + " " + currentDoctor.lastName)}  */}
          </NavLink>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            // anchorOrigin={{
            //     vertical: 'bottom',
            //     horizontal: 'center',
            // }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Link to="/doctor/profile" style={{ textDecoration: 'none' }}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <Link
              to="/doctor/changepassword"
              style={{ textDecoration: 'none' }}
            >
              <MenuItem>Change Password</MenuItem>
            </Link>
            {/* <Link
              to="#"
              style={{ textDecoration: "none" }}
              onClick={() => handleClickOpen()}
            >
              <MenuItem>Update Timezone</MenuItem>
            </Link> */}
            <Link to="/doctor/logout" style={{ textDecoration: 'none' }}>
              <MenuItem>Logout</MenuItem>
            </Link>
          </Menu>
        </div>
      </Container>

      {/* <Dialog
        open={open}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="max-width-dialog-title"
      >
        <ValidatorForm
          className="changepass-form"
          onSubmit={() => handleSubmit()}
        >
          <DialogContent style={{ height: "410px" }}>
            <Row>
              <Col md={12}>
                <Row>
                  <Col md={12}>
                    <p>Update your Timezone</p>
                    <TimezoneSelect
                      value={doctorTimeZone}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <br />
              </Col>
            </Row>
          </DialogContent>
          <DialogActions>
            <button className="btn btn-primary" type="submit">
              Change
            </button>
            <button
              onClick={handleCloseOpen}
              className="btn btn-primary"
              type="button"
            >
              Cancel
            </button>
          </DialogActions>
        </ValidatorForm>
      </Dialog> */}
    </Navbar>
  );
};

export default Header;
