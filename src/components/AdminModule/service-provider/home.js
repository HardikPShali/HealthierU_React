import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import { Button, Modal } from "react-bootstrap";
import Navbar from "../layout/Navbar";
import 'mdbreact/dist/css/mdb.css';
import TransparentLoader from "../../Loader/transparentloader";
import { getServiceProviders, deleteServiceProvider } from "./../../../service/adminbackendservices";
import ModalService from "../components/DeleteModal/ModalService"
import DeleteModal from "../components/DeleteModal/DeleteModal"
import ModalRoot from "../components/DeleteModal/ModalRoot"
import { toast } from 'react-toastify';
import AddButton from "../components/Button/Button";
import Table from "../components/Table/Table";
import { useHistory } from 'react-router-dom';
const ServiceProvidersHome = () => {
    const headers = [
        {
            label: "Sr.",
            key: "serialno",
        },
        {
            label: "Title",
            key: "title",
        },
        {
            label: "Description",
            key: "description",
        },
        {
            label: "Longitude",
            key: "lon",
        },
        {
            label: "Latitude",
            key: "lat",
        },
        {
            label: "Active",
            key: "active",
        },
        {
            label: "Action",
            key: "action",
        },
    ];
    const [isLoading, setIsLoading] = useState(true);
    const [serviceProviders, setServiceProvider] = useState(null);
    const history = useHistory();
    const [selectedServiceProvider, setSelectedServiceProvider] = useState(null);
    // const [error, setError] = useState(null);
    const [showDelete, setShowDelete] = useState(false);



    useEffect(() => {
        loadServiceProviders();
    }, []);

    const loadServiceProviders = async () => {
        const response = await getServiceProviders();

        const serviceproviderData = response.data.map((d, i) => {
            d.serialno = i + 1;
            d.active = String(d.active).toUpperCase()
            return d;
        })
        console.log(serviceproviderData);
        setServiceProvider(serviceproviderData);
        setIsLoading(false);
        // if (response) {

        // }
    }

    const handleDeleteModal = remove => {
        setSelectedServiceProvider(remove);
        console.log(remove);
        // setShowDelete(true);
        ModalService.open(DeleteModal);
    }

    const handleDeleteServiceProvider = async () => {
        setIsLoading(true);
        const resp = await deleteServiceProvider(selectedServiceProvider);
        if (resp) {
            setSelectedServiceProvider(null);
            // setShowDelete(false);
            toast.success("Service Provider successfully Deleted.");
            setTimeout(() => history.go(0), 1000);
            loadServiceProviders();
        }
    }


    return (
        <div>
            {isLoading && (
                <TransparentLoader />
            )}
            <Navbar pageTitle="serviceprovider" />
            <br />
            <div className="container">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-6 col-sm-6"><h1>Service Providers</h1></div>
                        <div className="col-md-6 col-sm-6 pr-0" style={{ textAlign: "right" }}>
                            {/* <Link to="/admin/serviceprovider/add">
                                <button type="button" className="btn btn-primary">Add Service Provider</button>
                            </Link> */}
                            <AddButton addLink='serviceprovider'>Service Provider</AddButton>
                        </div>
                    </div>
                    <Table
                        data={serviceProviders}
                        isLoading={isLoading}
                        headers={headers}
                        editLink='/admin/serviceprovider/edit/'
                        handleDelete={(e) => handleDeleteModal(e)}
                    ></Table>

                    {/* <table className="table border shadow">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sr.</th>
                                <th scope="col">Title</th>
                                <th scope="col">Service Category</th>
                                <th scope="col">Description</th>
                                <th scope="col">Longitude</th>
                                <th scope="col">Latitude</th>
                                <th scope="col">Active</th>
                                <th scope="col"
                                // className="Questionnaire-Action-Area-padding"
                                >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {serviceProviders?.length > 0 ? serviceProviders.map((list, index) => (
                                <tr key={list.id}>
                                    <td key="number">{index + 1}</td>
                                    <td key="description">{list.title}</td>
                                    <td key="description">{list.categories.length > 0 && list.categories[0].title}</td>
                                    <td key="description">{list.description}</td>
                                    <td key="description">{list.lon}</td>
                                    <td key="description">{list.lat}</td>
                                    <td key="published" >{String(list.active).toUpperCase()}</td>
                                    <td key="action"
                                    >
                                        <div>
                                            <Link
                                                to={{
                                                    pathname: `/admin/serviceprovider/edit/${list.id}`,
                                                    list: list
                                                }}>
                                                <button className="btn btn-info mr-2">Edit</button></Link>
                                            <button className="btn btn-danger"
                                                onClick={() => handleDeleteModal(list)}>Delete
                                            </button>
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
                    </table> */}
                </div>
            </div>
            <ModalRoot componentName="Service Provider" handleDeleteSubmit={handleDeleteServiceProvider} />
            {/* <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Service Provider</Modal.Title>
                </Modal.Header>
                <Modal.Body><p>Are you sure to Delete the Service Provider ?</p></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDelete(false)}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteServiceProvider()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    );
}

export default ServiceProvidersHome;