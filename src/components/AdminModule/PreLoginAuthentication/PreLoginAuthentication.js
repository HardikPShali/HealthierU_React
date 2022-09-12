import React, { useState, useeffect, useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Navbar from '../layout/Navbar';
import { Row, Col } from 'react-bootstrap';
import { getPreLoginAccessCode } from '../../../service/frontendapiservices';
import Loader from '../../Loader/Loader';
import "./PreLoginAuthetication.css";
const PreLoginAuthentication = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPreLoginAuthicationEnabled, setIsPreLoginAuthicationEnabled] = useState(true)
    const [preLoginAuthicationCode, setPreLoginAuthicationCode] = useState('')
    const handleInputChange = (e) => {
        setPreLoginAuthicationCode(e.target.value);
    };
    const getPreLoginAuthenticationCode = async () => {
        setIsLoading(true);
        const response = await getPreLoginAccessCode().catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
        if (response.status === true) {
            setIsLoading(false);
            setIsPreLoginAuthicationEnabled(response.data.isPreLoginAuthicationEnabled);
            setPreLoginAuthicationCode(response.data.preLoginCode)
        }
        setIsLoading(false);
    };

    //Toggle
    const handleToggle = async (e, eachTimes) => {
        const data = {
            preLoginCode: preLoginAuthicationCode,
            isPreLoginAuthicationEnabled: e.target.checked,
        };
        // const res = await toggleRecurSlots(data);
        // if (res) {
        // }
    };
    const savePreLoginAuthenticationHandler = async (e) => {
        e.preventDefault();
        // setIsLoading(true);
        // const response = await saveLatestVersions(preLoginAuthicationCode).catch((err) => {
        //     console.log(err);
        // });
        // if (response.status === true) {
        //     setIsLoading(false);
        //     setIsPreLoginAuthicationEnabled(response.data.isPreLoginAuthicationEnabled);
        //     setPreLoginAuthicationCode(response.data.preLoginCode)
        // }
    };

    useEffect(() => {
        getPreLoginAuthenticationCode()
    }, []);

    return (
        <div>
            {isLoading && <Loader />}
            <Navbar pageTitle="PreLoginAuthentication" />
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-sm-12 PreLoginAuthentication-custom-margin">
                        <h1>Pre-Login Authentication</h1>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <div className="PreLoginAuthentication-container">
                            <ValidatorForm onSubmit={(e) => savePreLoginAuthenticationHandler(e)}>
                                <Row>
                                    <Col md={6}>
                                        <p className="PreLoginAuthentication-common-p-tags">Enable Pre-Login authentication</p>
                                        <div className="PreLoginAuthentication-selected-users-toggle">
                                            <label className="PreLoginAuthentication-toggle-switch">
                                                <input
                                                    checked={isPreLoginAuthicationEnabled}
                                                    id="toggleSlots"
                                                    type="checkbox"
                                                    onChange={(e) => handleToggle(e)}
                                                />
                                                <span className="PreLoginAuthentication-toggle-slider round"></span>
                                            </label>
                                        </div>
                                    </Col>
                                    {isPreLoginAuthicationEnabled === true &&
                                        <Col md={6}>
                                            <p className="PreLoginAuthentication-common-p-tags">Pre-Login Code</p>
                                            <TextValidator
                                                id="standard-basic"
                                                type="text"
                                                name="preLoginCode"
                                                onChange={(e) => handleInputChange(e)}
                                                value={preLoginAuthicationCode}
                                                // validators={['required', 'matchRegexp:^[0-9]*.[0-9]{1}$']}
                                                // errorMessages={[
                                                //     'This field is required',
                                                //     'Please enter a valid code',
                                                // ]}
                                                variant="filled"
                                            />
                                        </Col>
                                    }
                                </Row>
                                <br />
                                <div className="PreLoginAuthentication-mgmt__button-wrapper">
                                    <button
                                        className="btn btn-primary PreLoginAuthentication-save-dets-btn"
                                        type="submit"
                                    >
                                        Save Details
                                    </button>
                                </div>
                            </ValidatorForm>
                        </div>
                    </div>
                    <div className="col-md-2"></div>
                </div>
            </div>
        </div>
    );
};

export default PreLoginAuthentication;
