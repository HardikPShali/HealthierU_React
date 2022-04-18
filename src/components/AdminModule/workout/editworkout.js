import React, { useEffect, useState } from "react";
import { getWorkoutCategoryList, getWorkoutById, updateWorkout } from "../../../service/adminbackendservices";
import { Link, useParams } from "react-router-dom";
// import '../../../component/questionnaire/Questionnaire.css';
import '../../questionnaire/Questionnaire.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
const EditWorkout = () => {

    //let history = useHistory();
    const { id } = useParams();
    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const res = await updateWorkout(data);
        if (res) {
            toast.success("Workout successfully updated.");
            setTimeout(() => history.push('/admin/workout/home'), 500);
        }

    }

    const loadWorkout = async () => {
        const res = await getWorkoutById(id);
        if (res && res.data) {
            setWorkout({
                ...workout,
                title: res.data.title,
                video_link: res.data.video_link,
                workoutCategoryId: res.data.workoutCategoryId,
                published: res.data.published,
                id: parseInt(id)
            })
        }
    }

    const [categoryList, setCategoryList] = useState([]);

    const loadWorkoutCategories = async () => {
        const response = await getWorkoutCategoryList();
        if (response && response.data) {
            setCategoryList(response.data);
        }
    }

    useEffect(() => {
        loadWorkout();
        loadWorkoutCategories();
    }, [])

    const handleWorkoutChange = e => {
        setWorkout({ ...workout, [e.target.name]: e.target.value });
    };

    const handleWorkoutCategoryChange = e => {
        setWorkout({ ...workout, [e.target.name]: parseInt(e.target.value) });
    };

    const handleWorkoutPublishedChange = e => {
        setWorkout({ ...workout, [e.target.name]: e.target.value === "true" ? true : e.target.value === "false" ? false : false });
    };

    const [workout, setWorkout] = useState({
        title: "",
        workoutCategoryId: "",
        video_link: "",
        published: false
    });


    const {
        title,
        workoutCategoryId,
        video_link,
        published
    } = workout;

    const handleRedirect = (e) => {
        if (e) {
            toast.success("Workout successfully updated.");
            setTimeout(() => history.push('/admin/workout/home'), 1000);

        }
    }

    //useEffect(() => {
    //    loadArticle();
    //}, []);

    //const loadArticle = async () => {
    //    const result = await getArticle(`${id}`);
    //    //console.log(result)
    //    setArticle(result);
    //};



    return (
        <div>
            <Navbar pageTitle="workout" />

            <br />
            <br />
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1>Edit Workout</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <input hidden={true} id="id" name="id" value={workout?.id}
                            onChange={e => handleWorkoutChange(e)}
                        ></input>
                        <div className="form-group row">
                            <label htmlFor="title" className="col-sm-1 col-form-label">Title</label>
                            <div className="col-sm-11">
                                <input type="text" id="title" name="title" className="form-control"
                                    onChange={e => handleWorkoutChange(e)}
                                    value={title}
                                    placeholder="Title" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="source" className="col-sm-1 col-form-label">Video link</label>
                            <div className="col-sm-11">
                                <input type="text" id="source" name="video_link" className="form-control"
                                    onChange={e => handleWorkoutChange(e)}
                                    value={video_link}
                                    placeholder="Video link" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="published" className="col-sm-1 col-form-label">Category</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="workoutCategoryId" id="category"
                                    value={workoutCategoryId}
                                    onChange={e => handleWorkoutCategoryChange(e)}>
                                    <option value="">Select Category</option>
                                    {categoryList && categoryList.map((category, index) => (
                                        <option value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="published" className="col-sm-1 col-form-label">Published</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="published" id="published"
                                    value={published}
                                    onChange={e => handleWorkoutPublishedChange(e)}>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        <br />
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6 text-right">
                                <button className="btn btn-primary mr-2">Edit</button>
                                <Link to="/admin/workout/home">
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

export default EditWorkout;
