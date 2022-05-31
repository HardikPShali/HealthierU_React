import React, { Component } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import logo from '../../images/logo/logo_white.svg';
import './landing.css'
// import { Container } from 'react-bootstrap';
//import SearchIcon from '@material-ui/icons/Search';

export const Header = ({ hideButton }) => {
    return (
        <Navbar variant="dark" id="navbar" sticky='top'>
            <Container>
                <NavLink to="/" className="mr-auto">
                    <img
                        src={logo}
                        id="icon"
                        alt="HealthierU Logo"
                        style={{ width: "70%" }}
                    />
                </NavLink>
                <Nav>
                    {!hideButton && <NavLink to="/signin"><button className="btn btn-secondary">Sign in / Join Now</button></NavLink>}
                </Nav>
            </Container>
        </Navbar>
    )
}


export default Header
