import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "../../questionnaire/Questionnaire.css";
import "mdbreact/dist/css/mdb.css";
import Navbar from "../layout/Navbar";
import editIcon from "../../../images/icons used/edit icon_40 pxl.svg";
import deleteIcon from "../../../images/icons used/delete_icon_40 pxl.svg";
import TransparentLoader from "../../Loader/transparentloader";
import {
    getServiceProviderById,
    updateServiceProvider,
    addContacts,
    deleteContact,
    deleteLocation,
    deleteOpeningHours,
    addLocation,
    addOpeningHours,
    getServiceCategory
} from "./../../../service/adminbackendservices";
import { Tab, Tabs, Row, Col } from "react-bootstrap";
import moment from "moment";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
// import $ from "jquery";
// import { toDate } from "date-fns/esm";
// import editIcon from "../../../images/icons used/edit icon_40 pxl.svg";
// import deleteIcon from "../../../images/icons used/delete_icon_40 pxl.svg";
// import {
//     deleteQuestion,
//     saveQuestion
// } from "../../questionnaire/QuestionService";
// import {
//     editQuestionnaire,
//     getQuestionnaire
// } from "../../questionnaire/QuestionnaireService";
import ModalService from "../components/DeleteModal/ModalService"
import DeleteModal from "../components/DeleteModal/DeleteModal"
import ModalRoot from "../components/DeleteModal/ModalRoot"
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { set } from "date-fns/fp";
const EditServiceProvider = props => {
    //let history = useHistory()
    const { id } = useParams();
    // const { list } = props.location;
    //let selectedQuestion = null;
    const history = useHistory();
    const [serviceProvider, setServiceProvider] = useState({
        description: "",
        title: "",
        lat: "",
        lon: "",
        active: "",
        contacts: [],
        openingHours: [],
        locations: [],
        categories: []
    });
    const {
        description,
        title,
        lon,
        lat,
        active,
        contacts,
        openingHours,
        locations,
        categories
    } = serviceProvider;

    const [isLoading, setIsLoading] = useState(true);

    const handleInputChange = e => {
        setServiceProvider({
            ...serviceProvider,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = e => {
        const title = e.target.value;
        const newArray = [];
        serviceCategories.length > 0 &&
            serviceCategories.map((category, index) => {
                if (title === category.title) newArray.push(category);
                return serviceCategories;
            });
        setServiceProvider({ ...serviceProvider, categories: newArray });

    };
    const onContactInputChange = e => {
        setContactDetails({
            ...contactDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);
        const data = new FormData(event.target);
        //const resp = await editQuestionnaire(id, data);
        const res = await updateServiceProvider(id, data, categories);
        if (res) {
            history.push("/admin/serviceprovider/home");
        }
    };

    const handleContactSubmission = async event => {
        setIsLoading(true);
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await addContacts(id, data);
        if (resp) {
            setShowContact(false);
            await loadServiceProvider();
        }
    };

    const [showContact, setShowContact] = useState(false);
    // const [questionId, setQuestionId] = useState(null);
    const [contactDetails, setContactDetails] = useState({
        id: "",
        serviceProviderId: "",
        number: "",
        email: ""
    });

    const [serviceCategories, setServiceCategories] = useState([]);

    const loadServiceProvider = async () => {
        const result = await getServiceProviderById(`${id}`);
        //console.log(result.data)
        setServiceProvider(result.data);
        loadCategory();
    };

    const loadCategory = async () => {
        const result = await getServiceCategory();
        //console.log(result.data)
        setServiceCategories(result.data);
        setIsLoading(false);
    };

    const [selectedContactId, setSelectedContactId] = useState(0);
    useEffect(() => {
        loadServiceProvider();
        console.log("selectedContactId", selectedContactId);
    }, [selectedContactId]);
    // Contact Details

    const handleContactModal = data => {
        setContactDetails({
            ...contactDetails,
            id: "",
            serviceProviderId: null,
            number: null,
            email: null
        });
        setShowContact(true);
    };

    const handleEditContactModal = data => {
        setContactDetails({
            ...contactDetails,
            id: data.id,
            serviceProviderId: id,
            number: data.number,
            email: data.email
        });
        setShowContact(true);
    };
    // const [showDeleteContact, setShowDeleteContact] = useState(false);

    const handleDeleteContactModal = async (e, contactData) => {
        const resp = contactData.id;
        setSelectedContactId(resp);
        if (resp) {
            ModalService.open(DeleteModal);
        }
    };


    const handleDeleteContact = async (e) => {
        setIsLoading(true);
        const resp = deleteContact(selectedContactId);
        if (resp) {
            setSelectedContactId(0);
            toast.success("Contact successfully Deleted.");
            setTimeout(() => history.go(0), 500);
            loadServiceProvider();
        }

    };

    // Location Code

    const [showLocation, setShowLocation] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState(0);
    const [locationDetails, setLocationDetails] = useState({
        id: "",
        description: "",
        lon: "",
        lat: ""
    });
    const handleDeleteLocationModal = (locationdata) => {
        ModalService.open(DeleteModal);
        setSelectedLocationId(locationdata.id);
    };
    const handleDeleteLocation = async (e) => {
        setIsLoading(true);
        const resp = deleteLocation(selectedLocationId);
        if (resp) {
            setSelectedLocationId("");
            toast.success("Location successfully Deleted.");
            setTimeout(() => history.go(0), 500);
            loadServiceProvider();
        }
    };
    const handleLocationModal = data => {
        setLocationDetails({
            ...locationDetails,
            id: "",
            description: null,
            lon: null,
            lat: null
        });
        setShowLocation(true);
    };

    const handleEditLocationModal = data => {
        setLocationDetails({
            ...locationDetails,
            id: data.id,
            description: data.description,
            lon: data.lon,
            lat: data.lat
        });
        setShowLocation(true);
    };

    const onLocationInputChange = e => {
        setLocationDetails({
            ...locationDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleLocationSubmission = async event => {
        setIsLoading(true);
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await addLocation(id, data);
        if (resp) {
            setShowLocation(false);
            await loadServiceProvider();
        }
    };

    // Opening Hours

    const [showOpeningHours, setShowOpeningHours] = useState(false);
    const [selectedOpeningHoursId, setSelectedOpeningHoursId] = useState("");
    const [openingHoursDetails, setOpeningHoursDetails] = useState({
        id: "",
        closeTime: "",
        day: "",
        openTime: ""
    });
    const handleDeleteOpeningHoursModal = openingHoursData => {
        setSelectedOpeningHoursId(openingHoursData.id);
        ModalService.open(DeleteModal);
    };
    const handleOpeningHoursModal = data => {
        setOpeningHoursDetails({
            ...openingHoursDetails,
            id: "",
            closeTime: null,
            day: "Sunday",
            openTime: null
        });
        setShowOpeningHours(true);
    };
    const handleDeleteOpeningHours = async (e) => {
        setIsLoading(true);
        const resp = deleteOpeningHours(selectedOpeningHoursId);
        if (resp) {
            setSelectedOpeningHoursId("");
            toast.success("Opening Hours successfully Deleted.");
            setTimeout(() => history.go(0), 500);
            loadServiceProvider();
        }
    };
    const handleEditOpeningHoursModal = data => {
        setOpeningHoursDetails({
            ...openingHoursDetails,
            id: data.id,
            closeTime: moment(data.closeTime).format("HH:mm"),
            day: data.day,
            openTime: moment(data.openTime).format("HH:mm")
        });
        setShowOpeningHours(true);
    };

    const onOpeningHourInputChange = e => {
        setOpeningHoursDetails({
            ...openingHoursDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleOpeningHoursSubmission = async event => {
        setIsLoading(true);
        event.preventDefault();
        // const data = new FormData(event.target);
        const resp = await addOpeningHours(id, openingHoursDetails).catch(err => {
            //setErrorMsg("Something Went Wrong!");
            toast.error("Something went wrong. Please try again!")
            history.push(0)
        });
        if (resp) {
            setShowOpeningHours(false);
            await loadServiceProvider();
        }
    };


    const setClose = () => {
        setSelectedContactId("");
        setSelectedLocationId("");
        setSelectedOpeningHoursId("");
        loadServiceProvider();

    }

    return (
        <div>

            {isLoading && <TransparentLoader />}
            <Navbar pageTitle="serviceprovider" />
            <br />
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10">
                            <h1>
                                <b>Edit Service Provider</b>
                            </h1>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <input
                            hidden={true}
                            id="questionnaireId"
                            name="questionnaireId"
                            defaultValue={id}
                        //value={id}
                        ></input>
                        <div className="form-group row">
                            <label
                                htmlFor="description"
                                className="col-sm-2 col-form-label"
                            >
                                Title
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    maxLength="100"
                                    id="title"
                                    name="title"
                                    className="form-control"
                                    placeholder="Title"
                                    required
                                    value={title}
                                    onChange={e => handleInputChange(e)}
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="description"
                                className="col-sm-2 col-form-label"
                            >
                                Description
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    maxLength="100"
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    placeholder="description"
                                    required
                                    value={description}
                                    onChange={e => handleInputChange(e)}
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="description"
                                className="col-sm-2 col-form-label"
                            >
                                Longitude
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    maxLength="100"
                                    id="longitude"
                                    name="lon"
                                    className="form-control"
                                    placeholder="Longitude"
                                    required
                                    value={lon}
                                    onChange={e => handleInputChange(e)}
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="description"
                                className="col-sm-2 col-form-label"
                            >
                                Latitude
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    maxLength="100"
                                    id="latitude"
                                    name="lat"
                                    className="form-control"
                                    placeholder="Latitude"
                                    required
                                    value={lat}
                                    onChange={e => handleInputChange(e)}
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="active"
                                className="col-sm-2 col-form-label"
                            >
                                Service Category
                            </label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="categories"
                                    id="active"
                                    value={categories[0]?.title}
                                    onChange={e => handleCategoryChange(e)}
                                >
                                    <option value="">Select</option>
                                    {serviceCategories.length > 0 &&
                                        serviceCategories.map(
                                            (category, index) => (
                                                <option
                                                    value={
                                                        category &&
                                                        category.title
                                                    }
                                                >
                                                    {category && category.title}
                                                </option>
                                            )
                                        )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="active"
                                className="col-sm-2 col-form-label"
                            >
                                Active
                            </label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="active"
                                    id="active"
                                    value={active}
                                    onChange={e => handleInputChange(e)}
                                >
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6"></div>
                            <div className="col-md-6 text-right">
                                <button
                                    className="btn btn-primary mr-2"
                                    id="updateBtn"
                                >
                                    Update
                                </button>
                                <Link
                                    to={{
                                        pathname: `/admin/serviceprovider/home`
                                    }}
                                >
                                    <button className="btn btn-light mr-2">
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </form>

                    <br />
                    <br />
                    <br />
                    <div id="service" className="mt-4">
                        <Tabs
                            className="justify-content-center"
                            defaultActiveKey="contact"

                        >

                            <Tab eventKey="contact" title="Contact Details">
                                <br />
                                <Row>
                                    <Col md={2}></Col>
                                    <Col md={8} className="info-box">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>S.no</th>
                                                    <th>Number</th>
                                                    <th>Email</th>
                                                    <th>Type</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {contacts.length > 0 &&
                                                    contacts.map(
                                                        (contact, index) => (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        {index + 1}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            contact.number
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            contact.email
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            contact.type
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            src={editIcon}
                                                                            onClick={() =>
                                                                                handleEditContactModal(contact)
                                                                            }
                                                                            alt=""
                                                                            style={{ marginLeft: "5%", marginRight: "5%" }
                                                                            }
                                                                        />

                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            src={deleteIcon}
                                                                            onClick={(e) =>
                                                                                handleDeleteContactModal(e, contact)
                                                                            }
                                                                            className="delete-icon"
                                                                            alt=""
                                                                            style={{ marginLeft: "5%", marginRight: "5%" }}
                                                                        />

                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    )}
                                            </tbody>
                                        </table>
                                        {contacts.length === 0 && (
                                            <>
                                                <div
                                                    style={{
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    No contact details found ...
                                                </div>
                                            </>
                                        )}
                                        <br />
                                        <Row>
                                            <Col md={12} className="text-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleContactModal([])
                                                    }
                                                >
                                                    Add Contact
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={3}></Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="location" title="Location Details">
                                <br />
                                <Row>
                                    <Col md={3}></Col>
                                    <Col md={6} className="info-box">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>S.no</th>
                                                    <th>Description</th>
                                                    <th>Longitude</th>
                                                    <th>Latitude</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {locations.length > 0 &&
                                                    locations.map(
                                                        (location, index) => (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            location.description
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            location.lon
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            location.lat
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            src={editIcon}
                                                                            onClick={() =>
                                                                                handleEditLocationModal(
                                                                                    location
                                                                                )
                                                                            }
                                                                            alt=""
                                                                            style={{ marginLeft: "5%", marginRight: "5%" }
                                                                            }
                                                                        />

                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            src={deleteIcon}
                                                                            onClick={(e) =>
                                                                                handleDeleteLocationModal(location)
                                                                            }
                                                                            className="delete-icon"
                                                                            alt=""
                                                                            style={{ marginLeft: "5%", marginRight: "5%" }}
                                                                        />

                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    )}
                                            </tbody>
                                        </table>
                                        {locations.length === 0 && (
                                            <>
                                                <div
                                                    style={{
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    No location details found
                                                    ...
                                                </div>
                                            </>
                                        )}
                                        <br />
                                        <Row>
                                            <Col md={12} className="text-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleLocationModal([])
                                                    }
                                                >
                                                    Add Location
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={3}></Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="openingHours" title="Opening Hours">
                                <br />
                                <Row>
                                    <Col md={3}></Col>
                                    <Col md={6} className="info-box">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>S.no</th>
                                                    <th>Day</th>
                                                    <th>Open Time</th>
                                                    <th>Close Time</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {openingHours.length > 0 &&
                                                    openingHours.map(
                                                        (hour, index) => (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        {index +
                                                                            1}
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            hour.day
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {moment(
                                                                            new Date(
                                                                                hour.openTime
                                                                            )
                                                                        ).format(
                                                                            "hh:mm A"
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {moment(
                                                                            new Date(
                                                                                hour.closeTime
                                                                            )
                                                                        ).format(
                                                                            "hh:mm A"
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            src={editIcon}
                                                                            onClick={() =>
                                                                                handleEditOpeningHoursModal(
                                                                                    hour
                                                                                )
                                                                            }
                                                                            alt=""
                                                                            style={{ marginLeft: "5%", marginRight: "5%" }
                                                                            }
                                                                        />

                                                                        <img
                                                                            width="15"
                                                                            height="15"
                                                                            src={deleteIcon}
                                                                            onClick={() =>
                                                                                handleDeleteOpeningHoursModal(hour)
                                                                            }
                                                                            className="delete-icon"
                                                                            alt=""
                                                                            style={{ marginLeft: "5%", marginRight: "5%" }}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    )}
                                            </tbody>
                                        </table>
                                        {openingHours.length === 0 && (
                                            <>
                                                <div
                                                    style={{
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    No opening hours found ...
                                                </div>
                                            </>
                                        )}
                                        <br />
                                        <Row>
                                            <Col md={12} className="text-right">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleOpeningHoursModal()
                                                    }
                                                >
                                                    Add Opening Hours
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md={3}></Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Contact form modal */}
            <Modal show={showContact}>
                <form onSubmit={e => handleContactSubmission(e)}>
                    <Modal.Header closeButton={true}>
                        {contactDetails?.id ? (
                            <Modal.Title>Edit Contact</Modal.Title>
                        ) : (
                            <Modal.Title>Add Contact</Modal.Title>
                        )}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group row">
                            <input
                                hidden={true}
                                id="questionnaireId"
                                name="questionnaireId"
                                value={id}
                            ></input>
                            <input
                                hidden={true}
                                id="id"
                                name="id"
                                value={
                                    contactDetails?.id
                                        ? contactDetails?.id
                                        : undefined
                                }
                                onChange={e => onContactInputChange(e)}
                            ></input>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="topic"
                                className="col-sm-3 col-form-label"
                            >
                                Phone
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    maxLength="100"
                                    id="number"
                                    name="number"
                                    className="form-control"
                                    value={contactDetails?.number}
                                    onChange={e => onContactInputChange(e)}
                                    placeholder="Phone Number"
                                    required
                                ></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="topicOrder"
                                className="col-sm-3 col-form-label"
                            >
                                Email
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    value={contactDetails?.email}
                                    onChange={e => onContactInputChange(e)}
                                    placeholder="Email"
                                ></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="active"
                                className="col-sm-3 col-form-label"
                            >
                                Type
                            </label>
                            <div className="col-sm-9">
                                <select
                                    className="form-control"
                                    name="type"
                                    id="active"
                                    value={contactDetails?.type}
                                    onChange={e => handleInputChange(e)}
                                >
                                    <option value={"HOME"}>Home</option>
                                    <option value={"BUSINESS"}>Business</option>
                                </select>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowContact(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* Contact delete modal */}

            {/* <Modal
                show={showDeleteContact}
                onHide={() => setShowDeleteContact(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Contact</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure to Delete the Contact ?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteContact(false)}
                    >
                        Close
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleDeleteContact()}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal> */}

            {/* Location form modal */}
            <Modal show={showLocation}>
                <form onSubmit={e => handleLocationSubmission(e)}>
                    <Modal.Header closeButton={true}>
                        {contactDetails?.id ? (
                            <Modal.Title>Edit Location</Modal.Title>
                        ) : (
                            <Modal.Title>Add Location</Modal.Title>
                        )}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group row">
                            <input
                                hidden={true}
                                id="questionnaireId"
                                name="questionnaireId"
                                value={id}
                            ></input>
                            <input
                                hidden={true}
                                id="id"
                                name="id"
                                value={
                                    locationDetails?.id
                                        ? locationDetails?.id
                                        : null
                                }
                                onChange={e => onLocationInputChange(e)}
                            ></input>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="topic"
                                className="col-sm-3 col-form-label"
                            >
                                Description
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    className="form-control"
                                    value={locationDetails?.description}
                                    onChange={e => onLocationInputChange(e)}
                                    placeholder="Description"
                                    required
                                ></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="topicOrder"
                                className="col-sm-3 col-form-label"
                            >
                                Longitude
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="lon"
                                    name="lon"
                                    className="form-control"
                                    value={locationDetails?.lon}
                                    onChange={e => onLocationInputChange(e)}
                                    placeholder="Longitude"
                                ></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="topicOrder"
                                className="col-sm-3 col-form-label"
                            >
                                Latitude
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="text"
                                    id="lat"
                                    name="lat"
                                    className="form-control"
                                    value={locationDetails?.lat}
                                    onChange={e => onLocationInputChange(e)}
                                    placeholder="Latitude"
                                ></input>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowLocation(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {/* OpeningHours form modal */}
            <Modal show={showOpeningHours}>
                <form onSubmit={e => handleOpeningHoursSubmission(e)}>
                    <Modal.Header closeButton={true}>
                        {openingHoursDetails?.id ? (
                            <Modal.Title>Edit Opening Hours</Modal.Title>
                        ) : (
                            <Modal.Title>Add Opening Hours</Modal.Title>
                        )}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group row">
                            <input
                                hidden={true}
                                id="questionnaireId"
                                name="questionnaireId"
                                value={id}
                            ></input>
                            <input
                                hidden={true}
                                id="id"
                                name="id"
                                value={
                                    openingHoursDetails?.id
                                        ? openingHoursDetails?.id
                                        : null
                                }
                                onChange={e => onOpeningHourInputChange(e)}
                            ></input>
                        </div>
                        <div className="form-group row">
                            <label
                                htmlFor="active"
                                className="col-sm-3 col-form-label"
                            >
                                Day
                            </label>
                            <div className="col-sm-9">
                                <select
                                    className="form-control"
                                    name="day"
                                    id="day"
                                    required
                                    value={openingHoursDetails?.day}
                                    onChange={e => onOpeningHourInputChange(e)}
                                >
                                    <option value={"Sunday"}>Sunday</option>
                                    <option value={"Monday"}>Monday</option>
                                    <option value={"Tuesday"}>Tuesday</option>
                                    <option value={"Wednesday"}>
                                        Wednesday
                                    </option>
                                    <option value={"Friday"}>Friday</option>
                                    <option value={"Saturday"}>Saturday</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="topicOrder"
                                className="col-sm-3 col-form-label"
                            >
                                Open Time
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="time"
                                    id="lon"
                                    name="openTime"
                                    className="form-control"
                                    required
                                    value={openingHoursDetails?.openTime}
                                    onChange={e => onOpeningHourInputChange(e)}
                                    placeholder="Close Time"
                                ></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label
                                htmlFor="topicOrder"
                                className="col-sm-3 col-form-label"
                            >
                                Close Time
                            </label>
                            <div className="col-sm-9">
                                <input
                                    type="time"
                                    id="closeTime"
                                    name="closeTime"
                                    className="form-control"
                                    value={openingHoursDetails?.closeTime}
                                    required
                                    onChange={e => onOpeningHourInputChange(e)}
                                    placeholder="Close Time"
                                ></input>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowOpeningHours(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            {selectedContactId &&
                <ModalRoot componentName="Contact" handleDeleteSubmit={(e) => handleDeleteContact(e)} handleState={setClose} />
            }
            {selectedLocationId &&
                <ModalRoot componentName="Location" handleDeleteSubmit={(e) => handleDeleteLocation(e)} handleState={setClose} />
            }
            {selectedOpeningHoursId &&
                <ModalRoot componentName="Opening Hours" handleDeleteSubmit={(e) => handleDeleteOpeningHours(e)} handleState={setClose} />
            }
        </div >
    );
};

export default EditServiceProvider;
