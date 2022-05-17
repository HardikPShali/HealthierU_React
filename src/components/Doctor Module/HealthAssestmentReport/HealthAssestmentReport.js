import React from 'react'
import Questions from "./Questions"
import { Container, Row, Col, Card } from 'react-bootstrap';
const HealthAssestmentReport = () => {
    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <Questions />
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
export default HealthAssestmentReport