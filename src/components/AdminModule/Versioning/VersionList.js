import React, { useState } from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Navbar from '../layout/Navbar'
import { Row, Col } from "react-bootstrap";
import './VersionList.css'


const VersionList = () => {

    const [version, setVersion] = useState({
        minIos: '',
        standardIos: '',
        minAndroid: '',
        standardAndroid: '',
    })

    const { minIos, standardIos, minAndroid, standardAndroid } = version

    const handleInputChange = (e) => {
        // e.preventDefault();
        console.log(e.target.name, e.target.value)
        // setCurrentPatient({ ...currentPatient, [e.target.name]: e.target.value });
        setVersion({ ...version, [e.target.name]: e.target.value });
    };

    const saveVersionHandler = (e) => {
        e.preventDefault();
        console.log({ version })
    }



    return (
        <div>
            <Navbar pageTitle="versioning" />
            <div className='container'>
                <div className='row'>

                    <div className="col-md-12 col-sm-12 custom-margin"><h1>Version Management</h1></div>
                    <div className='col-md-2'></div>
                    <div className='col-md-8'>
                        <div className='version-container'>
                            <ValidatorForm onSubmit={(e) => saveVersionHandler(e)}>
                                <Row>
                                    <Col md={12}>
                                        <p className='common-p-tags'>
                                            Minimum IOS version
                                        </p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="minIos"
                                            onChange={(e) => handleInputChange(e)}
                                            value={minIos}
                                            // validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                            // errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col md={12}>
                                        <p className='common-p-tags'>
                                            Standard IOS version
                                        </p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="standardIos"
                                            onChange={(e) => handleInputChange(e)}
                                            value={standardIos}
                                            // validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                            // errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />

                                <Row>
                                    <Col md={12}>
                                        <p className='common-p-tags'>
                                            Minimum Android version
                                        </p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="minAndroid"
                                            onChange={(e) => handleInputChange(e)}
                                            value={minAndroid}
                                            // validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                            // errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />

                                <Row>
                                    <Col md={12}>
                                        <p className='common-p-tags'>
                                            Standard Android version
                                        </p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="standardAndroid"
                                            onChange={(e) => handleInputChange(e)}
                                            value={standardAndroid}
                                            // validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                            // errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <div className="version-mgmt__button-wrapper">
                                    <button
                                        className="btn btn-primary save-dets-btn"
                                        type="submit"
                                    >
                                        Save Details
                                    </button>
                                </div>
                            </ValidatorForm>

                        </div>
                    </div>
                    <div className='col-md-2'></div>
                </div>
            </div>
        </div>
    )
}

export default VersionList