import React from 'react';
import '../../../component/questionnaire/Questionnaire.css';
import {Button} from 'react-bootstrap';
import {saveQuestionAnswer} from "../../../component/questionnaire/QuestionAnswerService";
import {getQuestionnaires} from "../../../component/questionnaire/QuestionnaireService";
import article from '../../../images/articles@3x.png';
import Header from "../../Login Module/Header";
import Footer from "../../Login Module/Footer";

class Questionnaire extends React.Component {


    state = {
        isLoading: true,
        questionnaire: null,
        error: null,
        currentPanel: 0
    }


    async componentDidMount() {
        // GET request using fetch with async/await
        const response = await getQuestionnaires();
        this.setState({questionnaire: response, isLoading: false})
    }

    render() {

        const {isLoading, questionnaire, error, currentPanel} = this.state;
        var topicSet = new Set()
        return (
            <div>
                <Header />
                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={article}
                            alt="HealthierU Logo"
                            style={{width: "100%"}}
                        />
                    </div>
                    <div className="col-md-6">
                        <br/>
                        <br/>
                        <div className="Questionnaire-header">
                            <h1>Health Behaviours</h1>
                            <p> Do You Suffer from Any of the Following?</p>
                        </div>
                        {!isLoading ? (
                            this.state.questionnaire.map((item, index) =>

                                item.published ? <div className="Questionnaire-Area" key={index}>
                                    {Object.entries(item.topicSubtopicDetails).map((dataItem, subIndex) => {

                                        //console.log(Object.entries(item.topicSubtopicDetails).length)
                                        topicSet.add(dataItem[0].split("#")[0])
                                        return <div hidden={currentPanel !== subIndex}>
                                            <div className={"Questionnaire-Question-Panel"}>

                                                <div className="Questionnaire-Heading">
                                                   <h4> {dataItem[0].split("#")[0]}
                                                   </h4>
                                                </div>


                                                <div className="Questionnaire-subtopic-Area">
                                                    <b>{dataItem[0].split("#").length > 2 ? dataItem[0].split("#")[1] : ""}</b>
                                                </div>

                                                {dataItem[1].map((question) => {
                                                    return <div className="Questionnaire-Answer-Area">
                                                        <div hidden={question.questiontype	=== 'TEXT'}>
                                                            <input type="checkbox"
                                                                   className="form-radio"
                                                                   onChange={this.handleCheckBoxEvent}
                                                                   id={question.id}/>
                                                            <label id="label_input_6_0">{question.question}</label>
                                                        </div>

                                                        <div hidden={question.questiontype	=== 'BOOLEAN'}>
                                                            <div className="form-group row">
                                                                <label htmlFor="description" className="col-sm-6 col-form-label">{question.question}</label>
                                                                <div className="col-sm-11">
                                                                    <input type="text"  className="form-control"
                                                                           id={question.id}
                                                                           placeholder={question.question}  onBlur={this.handleTextBoxEvent}></input>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                })}
                                            </div>

                                            <div  className={"Questionnaire-Next-Back_Button"} >
                                                
                                                <Button  className="btn btn-primary mr-2" hidden={ 0 === currentPanel}
                                                        onClick={(e) => this.backPanel(e)}>Back</Button>
                                                <Button className="btn btn-primary mr-2" hidden={ Object.entries(item.topicSubtopicDetails).length -1 === currentPanel}
                                                        onClick={(e) => this.nextPanel(e)}>Next</Button>
                                            </div>
                                            <br/>
                                        </div>


                                    })}


                                </div> : <div></div>
                            )
                            // If there is a delay in data, let's let the user know it's loading
                        ) : (
                            <h3>Loading...</h3>
                        )}

                        {!isLoading ? (
                            <div className="Questionnaire-Area">
                                <Button type="submit" variant="primary" className="Questionnaire-Continue-Button"
                                        onClick={(e) => this.create(e)}>Continue</Button>
                            </div>
                        ) : <div></div>}
                    </div>
                </div>
                <Footer />

            </div>

        );
    }


    async handleTextBoxEvent(event) {
        //console.log("Event Checkbox ");
        //console.log(event.target.id)
        //console.log(event.target.value)

        var data = {
            "answer": event.target.value,
            "patientId": null,
            "questionId": event.target.id,
            "id": event.target.name === "" ? null : event.target.name
        };

        //console.log(await saveQuestionAnswer(data));
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



    nextPanel(event) {
        //console.log(this.state.currentPanel)
        this.setState({
            currentPanel: this.state.currentPanel + 1
        })
    }
    backPanel(event) {
        //console.log(this.state.currentPanel)
        this.setState({
            currentPanel: this.state.currentPanel - 1
        })
    }
}

export default Questionnaire;