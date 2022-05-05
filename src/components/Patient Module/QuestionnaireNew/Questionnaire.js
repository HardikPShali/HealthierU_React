import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import quesJson from './dummyQuestions.json';
import { Questions } from './Questions';
import '../patient.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Questionnaire = () => {
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(true);

    const history = useHistory();


    const onContinue = async (event) => {
        toast.success('Good Job!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        setTimeout(() => history.push('/patient'), 1000);
    }

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
                    <div className='question-box scroller-cardlist'>
                        {questions && questions.map((question, index) => (
                            <Questions key={index} question={question} />
                        ))}
                    </div>
                    <div className="questionnaire-continue-button">
                        <Button
                            type="submit"
                            variant="primary"
                            className="Questionnaire-Continue-Button"
                            onClick={onContinue}
                        >
                            Continue
                        </Button>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        />
                    </div>
                </Col>

            </Row>

        </Container>
    )
}

export default Questionnaire;
