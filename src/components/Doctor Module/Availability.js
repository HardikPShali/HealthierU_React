import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./doctor.css";
const Availability = () => {
  return (
    <Container>
      <div className="slot-time">
          <h3>Set Availability</h3>
        <p>There is no time slots. Please add your time slots</p>
        <button>Set Time Slots</button>
      </div>
    </Container>
  );
};

export default Availability;
