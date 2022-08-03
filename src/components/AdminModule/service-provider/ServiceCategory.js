import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import { Button, Modal } from "react-bootstrap";
import Navbar from "../layout/Navbar";
//import {deleteQuestion} from "../../../component/questionnaire/QuestionService";
import 'mdbreact/dist/css/mdb.css';
import TransparentLoader from "../../Loader/transparentloader";
import { getServiceCategory, deleteServiceCategory, addServiceCategory } from "./../../../service/adminbackendservices";
import ModalService from "../components/DeleteModal/ModalService"
import DeleteModal from "../components/DeleteModal/DeleteModal"
import ModalRoot from "../components/DeleteModal/ModalRoot"
import { toast } from 'react-toastify';
import editIcon from "../../../images/icons used/edit icon_40 pxl.svg";
import deleteIcon from "../../../images/icons used/delete_icon_40 pxl.svg";
import { useHistory } from 'react-router-dom';
const ServiceCategory = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const [serviceCategorys, setServiceCategory] = useState(null);
    const [selectedServiceCategory, setSelectedServiceCategory] = useState(null);
    // const [error, setError] = useState(null);
    const [showDelete, setShowDelete] = useState(false);



    useEffect(() => {
        loadServiceCategory();
    }, []);

    const loadServiceCategory = async () => {
        const response = await getServiceCategory();
        if (response) {
            setServiceCategory(response.data);
            setIsLoading(false);
        }
    }

    const handleDeleteModal = remove => {
        setSelectedServiceCategory(remove);
        // setShowDelete(true);
        ModalService.open(DeleteModal);
    }

    const handleDeleteServiceCategory = async (event) => {
        setIsLoading(true);
        const resp = deleteServiceCategory(selectedServiceCategory.id);
        if (resp) {
            // setSelectedServiceCategory(null);
            // setShowDelete(false);
            toast.success("Service Category successfully Deleted.");
            setTimeout(() => history.go(0), 2000);
            // loadServiceCategory();
        }
    }

    const [show, setShow] = useState(false);
    const [categoryDetails, setCategoryDetails] = useState({
        id: "",
        title: "",
        description: ""
    });

    const handleInputChange = (e) => {
        setCategoryDetails({ ...categoryDetails, [e.target.name]: e.target.value })
    }

    const handleAddModal = (data) => {
        setCategoryDetails({ ...categoryDetails, id: "", title: null, description: "" });
        setShow(true);
    }

    const handleEditModal = data => {
        setCategoryDetails({
            ...categoryDetails,
            id: data.id,
            title: data.title,
            description: data.description,
        });
        setShow(true);
    }

    const handleSubmission = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await addServiceCategory(data).catch(err => {
            console.log(err);
            toast.error("An entry with these details already exist. Please add new details to add new Service Category.", {
                toastId: "errorDuplicate",
            })
            setIsLoading(false);
        });
        if (resp) {
            setShow(false);
            await loadServiceCategory();
        }
    }


    return (
        <div>
            {isLoading && (
                <TransparentLoader />
            )}
            <Navbar pageTitle="category" />
            <br />
            <div className="container">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-6 col-sm-6"><h1>Service Categories</h1></div>
                        <div className="col-md-6 col-sm-6 pr-0" style={{ textAlign: "right" }}>
                            <button type="button" className="btn btn-primary" onClick={() => handleAddModal()}>Add Service Category</button>
                        </div>
                    </div>

                    <table className="table border shadow">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sr.</th>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col"
                                // className="Questionnaire-Action-Area-padding"
                                >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceCategorys?.length > 0 ? serviceCategorys.map((list, index) => (
                                <tr key={list.id}>
                                    <td key="number">{index + 1}</td>
                                    <td key="description">{list.title}</td>
                                    <td key="description">{list.description}</td>
                                    <td key="action"
                                    >
                                        <div>
                                            <img
                                                width="15"
                                                height="15"
                                                src={editIcon}
                                                onClick={() => handleEditModal(list)}
                                                alt=""
                                                style={{ marginLeft: "5%", marginRight: "5%", cursor: "pointer" }
                                                }
                                            />

                                            <img
                                                width="15"
                                                height="15"
                                                src={deleteIcon}
                                                onClick={() => handleDeleteModal(list)}
                                                className="delete-icon"
                                                alt=""
                                                style={{ marginLeft: "5%", marginRight: "5%", cursor: "pointer" }}
                                            />
                                            {/* <button className="btn btn-info mr-2" onClick={() => handleEditModal(list)}>Edit</button>
                                            <button className="btn btn-danger"
                                                onClick={() => handleDeleteModal(list)}>Delete
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5}>
                                        <center><span>No Data Available ...</span></center>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
            <ModalRoot componentName="Service Category" handleDeleteSubmit={handleDeleteServiceCategory} />
            {/* <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Service Category</Modal.Title>
                </Modal.Header>
                <Modal.Body><p>Are you sure to Delete the Service Category ?</p></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteServiceCategory()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* Location form modal */}
            <Modal show={show}>
                <form onSubmit={e => handleSubmission(e)}>
                    <Modal.Header>
                        {categoryDetails?.id ? <Modal.Title>Edit Category</Modal.Title> : <Modal.Title>Add Category</Modal.Title>}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group row">
                            <input hidden={true} id="id" name="id" value={categoryDetails?.id ? categoryDetails?.id : null}
                                onChange={e => handleInputChange(e)}
                            ></input>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-3 col-form-label">Title</label>
                            <div className="col-sm-9">
                                <input type="text" id="title" name="title" className="form-control"
                                    placeholder="Title" required
                                    value={categoryDetails?.title}
                                    onChange={e => handleInputChange(e)}
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-3 col-form-label">Description</label>
                            <div className="col-sm-9">
                                <input type="text" id="description" name="description" className="form-control"
                                    placeholder="description" required
                                    value={categoryDetails?.description}
                                    onChange={e => handleInputChange(e)}
                                ></input>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShow(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
}

export default ServiceCategory;