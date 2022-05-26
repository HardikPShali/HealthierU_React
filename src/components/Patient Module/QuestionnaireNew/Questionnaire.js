import React from 'react'
import { useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import quesJson from './questions.json';
import { Questions } from './Questions';
import '../patient.css';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import { postHealthAssessment } from '../../../service/frontendapiservices'

const Questionnaire = () => {
    const [questions, setQuestions] = useState(null);
    // const [loading, setLoading] = useState(true);

    const cookies = new Cookies();

    const currentPatient = cookies.get('profileDetails');
    const patientID = currentPatient.id;
    console.log(patientID);

    const history = useHistory();

    const handleAssessmentSubmit = async () => {
        const submitData = {
            selections: questions.map(question => {
                if (!Array.isArray(question.answers)) {
                    question.answers = [question.answers];
                }
                // let score = 0;

                // question.answers.forEach(answer => {

                //     let choiceIndex = question.choices.indexOf(answer);
                //     if (choiceIndex !== -1) {
                //         score += question.score[choiceIndex];
                //     }

                //     // score += question.mapScore[choiceIndex]
                // })

                // question.score = score;
                return question;
            }),
        };
        const response = await postHealthAssessment(submitData, patientID).catch(err => {
            console.log(err);
        });
        console.log(response);
    }


    const onContinue = async () => {
        console.log(questions);
        if (questions.length > 0) {
            handleAssessmentSubmit();
            toast.success('Saved Successfully!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            // history.push('/patient');
        }
        else {
            toast.error('Please fill the form!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            history.reload();
        }

        // setTimeout(() => history.push('/patient'), 1000);
    }




    useEffect(() => {
        setQuestions(quesJson);
    }, []);


    return (
        <Container style={{ maxWidth: '100%' }}>
            <Row id="questionnaire-view" style={{ minHeight: '600px' }}>
                <Col md={6} id="questionnaire-view-bg"></Col>
                <Col md={6} style={{ background: '#fff', padding: '5%' }} className='questionnaire-container'>
                    <div className='questionnaire-header'>
                        <h1>Health Assessment</h1>
                    </div>
                    <div className='question-box scroller-cardlist'>
                        {questions && questions.map((question) => (
                            <Questions key={question.questionId} question={question} />
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
