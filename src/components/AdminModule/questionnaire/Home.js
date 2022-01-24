import React from "react";
import {
    deleteQuestionnaire,
    getQuestionnaires,
    //saveQuestionnaire
} from "../../questionnaire/QuestionnaireService";
import {Link} from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import {Button, Modal} from "react-bootstrap";
import Navbar from "../layout/Navbar";
//import {deleteQuestion} from "../../../component/questionnaire/QuestionService";
import 'mdbreact/dist/css/mdb.css';


class QuestionnaireHome extends React.Component {


    state = {
        isLoading: true,
        questionnaire: null,
        selectedQuestionnaire: null,
        error: null,
        showDelete: false
    }


    async componentDidMount() {
        // GET request using fetch with async/await
        const response = await getQuestionnaires();
        this.setState({questionnaire: response, isLoading: false})
    }

     handleDeleteModal = remove => {

         this.setState({selectedQuestionnaire: remove})
         this.setState({showDelete: true});
    }

    render() {
        //const {isLoading, questionnaire, error} = this.state;
        const {isLoading} = this.state;


        return (
            <div>
             <Navbar pageTitle="questionnaire" />
                <br/>
                <div className="container">
                    <div className="py-4">
                        <div className="row">
                            <div className="col-md-6 col-sm-6"><h1>Questionnaires</h1></div>
                            <div className="col-md-6 col-sm-6 pr-0" style={{textAlign : "right"}}>
                                <Link to="/admin/questionnaire/add">
                                    <button type="button" className="btn btn-primary">Add Questionnaire</button>
                                </Link>
                            </div>
                        </div>

                        <table className="table border shadow">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sr.</th>
                                <th scope="col">Description</th>
                                <th scope="col">Published</th>
                                <th scope="col">Category</th>
                                <th scope="col" 
                                // className="Questionnaire-Action-Area-padding"
                                >Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!isLoading ? (
                                this.state.questionnaire.map((question,index) => (
                                    <tr key={question.id}>
                                        <td key="number">{index+1}</td>
                                        <td key="description">{question.description}</td>
                                        <td key="published" >{String(question.published).toUpperCase()}</td>
                                        <td key="category">{question.category}</td>
                                        <td key="action" 
                                                //className="Questionnaire-Action-Area-padding"
                                        >
                                            <div>
                                                <Link
                                                    to={{
                                                        pathname: `/admin/questionnaire/edit/${question.id}`,
                                                        questionnaire: question
                                                    }}>
                                                <button className="btn btn-info mr-2">Edit</button></Link>
                                                <button className="btn btn-danger"
                                                        onClick={() => this.handleDeleteModal(question)}>Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                <span>Loading...</span>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Modal show={this.state.showDelete} onHide={() =>this.setState({showDelete: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Questionnaire</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><p>Are you sure to Delete the Question ?</p></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() =>this.setState({showDelete: false})}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => this.handleDeleteQuestionSubmission()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }


    handleDeleteQuestionSubmission = async (event) => {
        const resp = deleteQuestionnaire(this.state.selectedQuestionnaire);

        await resp.then(response => {
            this.setState({selectedQuestionnaire: null,showDelete:false})
            this.componentDidMount();
            return response.data;
        })
    }

};

export default QuestionnaireHome;
