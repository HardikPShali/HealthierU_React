import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import Questions from "./Questions"
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getHealthAssessment } from '../../../service/frontendapiservices'


const HealthAssestmentReport = () => {
    const [answerData, setAnswerData] = useState(null);

    const { id } = useParams();

    const getAssessmentreport = async (id) => {
        const response = await getHealthAssessment(id).catch(err => {
            console.log(err);
        });
        if (response) {
            const dataAnswers = response.data.data.selections;
            setAnswerData(dataAnswers);
        }
    }


    useEffect(() => {
        getAssessmentreport(id);
    }, [id]);


    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <Questions answers={answerData} />
                    </Col>
                </Row>
            </Container>
        </div >
    )
}
export default HealthAssestmentReport