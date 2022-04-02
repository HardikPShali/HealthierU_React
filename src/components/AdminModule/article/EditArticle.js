import React, { useEffect, useState } from "react";
import { postArticle, getArticle } from "../../../service/ArticleService";
import { Link, useParams } from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import previewImg from '../../../images/default_image.jpg';
import { ToastContainer, toast } from 'react-toastify';
const EditArticle = () => {

    //let history = useHistory();
    const { id } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await postArticle(data);
        if (resp) {
            toast.success("Article successfully updated.");
            setTimeout(() => window.location.assign('/admin/article/home'), 500);
        }
      

    }

    const handleArticleChange = e => {
        if (e.target.name === "articlePicture") {
            console.log(e.target.files)
            setImageError("");
            const file = e.target.files[0];
            if (file && file.size > 1000000) {
                setImageError("Document must be less than 1mb");
                setArticle({ ...article, picture: "" });
            }
            else {
                const objectUrl = URL.createObjectURL(e.target.files[0])
                setPreview(objectUrl)
                setArticle({ ...article, picture: e.target.value });
            }
        }
        else {
            setArticle({ ...article, [e.target.name]: e.target.value });
        }
    };

    const [article, setArticle] = useState({
        title: "",
        description: "",
        name: "",
        source: "",
        picture: null,
        published: false
    });

    const [imageError, setImageError] = useState();


    const {
        title,
        description,
        name,
        source,
        //picture,
        published
    } = article;

    console.log("article::", article)

    const handleRedirect = (e) => {
        if (e) {
            window.location.assign('/admin/article/home');
        }
    }

    useEffect(() => {
        loadArticle();
    }, []);

    const loadArticle = async () => {
        const result = await getArticle(`${id}`);
        //console.log(result)
        setArticle(result);
    };

    const isURL = (str) => {
        let srcLink = str;
        let convertedString = srcLink.toLowerCase();

        if (/https/g.test(convertedString)) {
            return true;
        } else {
            return false
        }
    }
    const [preview, setPreview] = useState()



    return (
        <div>
            <Navbar pageTitle="article" />

            <br />
            <br />
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1>Edit Article</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <input hidden={true} id="id" name="id" value={id}
                            onChange={e => handleArticleChange(e)}
                        ></input>
                        <div className="row">
                            <div className="small-12 medium-2 large-2 columns m-auto" style={{ width: "120px" }}>
                                <div className="circle">
                                    {/* <!-- User Profile Image --> */}
                                    <img className="profile-pic" src={preview ? preview : article?.picture && isURL(article?.picture) ? article.picture : previewImg} alt="" />
                                </div>

                                <div className="p-image">
                                    <AddAPhotoIcon className="upload-button" />
                                    <input className="file-upload" id="articlePicture" name="articlePicture" type="file" accept="image/*" onChange={e => handleArticleChange(e)}
                                        variant="filled" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div style={{ fontSize: '12px', color: 'red', margin: 'auto' }}>{imageError}</div>
                        </div>
                        <br />
                        <div className="form-group row">
                            <label htmlFor="title" className="col-sm-1 col-form-label">Title</label>
                            <div className="col-sm-11">
                                <input type="text" id="title" name="title" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    value={title}
                                    placeholder="Title" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-1 col-form-label">Name</label>
                            <div className="col-sm-11">
                                <input type="text" id="name" name="name" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    value={name}
                                    placeholder="Name" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="source" className="col-sm-1 col-form-label">Source</label>
                            <div className="col-sm-11">
                                <input type="text" id="source" name="source" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    value={source}
                                    placeholder="Source" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="published" className="col-sm-1 col-form-label">Published</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="published" id="published"
                                    value={published}
                                    onChange={e => handleArticleChange(e)}>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        {/* <div className="form-group row">
                            <label htmlFor="articlePicture" className="col-sm-1 col-form-label">Picture</label>
                            <div className="col-sm-11">
                                <input type="file" id="articlePicture" name="articlePicture"
                                    className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    placeholder="Article Picture" accept="image/*"
                                    value={article?.picture && isURL(article?.picture) ? "" : article.picture}
                                    required={article?.id ? false : true}></input>
                                {imageError && (<span style={{ color: "red", fontSize: "11px" }}>{imageError}</span>)}
                            </div>
                        </div> */}


                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Article Description</label>
                            <div className="col-sm-11">
                                <textarea id="description" name="description" className="form-control"
                                    onChange={e => handleArticleChange(e)}
                                    value={description}
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
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    {/* Same as */}
                    <ToastContainer />
                </div>
            </div>
        </div>
    );


};

export default EditArticle;
