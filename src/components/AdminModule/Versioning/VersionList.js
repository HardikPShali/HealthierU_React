import React, { useState, useeffect, useEffect } from 'react';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Navbar from '../layout/Navbar';
import { Row, Col } from 'react-bootstrap';
import './VersionList.css';
import { getLatestVersions, saveLatestVersions } from '../../../service/frontendapiservices';
import Loader from '../../Loader/Loader';

const VersionList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [version, setVersion] = useState({
        minimumIosVersion: '',
        stableIosVersion: '',
        minimumAndroidVersion: '',
        stableAndroidVersion: '',
    });

    const { minimumIosVersion, stableIosVersion, minimumAndroidVersion, stableAndroidVersion } = version;

    const handleInputChange = (e) => {
        setVersion({ ...version, [e.target.name]: e.target.value });
    };

    const getLatestVersionsFromApi = async () => {
        setIsLoading(true);
        const response = await getLatestVersions().catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
        // console.log({ response });
        if (response.data.status === true) {
            setIsLoading(false);
            setVersion({
                minimumIosVersion: response.data.data.minimumIosVersion,
                stableIosVersion: response.data.data.stableIosVersion,
                minimumAndroidVersion: response.data.data.minimumAndroidVersion,
                stableAndroidVersion: response.data.data.stableAndroidVersion,
            });
        }
        setIsLoading(false);
    };

    const saveVersionHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log({ version });
        const response = await saveLatestVersions(version).catch((err) => {
            console.log(err);
        });
        console.log({ response });
        if (response.data.status === true) {
            setIsLoading(false);
            setVersion({
                minimumIosVersion: response.data.data.minimumIosVersion,
                stableIosVersion: response.data.data.stableIosVersion,
                minimumAndroidVersion: response.data.data.minimumAndroidVersion,
                stableAndroidVersion: response.data.data.stableAndroidVersion,
            });
        }
    };

    useEffect(() => {
        getLatestVersionsFromApi();
    }, []);

    return (
        <div>
            {isLoading && <Loader />}
            <Navbar pageTitle="versioning" />
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-sm-12 custom-margin">
                        <h1>Version Management</h1>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <div className="version-container">
                            <ValidatorForm onSubmit={(e) => saveVersionHandler(e)}>
                                <Row>
                                    <Col md={12}>
                                        <p className="common-p-tags">Minimum iOS version</p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="minimumIosVersion"
                                            onChange={(e) => handleInputChange(e)}
                                            value={minimumIosVersion}
                                            validators={['required', 'matchRegexp:^[0-9]*.[0-9]{1}$']}
                                            errorMessages={[
                                                'This field is required',
                                                'Please enter a valid version',
                                            ]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col md={12}>
                                        <p className="common-p-tags">Stable iOS version</p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="stableIosVersion"
                                            onChange={(e) => handleInputChange(e)}
                                            value={stableIosVersion}
                                            validators={['required', 'matchRegexp:^[0-9]*.[0-9]{1}$']}
                                            errorMessages={[
                                                'This field is required',
                                                'Please enter a valid version',
                                            ]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />

                                <Row>
                                    <Col md={12}>
                                        <p className="common-p-tags">Minimum Android version</p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="minimumAndroidVersion"
                                            onChange={(e) => handleInputChange(e)}
                                            value={minimumAndroidVersion}
                                            validators={['required', 'matchRegexp:^[0-9]*.[0-9]{1}$']}
                                            errorMessages={[
                                                'This field is required',
                                                'Please enter a valid version',
                                            ]}
                                            variant="filled"
                                        />
                                    </Col>
                                </Row>
                                <br />

                                <Row>
                                    <Col md={12}>
                                        <p className="common-p-tags">Stable Android version</p>
                                        <TextValidator
                                            id="standard-basic"
                                            type="text"
                                            name="stableAndroidVersion"
                                            onChange={(e) => handleInputChange(e)}
                                            value={stableAndroidVersion}
                                            validators={['required', 'matchRegexp:^[0-9]*.[0-9]{1}$']}
                                            errorMessages={[
                                                'This field is required',
                                                'Please enter a valid version',
                                            ]}
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
                    <div className="col-md-2"></div>
                </div>
            </div>
        </div>
    );
};

export default VersionList;
