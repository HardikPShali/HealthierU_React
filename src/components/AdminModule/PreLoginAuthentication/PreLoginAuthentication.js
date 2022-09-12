import React, { useState, useeffect, useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Navbar from '../layout/Navbar';
import { Row, Col } from 'react-bootstrap';
import { getPreLoginAccessCode, editPreLoginAccessCode, addPreLoginAccessCode } from '../../../service/frontendapiservices';
import Loader from '../../Loader/Loader';
import "./PreLoginAuthetication.css";
import { toast } from 'react-toastify';
const PreLoginAuthentication = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isToggle, setToggle] = useState(true);
    const [isPreLoginAuthicationEnabled, setIsPreLoginAuthicationEnabled] = useState(false)
    const [preLoginAuthicationCode, setPreLoginAuthicationCode] = useState('')
    const [preLoginAuthicationCodeID, setPreLoginAuthicationCodeID] = useState(0)
    const handleInputChange = (e) => {
        setPreLoginAuthicationCode(e.target.value);
    };
    const getPreLoginAuthenticationCode = async () => {
        setIsLoading(true);
        const response = await getPreLoginAccessCode().catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
        if (response.data.status === true) {
            setIsLoading(false);
            setPreLoginAuthicationCodeID(response.data.data.id)
            setIsPreLoginAuthicationEnabled(response.data.data.isPreLoginAuthenticationEnabled);
            setPreLoginAuthicationCode(response.data.data.preLoginCode)
        }
        setIsLoading(false);
    };

    //Toggle
    const handleToggle = async (e) => {
        setToggle(e.target.checked)
        const data = {
            id: preLoginAuthicationCodeID,
            preLoginCode: preLoginAuthicationCode,
            isPreLoginAuthenticationEnabled: e.target.checked,
        };
        const res = await editPreLoginAccessCode(data);
        if (res) {
            setPreLoginAuthicationCodeID(res.data.data.id)
            setIsPreLoginAuthicationEnabled(res.data.data.isPreLoginAuthenticationEnabled);
            setPreLoginAuthicationCode(res.data.data.preLoginCode)
        }
    };
    const savePreLoginAuthenticationHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = {
            id: preLoginAuthicationCodeID,
            preLoginCode: preLoginAuthicationCode,
            isPreLoginAuthenticationEnabled: isToggle,
        };
        const res = await editPreLoginAccessCode(data);
        if (res) {
            setIsLoading(false);
            setPreLoginAuthicationCodeID(res.data.data.id)
            setIsPreLoginAuthicationEnabled(res.data.data.isPreLoginAuthenticationEnabled);
            setPreLoginAuthicationCode(res.data.data.preLoginCode)
        }
        if (!preLoginAuthicationCode) {
            const data = {
                preLoginCode: preLoginAuthicationCode,
                isPreLoginAuthenticationEnabled: isToggle
            }
            const response = await addPreLoginAccessCode(data).catch((err) => {
                console.log(err);
            });
            if (response) {
                setIsLoading(false);
                setPreLoginAuthicationCodeID(response.data.data.id)
                setIsPreLoginAuthicationEnabled(response.data.data.isPreLoginAuthenticationEnabled);
                setPreLoginAuthicationCode(response.data.data.preLoginCode)
            }
        }
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
                                    {/* {isPreLoginAuthicationEnabled === true && */}
                                    <Col md={6}>
                                        <p className="PreLoginAuthentication-common-p-tags">Pre-Login Code</p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="preLoginCode"
                                            onChange={(e) => handleInputChange(e)}
                                            value={preLoginAuthicationCode}
                                            validators={['required',
                                                // 'matchRegexp:^[0-9]*.[0-9]{1}$'
                                            ]}
                                            errorMessages={[
                                                'This field is required',
                                                //     'Please enter a valid code',
                                            ]}
                                            variant="filled"
                                        />
                                    </Col>
                                    {/* } */}
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
