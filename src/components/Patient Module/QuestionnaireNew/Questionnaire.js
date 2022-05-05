import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import quesJson from './dummyQuestions.json';
import { Questions } from './Questions';
import '../patient.css';

const Questionnaire = () => {
    const [questions, setQuestions] = useState(null);

    useEffect(() => {
        setQuestions(quesJson);
    }, []);


    console.log(questions);

    return (
        <Container style={{ maxWidth: '100%' }}>
            <Row id="questionnaire-view" style={{ minHeight: '600px' }}>
                <Col md={6} id="questionnaire-view-bg"></Col>
                <Col md={6} style={{ background: '#fff', padding: '5%' }} className='questionnaire-container'>
                    <div className='questionnaire-header'>
                        <h1>Health Assessment</h1>
                    </div>
                    <div className='question-box'>
                        {questions && questions.map((question, index) => (
                            <Questions key={index} question={question} />
                        ))}
                    </div>
                    <div className="questionnaire-continue-button">
                        <Button
                            type="submit"
                            variant="primary"
                            className="Questionnaire-Continue-Button"
                        // onClick={(e) => this.continue(e)}
                        >
                            Continue
                        </Button>
                    </div>
                </Col>

            </Row>

        </Container>
    )
}

export default Questionnaire;
