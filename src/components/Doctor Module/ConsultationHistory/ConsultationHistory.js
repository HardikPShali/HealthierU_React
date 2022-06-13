import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import ConsultationHistoryComponent from './ConsultationHistorySection'
const ConsultationHistory = () => {
    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <ConsultationHistoryComponent />
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
export default ConsultationHistory