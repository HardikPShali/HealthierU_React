import React, { Component } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../../images/logo/logo_white.svg";
import "./landing.css";
import { HashLink as Link } from "react-router-hash-link";
// import { Container } from 'react-bootstrap';
//import SearchIcon from '@material-ui/icons/Search';

export const Header = ({ hideButton }) => {
    

  return (
    <Navbar variant="dark" id="navbar">
      <Container className="web_navigation">
        <NavLink to="/" className="mr-auto">
          <img
            src={logo}
            id="icon"
            alt="HealthierU Logo"
            style={{ width: "70%" }}
          />
        </NavLink>
        <Nav>
          {!hideButton && (
            <div className="nav-menu-wrapper">
              <div className="nav-menu-container">
                <ul className="nav-menu-ul">
                  <li>
                    <Link to="/#about-us">About Us</Link>
                  </li>
                  <li>
                    <Link to="/#how-it-work">How It Works</Link>
                  </li>
                  <li>
                    <Link to="/#our-service">Our Services</Link>
                  </li>
                  <li>
                    <Link to="/#footer">Contact Us</Link>
                  </li>
                </ul>
              </div>
              <NavLink to="/signin">
                <button className="btn btn-secondary">
                  Sign in / Join Now
                </button>
              </NavLink>
            </div>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
