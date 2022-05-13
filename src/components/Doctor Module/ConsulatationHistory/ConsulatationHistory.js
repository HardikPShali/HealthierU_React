import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap';
import ConsulatationHistoryComponent from './ConsulatationHistorySection'
const ConsulatationHistory = () => {
    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <ConsulatationHistoryComponent />
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
export default ConsulatationHistory