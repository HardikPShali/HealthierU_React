import React, { useState } from 'react'; //useEffect
import { Navbar, Container, } from 'react-bootstrap'; //NavDropdown, Row, Col, Nav
import { Link, NavLink } from 'react-router-dom';
import logo from '../../images/logo/logo-with-quote.png';
import './patient.css';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import profileicon from '../../images/Icons/profile.svg';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationMenu from '../CommonModule/NotificationMenu';
import Cookies from 'universal-cookie';
import NotificationMenuPatient from './NotificationsMenu/NotificationsMenuPatient';
// import { updatePatientTimeZone } from '../../service/frontendapiservices';
// import { toast } from 'react-toastify';

const Header = (props) => {
  const cookies = new Cookies();

  const currentUser = cookies.get('profileDetails');


  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const {
    doctorDetailsList,
    unReadMessageList,
  } = props;
  const unReadMessageCount = (unReadMessageList && Object.keys(unReadMessageList).length) || 0;

  const pathname = window.location.pathname;


  return (
    <Navbar variant="dark" expand="lg" id="navbar" sticky='top'>
      <Container className="p-0">
        <NavLink to="/patient" className="m-0 mr-auto">
          <img
            src={logo}
            id="icon"
            alt="HealthierU Logo"
            style={{ width: '160px' }}
          />
        </NavLink>
        {/* <span className="ml-2 text-light" style={{fontSize: "12px"}}>Hi! &nbsp;{props.currentPatient.firstName}</span> */}
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
          {pathname !== '/patient/questionnaire/view' && (
            <>
              <NavLink to="/patient" style={{ margin: '5px' }}>Home</NavLink>
              <div className="dropdown headerNavbar">
                <button
                  type="button"
                  className="btn dropdown-toggle"
                  data-toggle="dropdown"
                >
                  My Portal
                </button>
                <div className="dropdown-menu">
                  <NavLink
                    to="/patient/mydoctor"
                    className="dropdown-item"
                  >
                    My Doctors
                  </NavLink>
                  <NavLink
                    to="/patient/myappointment"
                    className="dropdown-item"
                  >
                    My Appointments
                  </NavLink>
                  <NavLink to="/patient/document" className="dropdown-item">
                    My Records
                  </NavLink>
                  <NavLink
                    to="/patient/questionnaire/existing"
                    className="dropdown-item"
                  >
                    Health Assessment
                  </NavLink>
                  <NavLink to="/patient/chat" className="dropdown-item">
                    Chat
                  </NavLink>
                </div>
              </div>
              {/* <NavDropdown title="My Health" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/patient/document" style={{ color: '#498ce8' }}><b></b></NavDropdown.Item>
                        <NavDropdown.Item href="/patient/myappointment" style={{ color: '#498ce8' }}><b></b></NavDropdown.Item>
                        <NavDropdown.Item href="/patient/questionnaire/edit" style={{ color: '#498ce8' }}><b></b></NavDropdown.Item>
                        <NavDropdown.Item href="/patient/chat" style={{ color: '#498ce8' }}><b></b></NavDropdown.Item>
                    </NavDropdown> */}
              {/* <NavLink to="/patient/mydoctor" style={{ margin: '5px', marginRight: '15px' }}>My Doctors</NavLink> */}
              {/* <NavLink to="/patient/explore">Explore</NavLink> */}
              {/* <NavLink to="/patient/shop" style={{ marginRight: '22px' }}>Shop</NavLink> */}
              {/* <NavLink to="#search">
                        <SearchIcon id="search-icon" />
                    </NavLink>
                    <NavLink to="#search">
                        <MenuIcon />
                    </NavLink> */}
              {(
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
                    style={{ width: '350px', left: '-100px' }}
                  >
                    {/* <NotificationMenu
                      unReadMessageList={unReadMessageList}
                      detailsList={doctorDetailsList}
                      module={'patient'}
                    /> */}
                    <NotificationMenuPatient />
                  </div>
                </div>
              )}
            </>
          )}
          <NavLink to="#">
            {currentUser.picture ? (
              <img
                id="profilePicId"
                width="35"
                src={currentUser.picture}
                alt=""
                onClick={handleClick}
                className="profile-icon"
              />
            ) : (
              <img
                src={profileicon}
                alt=""
                onClick={handleClick}
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
            <Link to="/patient/profile" style={{ textDecoration: 'none' }}>
              <MenuItem>Profile</MenuItem>
            </Link>
            <Link
              to="/patient/changepassword"
              style={{ textDecoration: 'none' }}
            >
              <MenuItem>Change Password</MenuItem>
            </Link>
            <Link to="/patient/logout" style={{ textDecoration: 'none' }}>
              <MenuItem>Logout</MenuItem>
            </Link>
          </Menu>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
