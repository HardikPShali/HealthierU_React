import React, { useState } from "react";
import { postArticle } from "../../../service/ArticleService";
import { Link } from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
const AddArticle = () => {
    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await postArticle(data);
        handleRedirect(resp)

    }

    const handleArticleChange = e => {
        if (e.target.name === "articlePicture") {
            setImageError("");
            const file = e.target.files[0];
            if (file && file.size > 1000000) {
                setImageError("Document must be less than 1mb");
                setArticle({ ...article, picture: "" });
            }
            else {
                setArticle({ ...article, picture: e.target.value });
            }
        }
        else {
            setArticle({ ...article, [e.target.name]: e.target.value });
        }
    };

    const [article, setArticle] = useState({
        title: "",
        description: null,
        name: "",
        source: "",
        picture: null,
        published: false
    });

    const [imageError, setImageError] = useState();
    // const [fileKey, setFileKey] = useState();

    const handleRedirect = (e) => {
        if (e) {
            toast.success("Article successfully Added.");
            setTimeout(() => history.push('/admin/article/home'), 500);
        }
    }


    return (
        <div>
            <Navbar pageTitle="article" />

            <br />
            <br />
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1>Add Article</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <input hidden={true} id="id" name="id" value={article?.id}
                            onChange={e => handleArticleChange(e)}
                        ></input>
                        <div className="form-group row">
                            <label htmlFor="title" className="col-sm-1 col-form-label">Title</label>
                            <div className="col-sm-11">
                                <input type="text" id="title" name="title" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    placeholder="Title" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-1 col-form-label">Name</label>
                            <div className="col-sm-11">
                                <input type="text" id="name" name="name" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    placeholder="Name" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="source" className="col-sm-1 col-form-label">Source</label>
                            <div className="col-sm-11">
                                <input type="text" id="source" name="source" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    placeholder="Source" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="published" className="col-sm-1 col-form-label">Published</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="published" id="published" onChange={e => handleArticleChange(e)}>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="articlePicture" className="col-sm-1 col-form-label">Picture</label>
                            <div className="col-sm-11">
                                <input type="file" id="articlePicture" name="articlePicture"
                                    className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    placeholder="Article Picture" accept="image/*" value={article.picture}
                                    required={true}></input>
                                {imageError && (<span style={{ color: "red", fontSize: "11px" }}>{imageError}</span>)}
                            </div>
                        </div>


                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Article Description</label>
                            <div className="col-sm-11">
                                <textarea id="description" name="description" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    placeholder="Article Description" required></textarea>
                            </div>
                        </div>

                        <br />
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6 text-right">
                                <button className="btn btn-primary mr-2">Save</button>
                                <Link to="/admin/article/home">
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

export default AddArticle;
