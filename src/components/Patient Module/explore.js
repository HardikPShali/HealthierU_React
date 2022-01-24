import React, { useEffect, useState } from 'react';
import './patient.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { Container, Row, Col } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from 'react-avatar';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import { getServiceProviders } from "../../service/frontendapiservices";
import moment from "moment";

const Explore = () => {

    const [clinics, setClinics] = useState([]);
    const [pharmacy, setPharmacy] = useState([]);
    const [organics, setOrganics] = useState([]);

    useEffect(() => {
        getClinicList();
    }, []);

    const getClinicList = async () => {
        const res = await getServiceProviders(2);
        if (res.status === 200 && res?.data) {
            console.log("response of service provider", res.data)
            setClinics(res.data);
        }
    }

    const [selectedLocation, setSelectedLocation] = useState();
    const [displayDetails, setDisplayDetails] = useState(false);

    const handleCardClick = (data) => {
        setSelectedLocation(data);
        setDisplayDetails(true);
    }

    const handleBackClick = () => {
        setSelectedLocation({});
        setDisplayDetails(false);
    }

    return (
        <div>
            <Container>
                <Row className="mt-2">
                    <Col md={12}>
                        {!displayDetails && (
                            <Tabs style={{ margin: '10px' }}>
                                <TabList style={{ boxShadow: 'rgb(0 0 0 / 24%) 0px 0px 5px' }}>
                                    <Tab>CLINICS</Tab>
                                    <Tab>PHARMACY</Tab>
                                    <Tab>ORGANICS</Tab>
                                </TabList>
                                <TabPanel style={{ minHeight: "500px" }}>
                                    <Grid container spacing={2}>
                                        {clinics.length > 0 && clinics.map(item => (
                                            <Grid item xs={12} md={6} sm={6}>
                                                <Card
                                                    variant="outlined"
                                                    className="mb-2"
                                                    style={{ borderRadius: "16px", cursor: "pointer" }}
                                                    onClick={() => handleCardClick(item)}
                                                >
                                                    <CardContent className="p-0">
                                                        <Row>
                                                            <Col xs={4} className="p-0 location">
                                                                <Avatar name={item.title} size="100%" />
                                                            </Col>
                                                            <Col xs={8} className={`py-3 location-details`}>
                                                                <p>{item.title}</p>
                                                                <p>{item.description}</p>
                                                                <br />
                                                                <p>Opening Hours: {
                                                                    moment(item.openingHours[0].openTime).format("hh:mm A")
                                                                    + " - " +
                                                                    moment(item.openingHours[0].closeTime).format("hh:mm A")
                                                                }
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </TabPanel>
                                <TabPanel style={{ minHeight: "500px" }}>
                                    <Grid container spacing={2}>
                                        {pharmacy.length > 0 && pharmacy.map(item => (
                                            <Grid item xs={12} md={6} sm={6}>
                                                <Card
                                                    variant="outlined"
                                                    className="mb-2"
                                                    style={{ borderRadius: "16px", cursor: "pointer" }}
                                                    onClick={() => handleCardClick(item)}
                                                >
                                                    <CardContent className="p-0">
                                                        <Row>
                                                            <Col xs={4} className="p-0 location">
                                                                <Avatar name={item.title} size="100%" />
                                                            </Col>
                                                            <Col xs={8} className={`py-3 location-details`}>
                                                                <p>{item.title}</p>
                                                                <p>{item.description}</p>
                                                                <br />
                                                                <p>Opening Hours: {
                                                                    moment(item.openingHours[0].openTime).format("hh:mm A")
                                                                    + " - " +
                                                                    moment(item.openingHours[0].closeTime).format("hh:mm A")
                                                                }
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </TabPanel>
                                <TabPanel style={{ minHeight: "500px" }}>
                                    <Grid container spacing={2}>
                                        {organics.length > 0 && organics.map(item => (
                                            <Grid item xs={12} md={6} sm={6}>
                                                <Card
                                                    variant="outlined"
                                                    className="mb-2"
                                                    style={{ borderRadius: "16px", cursor: "pointer" }}
                                                    onClick={() => handleCardClick(item)}
                                                >
                                                    <CardContent className="p-0">
                                                        <Row>
                                                            <Col xs={4} className="p-0 location">
                                                                <Avatar name={item.title} size="100%" />
                                                            </Col>
                                                            <Col xs={8} className={`py-3 location-details`}>
                                                                <p>{item.title}</p>
                                                                <p>{item.description}</p>
                                                                <br />
                                                                <p>Opening Hours: {
                                                                    moment(item.openingHours[0].openTime).format("hh:mm A")
                                                                    + " - " +
                                                                    moment(item.openingHours[0].closeTime).format("hh:mm A")
                                                                }
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </TabPanel>
                            </Tabs>
                        )}
                        {displayDetails && (
                            <div>
                                <Container>
                                    <Row>
                                        <Col md={2}></Col>
                                        <Col md={8} className="fulldetails p-5">
                                            <IconButton className="mb-2" onClick={() => handleBackClick()}>
                                                <ArrowBackIcon />
                                            </IconButton>
                                            <div
                                                className="mb-4"
                                                style={{
                                                    backgroundColor: "#eee",
                                                    width: "100%", height: "250px",
                                                    borderRadius: "10px"
                                                }}
                                            >
                                                {/* <img src="" /> */}
                                            </div>
                                            <h5>{selectedLocation?.title}</h5>
                                            <b>Address</b>
                                            <p>{selectedLocation?.description}</p>
                                            <hr />
                                            <b className="mb-2">Contact</b>
                                            <Row>
                                                <Col md={4}>
                                                    <p>Mobile</p>
                                                </Col>
                                                <Col md={4}>
                                                    <p>: {selectedLocation?.contacts[0].number}</p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <p>Email</p>
                                                </Col>
                                                <Col md={4}>
                                                    <p>: {selectedLocation?.contacts[0].email}</p>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <b className="mb-2">Hours</b>
                                            {selectedLocation?.openingHours.length > 0 && selectedLocation?.openingHours.map((hour, index) => (
                                                <Row>
                                                    <Col md={4}>
                                                        <p>{hour.day}</p>
                                                    </Col>
                                                    <Col md={4}>
                                                        <p>: {
                                                            moment(hour.openTime).format("hh:mm A")
                                                            + " - " +
                                                            moment(hour.closeTime).format("hh:mm A")
                                                        }</p>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </Col>
                                        <Col md={2}></Col>
                                    </Row>
                                </Container>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Explore;