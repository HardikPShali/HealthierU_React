import React from 'react';
import '../../questionnaire/Questionnaire.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { saveQuestionAnswer } from '../../questionnaire/QuestionAnswerService';
import { getPatientQuestionnaire } from '../../questionnaire/QuestionnaireService';
import {
  getCurrentUserInfo,
  getCurrentPatientInfo,
} from '../../../service/AccountService';
import '../patient.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// import Footer from '../Footer';

class QuestionnaireEdit extends React.Component {
  state = {
    isLoading: true,
    questionnaire: null,
    error: null,
    currentPanel: 0,
    currentLoggedInUser: null,
    currentPatientUser: null,
    patientQuestionnaire: null,
    selectedQuestionnaire: null,
    optionDisplay: true,
  };

  constructor() {
    super();
    this.handleCheckBoxEvent = this.handleCheckBoxEvent.bind(this);
    this.handleTextBoxEvent = this.handleTextBoxEvent.bind(this);
  }

  async componentDidMount() {
    const currentUser = await getCurrentUserInfo();
    this.setState({ currentLoggedInUser: currentUser });

    const patientInfo = await getCurrentPatientInfo(
      currentUser.id,
      currentUser.login
    );
    this.setState({ currentPatientUser: patientInfo });

    // GET request using fetch with async/await
    const response = await getPatientQuestionnaire(patientInfo.id);
    this.setState({ questionnaire: response, isLoading: false });
  }

  handleQuestionnaire(questionaire) {
    this.setState({
      selectedQuestionnaire: questionaire,
      optionDisplay: false,
    });
  }

  handleBack() {
    this.setState({ selectedQuestionnaire: null, optionDisplay: true });
  }

  render() {
    const {
      isLoading,
      // questionnaire,
      // error,
      // currentPanel
    } = this.state;
    var topicSet = new Set();
    console.log(this.state);
    return (
      <div>
        <Container style={{ maxWidth: '100%' }}>
          <Row style={{ minHeight: '600px' }}>
            <Col md={6} id="questionnaire-bg"></Col>
            <Col md={6} style={{ background: '#fff', padding: '5%' }}>
              <div className="Questionnaire-header">
                <h1>Health Assessment</h1>
                <p> Do You Suffer from Any of the Following?</p>
              </div>
              {!isLoading && this.state.optionDisplay ? (
                <div
                  className="button-container"
                  style={{ textAlign: 'center' }}
                >
                  {this.state.questionnaire.map((item, index) =>
                    item.published && item.topicSubtopicDetails ? (
                      <>
                        <button
                          className="btn btn-primary mb-2 p-3"
                          onClick={() =>
                            this.handleQuestionnaire(item.topicSubtopicDetails)
                          }
                        >
                          {item.description}
                        </button>
                        <br />
                      </>
                    ) : (
                      <div></div>
                    )
                  )}
                </div>
              ) : (
                // If there is a delay in data, let's let the user know it's loading
                isLoading &&
                this.state.optionDisplay && (
                  <div
                    style={{ textAlign: 'center' }}
                    id="questionaire-spinner"
                  >
                    <CircularProgress style={{ color: '#fff !important' }} />
                  </div>
                )
              )}

              {this.state.selectedQuestionnaire && !this.state.optionDisplay && (
                <>
                  <IconButton
                    className="mb-2"
                    style={{
                      background: '#F6CEB4',
                      color: '#00d0cc',
                      marginRight: '10px',
                    }}
                    onClick={() => this.handleBack()}
                  >
                    <ArrowBackIcon />
                  </IconButton>

                  <div className="Questionnaire-Area">
                    {Object.entries(this.state.selectedQuestionnaire).map(
                      (dataItem, subIndex) => {
                        //console.log(Object.entries(item.topicSubtopicDetails).length)
                        let isHeadlineRepeat = topicSet.has(
                          dataItem[0].split('#')[0]
                        );
                        // { !isHeadlineRepeat && topicSet.add(dataItem[0].split("#")[0]) }  //NESTED BLOCK REDUNDANT
                        return (
                          <div
                            key={subIndex}
                            className={'Questionnaire-Question-Panel'}
                          >
                            {!isHeadlineRepeat && (
                              <div className="Questionnaire-Heading">
                                <h4> {dataItem[0].split('#')[0]}</h4>
                              </div>
                            )}

                            <div className="Questionnaire-subtopic-Area">
                              <b>
                                {dataItem[0].split('#').length > 2
                                  ? dataItem[0].split('#')[1]
                                  : ''}
                              </b>
                            </div>

                            {dataItem[1].map((question, questionSubIndex) => {
                              return (
                                <div
                                  className="Questionnaire-Answer-Area"
                                  key={questionSubIndex}
                                >
                                  <div>
                                    <div
                                      hidden={question.questiontype === 'TEXT'}
                                    >
                                      <input
                                        type="checkbox"
                                        className="form-radio"
                                        name={question.answerId}
                                        onChange={this.handleCheckBoxEvent}
                                        defaultChecked={
                                          question.answer === 'Y' ? true : false
                                        }
                                        id={question.id}
                                      />
                                      <label id="label_input_6_0">
                                        {question.question}
                                      </label>
                                    </div>

                                    <div
                                      hidden={
                                        question.questiontype === 'BOOLEAN'
                                      }
                                    >
                                      <div className="form-group row">
                                        <label
                                          htmlFor="description"
                                          className="col-sm-12 col-form-label"
                                        >
                                          {question.question}
                                        </label>

                                        <div className="col-sm-12">
                                          <input
                                            type="text"
                                            className="form-control"
                                            id={question.id}
                                            name={question.answerId}
                                            defaultValue={question.answer}
                                            placeholder={question.question}
                                            onBlur={this.handleTextBoxEvent}
                                          ></input>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="Questionnaire-Area-continue-button">
                    <Button
                      type="submit"
                      variant="primary"
                      className="Questionnaire-Continue-Button"
                      // hidden={Object.entries(item.topicSubtopicDetails).length - 1 > currentPanel}
                      onClick={(e) => this.continue(e)}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Container>
        {/* <Footer /> */}
      </div>
    );
  }

  async handleTextBoxEvent(event) {
    //console.log("Event Checkbox ");
    //console.log(event.target.id)
    //console.log(event.target.value)

    var data = {
      answer: event.target.value,
      patientId: this.state.currentPatientUser.id,
      questionId: event.target.id,
      id: event.target.name === '' ? null : event.target.name,
    };

    console.log('efefefef', data);

    saveQuestionAnswer(data);
  }

  async handleCheckBoxEvent(event) {
    //console.log("Event Checkbox ");
    //console.log(event.target.checked)
    //console.log(event.target.id)
    //console.log(event)
    const currentUserId = this.state.currentPatientUser.id;
    var data = '';

    if (event.target.name === '') {
      data = {
        answer: event.target.checked === true ? 'Y' : 'N',
        patientId: currentUserId,
        questionId: parseInt(event.target.id),
      };
    } else {
      data = {
        answer: event.target.checked === true ? 'Y' : 'N',
        patientId: currentUserId,
        questionId: parseInt(event.target.id),
        id: event.target.name === '' ? null : event.target.name,
      };
    }

    console.log('fzzz', data);

    saveQuestionAnswer(data);
  }

  nextPanel(event) {
    //console.log(this.state.currentPanel)
    this.setState({
      currentPanel: this.state.currentPanel + 1,
    });
  }

  backPanel(event) {
    //console.log(this.state.currentPanel)
    this.setState({
      currentPanel: this.state.currentPanel - 1,
    });
  }

  async continue(event) {
    window.location.assign('/patient');
  }
}

export default QuestionnaireEdit;
