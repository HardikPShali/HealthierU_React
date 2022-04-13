import React from "react";
import {saveQuestionnaire} from "../../questionnaire/QuestionnaireService";
import {Link} from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import { useHistory } from 'react-router-dom';
const AddQuestionnaire = () => {
    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await saveQuestionnaire(data);
        handleRedirect(resp)

    }

    const handleRedirect = (e) => {
        if (e) {
            history.push('/admin/questionnaire/home');
        }
    }


    return (
        <div>
        <Navbar pageTitle="questionnaire" />

            <br/>
            <br/>
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1>Add Questionnaire</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br/>

                    <form onSubmit={e =>handleSubmit(e)}>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Description</label>
                            <div className="col-sm-11">
                                <input type="text" maxLength="100" id="description" name="description" className="form-control"
                                       placeholder="Description" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="published" className="col-sm-1 col-form-label">Published</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="published" id="published">
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="category" className="col-sm-1 col-form-label">Category</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="category" id="category">
                                    <option value="Patient">Patient</option>
                                    <option value="HealthBehaviour">Health Behaviour</option>
                                </select>
                            </div>
                        </div>

                        <br/>
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6 text-right">
                                <button className="btn btn-primary mr-2">Save</button>
                                <Link to="/admin/questionnaire/home">
                                    <button className="btn btn-light mr-2">Cancel</button>
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );


};

export default AddQuestionnaire;
