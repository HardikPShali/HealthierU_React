import React from 'react'
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator'
import Navbar from '../layout/Navbar'
import { Row, Col } from "react-bootstrap";
import './VersionList.css'


const VersionList = () => {
    return (
        <div>
            <Navbar pageTitle="versioning" />
            <div className='container'>
                <div className='row'>
                    {/* <div className='col-md-2'></div> */}
                    <div className="col-md-12 col-sm-12 custom-margin"><h1>Version Management</h1></div>
                    <div className='col-md-12'>
                        <div className='version-container'>
                            <div className='form-section'>
                                <ValidatorForm>
                                    <Row>
                                        <Col md={6}>
                                            <p className='common-p-tags'>
                                                Minimum IOS version
                                            </p>
                                            <TextValidator
                                                id="standard-basic"
                                                type="text"
                                                name="firstName"
                                                // onChange={(e) => handleInputChange(e)}
                                                // value={firstName}
                                                validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                                variant="filled"
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col md={6}>
                                            <p className='common-p-tags'>
                                                Standard IOS version
                                            </p>
                                            <TextValidator
                                                id="standard-basic"
                                                type="text"
                                                name="firstName"
                                                // onChange={(e) => handleInputChange(e)}
                                                // value={firstName}
                                                validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                                variant="filled"
                                            />
                                        </Col>
                                    </Row>
                                    <br />

                                    <Row>
                                        <Col md={6}>
                                            <p className='common-p-tags'>
                                                Minimum Android version
                                            </p>
                                            <TextValidator
                                                id="standard-basic"
                                                type="text"
                                                name="firstName"
                                                // onChange={(e) => handleInputChange(e)}
                                                // value={firstName}
                                                validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                                variant="filled"
                                            />
                                        </Col>
                                    </Row>
                                    <br />

                                    <Row>
                                        <Col md={6}>
                                            <p className='common-p-tags'>
                                                Standard Android version
                                            </p>
                                            <TextValidator
                                                id="standard-basic"
                                                type="text"
                                                name="firstName"
                                                // onChange={(e) => handleInputChange(e)}
                                                // value={firstName}
                                                validators={["required", "matchRegexp:^[a-zA-Z ]+$"]}
                                                errorMessages={["This field is required", "First Name cannot have any numeric values"]}
                                                variant="filled"
                                            />
                                        </Col>
                                    </Row>
                                </ValidatorForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VersionList