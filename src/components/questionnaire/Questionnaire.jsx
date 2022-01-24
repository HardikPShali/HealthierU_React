import React from 'react';
import './Questionnaire.css';
import {Button} from 'react-bootstrap';
import {getQuestionnaires} from "./QuestionnaireService";
import {saveQuestionAnswer} from "./QuestionAnswerService";
import TransparentLoader from '../Loader/transparentloader';

class Questionnaire extends React.Component {


    state = {
        isLoading: true,
        questionnaire: null,
        error: null
    }


    async componentDidMount() {
        // GET request using fetch with async/await
        const response = await getQuestionnaires();
        if(response && response.status === 200) {
            this.setState({questionnaire: response, isLoading: false})
        }
        
    }

    render() {

        const {isLoading, questionnaire, error} = this.state;
        return (
            <div>
                {isLoading && (
                    <TransparentLoader />
                )}
                <div className="Questionnaire-header">
                    <h1>Health Behaviuor</h1>
                    <p> Do you suffer from any of following ?</p>
                </div>


                {questionnaire && (
                    questionnaire.map((item, index) =>

                        item.published ? <div className="Questionnaire-Area" key={index}>
                            <label
                                id="label_6">
                                <div className="Questionnaire-Heading">
                                    {item.description}
                                </div>
                            </label>
                            <div data-layout="full" className="Questionnaire-Answer-Area">
                                <div role="group" aria-labelledby="label_6" data-component="radio">
                                    {this.state.questionnaire[index].questions.map((question, subIndex) =>
                                        <div>
                                            <input type="checkbox" tabIndex={subIndex} className="form-radio"
                                                   onChange={this.handleCheckBoxEvent}
                                                   id={question.id}/>
                                            <label
                                                id="label_input_6_0">{question.question}</label>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div> : <div></div>
                    )
                    // If there is a delay in data, let's let the user know it's loading
                )}

                
                    <div className="Questionnaire-Area-continue-button">
                        <Button type="submit" variant="primary" className="Questionnaire-Continue-Button"
                                onClick={(e) => this.create(e)}>Continue</Button>
                    </div>
                <br/>
            </div>

        );
    }

    async handleCheckBoxEvent(event) {
        //console.log("Event Checkbox ");
        //console.log(event.target.checked)
        //console.log(event.target.id)

        //console.log(event)
        var data = {
            "answer": event.target.checked,
            "patientId": null,
            "questionId": event.target.id,
            "id": event.target.name === "" ? null : event.target.name
        };


        //console.log(await saveQuestionAnswer(data));

    }
}

export default Questionnaire;