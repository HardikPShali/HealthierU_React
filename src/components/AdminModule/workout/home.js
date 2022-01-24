import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import 'mdbreact/dist/css/mdb.css';
import editIcon from '../../../images/icons used/edit icon_40 pxl.svg';
import deleteIcon from '../../../images/icons used/delete_icon_40 pxl.svg';
import { getWorkoutList } from '../../../service/adminbackendservices';

const WorkoutHome = () => {

    const [workoutList, setWorkoutList] = useState([]);
    const[isLoading, setIsLoading] = useState(true)

    const loadWorkoutList = async () => {
        const response = await getWorkoutList();
        if(response && response.data) {
            setWorkoutList(response.data.workoutsList);
            setIsLoading(false);
        }
    }

    useEffect(()=> {
        loadWorkoutList();
    }, [])

    return (
        <div>
            <Navbar pageTitle="workout" />
            <br />
            <div className="container">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-8"><h1>Workout</h1></div>
                        <div className="col-md-4 text-right pr-0">
                            <Link to="/admin/workout/add" className="float-right">
                                <button type="button" className="btn btn-primary">Add Workout</button>
                            </Link>
                        </div>
                    </div>

                    <table className="table border shadow">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sr.</th>
                                <th scope="col">Title</th>
                                <th scope="col">Video link</th>
                                <th scope="col">Category</th>
                                <th scope="col">Published</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading ? (
                                workoutList && workoutList.map((workout, index) => (
                                    <tr key={workout.id}>
                                        <td key="number">{index + 1}</td>
                                        <td key="title">{workout.title}</td>
                                        <td key="video_list">{workout.video_link}</td>
                                        <td key="category">{workout.workoutCategory.name}</td>
                                        <td key="published" >{String(workout.published).toUpperCase()}</td>
                                        <td key="action">
                                            <div>


                                                <Link
                                                    to={{
                                                        pathname: `/admin/workout/edit/${workout.id}`
                                                    }}>
                                                    <img width="15" height="15" src={editIcon} alt=""
                                                        style={{ marginLeft: '5%', marginRight: '5%' }} />
                                                </Link>

                                                <img width="15" height="15" src={deleteIcon}
                                                    //onClick={() => this.handleDeleteModal(article.id)} 
                                                    alt=""
                                                    style={{ marginLeft: '5%', marginRight: '5%' }} />

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
        </div>
    )
}

export default WorkoutHome;