import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import 'mdbreact/dist/css/mdb.css';
import editIcon from '../../../images/icons used/edit icon_40 pxl.svg';
import deleteIcon from '../../../images/icons used/delete_icon_40 pxl.svg';
import {Button,Modal } from "react-bootstrap";
import { getWorkouts, deleteWorkout } from "../../../service/workoutservice";
import "../components/Table/Table";
import Table from "../components/Table/Table";
import AddButton from "../components/Button/Button";
import "../components/Button/Button";
class WorkoutHome extends React.Component {


    state = {
        isLoading: true,
        workouts: null,
        selectedWorkout: null,
        error: null,
        showDelete: false
    }
    headers = [
        {
            label: "Sr.",
            key: "serialno",
        },
        {
            label: "Title",
            key: "title",
        },
        {
            label: "Video Link",
            key: "videolink",
        },
        {
            label: "Category",
            key: "category",
        },
        {
            label: "Published",
            key: "published",
        },
        {
            label: "Action",
            key: "action",
        },
    ];

    async componentDidMount() {
        // GET request using fetch with async/await
        const response = await getWorkouts();
    
        const data = response.workoutsList.map((d, i) => {
            d.serialno = i + 1;
            d.videolink = d.video_link;
            d.category = d.workoutCategory.name;
            d.published = d.published ? 'TRUE' : 'FALSE';
            return d;
        })
        this.setState({ workouts: data, isLoading: false })
    }

    handleDeleteModal = remove => {

        this.setState({ selectedWorkout: remove })
        this.setState({ showDelete: true });
    }



    render() {

        const { isLoading } = this.state;

        return (
            <div>
                <Navbar pageTitle="workout" />
                <br />
                <div className="container">
                    <div className="py-4">
                        <div className="row">
                            <div className="col-md-6 col-sm-6"><h1>Workout</h1></div>
                            <div className="col-md-6 col-sm-6 pr-0" style={{ textAlign: "right" }}>
                                {/* <Link to="/admin/workout/add">
                                    <button type="button" className="btn btn-primary">Add Workout</button>
                                </Link> */}
                                 <AddButton addLink='workout'>Workout</AddButton>
                            </div>
                        </div>
                        <Table
                            data={this.state.workouts}
                            isLoading={isLoading}
                            headers={this.headers}
                            editLink='/admin/workout/edit/'
                            handleDelete={this.handleDeleteModal}
                        ></Table>
                        {/* <table className="table border shadow">
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
                                    this.state.workouts.workoutsList.map((workout, index) => (
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
                                                    onClick={() => this.handleDeleteModal(workout.id)} alt=""
                                                        style={{ marginLeft: '5%', marginRight: '5%' }} />

                                            </div>
                                        </td>
                                    </tr>
                                    ))) : (
                                        <span>Loading...</span>
                                    )}
                            </tbody>
                        </table> */}
                    </div>
                </div>

                <Modal show={this.state.showDelete} onHide={() => this.setState({ showDelete: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Workout</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><p>Are you sure to Delete the Workout ?</p></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showDelete: false })}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => this.handleDeleteWorkoutSubmission()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }


    handleDeleteWorkoutSubmission = async (event) => {
        const resp = deleteWorkout(this.state.selectedWorkout);

        await resp.then(response => {
            this.setState({ selectedWorkout: null, showDelete: false })
            this.componentDidMount();
            return response.data;
        })

    }

};

export default WorkoutHome;
