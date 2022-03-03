import React, { Component } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import logo from '../../images/logo/logo_white.svg';
import './landing.css'
import i18next from 'i18next';
// import { Container } from 'react-bootstrap';
//import SearchIcon from '@material-ui/icons/Search';

export class Header extends Component {
    render() {
        return (
            <Navbar variant="dark" id="navbar">
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
                    <NavLink to="/signin"><button className="btn btn-outline-light header-btn">{i18next.t('Sign in / Join Now')}</button></NavLink> 
                </Nav>
            </Container>
            </Navbar>
        )
    }
}

export default Header
