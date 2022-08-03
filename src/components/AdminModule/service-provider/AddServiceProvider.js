import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../questionnaire/Questionnaire.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import { saveServiceProvider } from "./../../../service/adminbackendservices";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
const AddServiceProvider = () => {
    const history = useHistory();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await saveServiceProvider(data).catch(err => {
            console.log({ err })
            toast.error('An entry with these details already exist. Please add new details to add new Service Providers.', {
                toastId: "errorDuplicate",
            });
        });
        if (resp && resp.status === 201) {
            handleRedirect(resp);
        }
    }

    const handleRedirect = (e) => {
        if (e) {
            history.push('/admin/serviceprovider/home');
        }
    }

    useEffect(() => {
        getLocation();
    }, [])

    const [lon, setLon] = useState(null);
    const [lat, setLat] = useState(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //console.log("Geolocation is not supported by this browser.");
        }
    }

    const showPosition = (position) => {
        setLon(position.coords.longitude);
        setLat(position.coords.latitude);
        //console.log("Latitude: ", position.coords.latitude,"Longitude: ", position.coords.longitude);
    }


    return (
        <div>
            <Navbar pageTitle="serviceprovider" />
            <br />
            <br />
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1>Add Service Providers</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Title</label>
                            <div className="col-sm-11">
                                <input type="text" maxLength="100" id="title" name="title" className="form-control"
                                    placeholder="Title" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Description</label>
                            <div className="col-sm-11">
                                <input type="text" maxLength="100" id="description" name="description" className="form-control"
                                    placeholder="description" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Longitude</label>
                            <div className="col-sm-11">
                                <input type="text" maxLength="100" id="longitude" name="lon" className="form-control"
                                    placeholder="Longitude" value={lon} required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="description" className="col-sm-1 col-form-label">Latitude</label>
                            <div className="col-sm-11">
                                <input type="text" maxLength="100" id="latitude" name="lat" className="form-control"
                                    placeholder="Latitude" value={lat} required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="active" className="col-sm-1 col-form-label">Active</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="active" id="active">
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
                                <button className="btn btn-primary mr-2">Save</button>
                                <Link to="/admin/serviceprovider/home">
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

export default AddServiceProvider;
