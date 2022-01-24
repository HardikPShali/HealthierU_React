import React, { useEffect, useState } from "react";
import { editQuestionnaire, getQuestionnaire } from "../../questionnaire/QuestionnaireService";
import { Link, useParams } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import { deleteQuestion, saveQuestion } from "../../questionnaire/QuestionService";
import '../../questionnaire/Questionnaire.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import editIcon from '../../../images/icons used/edit icon_40 pxl.svg';
import deleteIcon from '../../../images/icons used/delete_icon_40 pxl.svg';

const EditQuestionnaire = (props) => {


    //let history = useHistory();
    const { id } = useParams();
    //let selectedQuestion = null;

    const [questionnaire, setQuestionnaire] = useState({
        description: "",
        published: "",
        category: "",
        questions: [],
    });

    const { description, published, category, questions } = questionnaire;


    const onInputChange = e => {
        setQuestionnaire({ ...questionnaire, [e.target.name]: e.target.value });
    };

    const onQuestionInputChange = e => {
        setQuestion({ ...question, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        //const resp = await editQuestionnaire(id, data);
        await editQuestionnaire(id, data);
    }

    const handleAddQuestionSubmission = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await saveQuestion(data);
        if (resp) {
            setQuestion(null)
            setShow(false);
            await loadQuestionniare();
            //selectedQuestion = null;
            setQuestion(null)
        }

    }

    const handleDeleteQuestionSubmission = async (event) => {
        const resp = await deleteQuestion(questionId);
        if (resp) {
            setDeleteShow(false);
            await loadQuestionniare();
        }
    }


    const [show, setShow] = useState(false);
    const [showDelete, setDeleteShow] = useState(false);
    const [questionId, setQuestionId] = useState(null);
    const [question, setQuestion] = useState(null);
    const handleDeleteClose = () => setDeleteShow(false);
    //const handleDeleteShow = () => setDeleteShow(true);
    const handleClose = () => {
        setQuestion(null)
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }



    

    const loadQuestionniare = async () => {
        const result = await getQuestionnaire(`${id}`);
        //console.log(result.data)
        setQuestionnaire(result.data);
    };

    useEffect(() => {
        loadQuestionniare();
    }, []);

    const handleDeleteModal = remove => {
        setQuestionId(remove.id)
        setDeleteShow(true);
    }


    const handleAddModal = () => {
        setQuestion(null)
        handleShow();
    }

    const handleEditModal = item => {
        setQuestion(item)
        handleShow();
    }


    return (
        <div>
            <Navbar pageTitle="questionnaire" />
            <br />
            <div className="container Questionnaire-Edit-Div-Border" >
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1><b>Edit Questionnaire</b></h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>
                    <br />


                    <form onSubmit={e => handleSubmit(e)}>
                        <input hidden={true} id="questionnaireId" name="questionnaireId"
                            value={id}></input>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Description</label>
                            <div className="col-sm-11">
                                <input type="text" id="description" name="description" className="form-control"
                                    value={description}
                                    placeholder="Description" required onChange={e => onInputChange(e)}></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="published" className="col-sm-1 col-form-label">Published: </label>
                            <div className="col-sm-11">

                                <select className="form-control" name="published" id="published"
                                    onChange={e => onInputChange(e)}
                                    value={published}>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="category" className="col-sm-1 col-form-label">Category</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="category" id="category"
                                    value={category} onChange={e => onInputChange(e)}>
                                    <option value="Patient">Patient</option>
                                    <option value="HealthBehaviour">Health Behaviour</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6 text-right">
                                <button className="btn btn-primary mr-2">Update</button>
                                <Link
                                    to={{
                                        pathname: `/admin/questionnaire/home`
                                    }}>
                                    <button className="btn btn-light mr-2">Cancel</button>
                                </Link>
                            </div>
                        </div>

                    </form>

                    <br />
                    <br />
                    <br />
                    <div className="row">
                        <div className="col-md-10"><h1>Question</h1></div>
                        <div className="col-md-2 text-right">
                            <button type="button" className="btn btn-primary" onClick={handleAddModal}>Add Question</button>
                        </div>
                    </div>
                    <table className="table border shadow">
                        <thead className="thead-dark">
                            <tr>
                                <th width="200">Question</th>
                                <th width="200">Topic</th>
                                <th width="50">Topic Order</th>                                
                                <th width="200">Sub Topic</th>
                                <th width="50">SubTopic Order</th>  
                                <th width="100">Question Type</th>
                                <th width="100">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question, index) => (
                                <tr key={question.id}>
                                    
                                    <td width="200">{question.question}</td>
                                    <td width="200">{question.topic}</td>
                                    <td width="50">{question.topicOrder}</td>
                                    <td width="200">{question.subtopic}</td>
                                    <td width="50">{question.subtopicOrder}</td>


                                    <td width="100">{question.questiontype}</td>
                                    <td width="100">
                                    
                                    <img width="15" height="15" onClick={() => handleEditModal(question)} src={editIcon} alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%' }} />

                                                <img width="15" height="15" onClick={() => handleDeleteModal(question)} src={deleteIcon} alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%' }} />


                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>


            <Modal show={showDelete} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Question</Modal.Title>
                </Modal.Header>
                <Modal.Body><p>Are you sure to Delete the Question ?</p></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteQuestionSubmission()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose}>
                <form onSubmit={e => handleAddQuestionSubmission(e)}>
                    <Modal.Header closeButton>
                        {question?.id ? <Modal.Title>Edit Questions</Modal.Title> : <Modal.Title>Add Questions</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body>


                        <div className="form-group row">
                            <input hidden={true} id="questionnaireId" name="questionnaireId"
                                value={id}></input>
                            <input hidden={true} id="id" name="id" value={question?.id ? question.id : null}
                                onChange={e => onQuestionInputChange(e)}
                            ></input>
                            <label htmlFor="description"
                                className="col-sm-3 col-form-label">Question</label>
                            <div className="col-sm-9">
                                <input type="text" maxLength="100" id="question" name="question"
                                    className="form-control" value={question?.question}
                                    onChange={e => onQuestionInputChange(e)}
                                    placeholder="Question" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="topic" className="col-sm-3 col-form-label">Topic</label>
                            <div className="col-sm-9">
                                <input type="text" maxLength="100" id="topic" name="topic" className="form-control"
                                    value={question?.topic} onChange={e => onQuestionInputChange(e)}
                                    placeholder="Topic" required></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="topicOrder" className="col-sm-3 col-form-label">
                                Topic Order</label>
                            <div className="col-sm-9">
                                <input type="text" pattern="\d*" maxlength="4" id="topicOrder" name="topicOrder"
                                    className="form-control" value={question?.topicOrder}
                                    onChange={e => onQuestionInputChange(e)}
                                    placeholder="Topic Sequence"></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="subtopic" className="col-sm-3 col-form-label">Sub
                                Topic</label>
                            <div className="col-sm-9">
                                <input type="text" maxLength="100" id="subtopic" name="subtopic"
                                    className="form-control" value={question?.subtopic}
                                    onChange={e => onQuestionInputChange(e)}
                                    placeholder="Sub Topic"></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="subtopicOrder" className="col-sm-3 col-form-label">
                                SubTopic Order</label>
                            <div className="col-sm-9">
                                <input type="text" pattern="\d*" maxlength="4" id="subtopicOrder" name="subtopicOrder"
                                    className="form-control" value={question?.subtopicOrder}
                                    onChange={e => onQuestionInputChange(e)}
                                    placeholder="SubTopic Order"></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="questiontype" className="col-sm-3 col-form-label">Question
                                Type</label>
                            <div className="col-sm-9">

                                <select className="form-control" name="questiontype" id="questiontype" onChange={e => onQuestionInputChange(e)} value={question?.questiontype}>
                                    <option value="BOOLEAN">Boolean</option>
                                    <option value="TEXT">Text Area</option>
                                </select>
                            </div>
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <br />
            <br />
        </div>
    );


};

export default EditQuestionnaire;
