import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Container, Row, Col } from 'react-bootstrap';
import { getHealthAssessment } from '../../../service/frontendapiservices';
import {
    AnswersCard,
    AnswersCardBox,
    AnswersCardDetails,
    AnswersCardHolder,
    AnswersCardQuestionAnswer,
    AnswersCardQuestionTitle,
    MainHeader,
} from './HealthAssessmentReportPatient.styles';

const HealthAssessmentReportPatient = () => {
    const cookies = new Cookies();
    const currentPatient = cookies.get('profileDetails');
    const patientId = currentPatient.id;

    const [answers, setAnswers] = useState(null);

    const getHealthAssessmentReport = async (id) => {
        const response = await getHealthAssessment(id).catch((err) => {
            console.log(err);
        });

        const dataAnswers = response.data.data.selections;
        setAnswers(dataAnswers);
    };

    useEffect(() => {
        getHealthAssessmentReport(patientId);
    }, [patientId]);

    return (

        <Container>
            <Row>
                <Col md={12}>
                    <AnswersCardBox>
                        <MainHeader>Health Assessment Report</MainHeader>
                        <AnswersCardHolder>
                            <AnswersCard>
                                <Row>
                                    <Col md={12}>
                                        {answers ? (
                                            answers.map((answer, index) => (
                                                <AnswersCardDetails key={index + 1}>
                                                    <AnswersCardQuestionTitle>
                                                        {answer.questionId}. {answer.questionTitle}
                                                    </AnswersCardQuestionTitle>
                                                    {answer.answers.map((answer, index) => (
                                                        <AnswersCardQuestionAnswer key={index}>
                                                            {answer}
                                                        </AnswersCardQuestionAnswer>
                                                    ))}
                                                </AnswersCardDetails>
                                            ))
                                        ) : (
                                            <Col
                                                md={12}
                                                className="ml-2"
                                                style={{ textShadow: 'none', color: '#3e4543' }}
                                            >
                                                Loading...
                                            </Col>
                                        )}
                                        {answers === null && (
                                            <>
                                                <AnswersCardQuestionTitle>
                                                    No Data Found
                                                </AnswersCardQuestionTitle>
                                            </>
                                        )}
                                    </Col>
                                </Row>
                            </AnswersCard>
                        </AnswersCardHolder>
                    </AnswersCardBox>
                </Col>
            </Row>
        </Container>

    );
};

export default HealthAssessmentReportPatient;
