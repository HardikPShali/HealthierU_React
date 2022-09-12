import React, { useState, useEffect } from 'react';
// import Footer from './Footer';
import './patient.css';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from '../Loader/Loader';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from 'react-router-dom';
// import fitness from '../../images/workout/workout.jpg';
// import Timer from '../../images/workout/timerIcon.svg';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
// import axios from 'axios';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FavoriteIcon from '@material-ui/icons/Favorite';
import freeMembership from '../../images/workout/free.jpg';
import aed1500Membership from '../../images/workout/aed1500.jpg';
import aed5000Membership from '../../images/workout/aed5000.jpg';
import aed10000Membership from '../../images/workout/aed10000.jpg';
import { getWorkoutVideos, createLikedWorkout, removeLikedWorkout, getLikedWorkoutVideos } from '../../service/workoutservice';
import YouTube from 'react-youtube';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Cookies from 'universal-cookie';
import TransparentLoader from '../Loader/transparentloader';
// import LocalStorageService from '../../util/LocalStorageService';
import {
    getLoggedInUserDataByUserId
} from '../../service/frontendapiservices';

const Workout = () => {

    const cookies = new Cookies();
    const [loading, setLoading] = useState(true);
    const [transparentLoading, setTransparentLoading] = useState(false);
    const [workout, setWorkout] = useState();
    const [likedWorkout, setLikedWorkout] = useState();
    const [workoutCategory, setWorkoutCategory] = useState();
    const [videoUrl, setVideoUrl] = useState();
    const [likedVideoUrl, setLikedVideoUrl] = useState();
    const [currentPatient, setCurrentPatient] = useState({});
    //console.log("videoURL", videoUrl);
    const [membership, setMembership] = useState({
        free: true,
        aed1500: false,
        aed5000: false,
        aed10000: false
    });

    const { free, aed1500, aed5000, aed10000 } = membership;

    useEffect(() => {
        getCurrentPatient();
    }, []);

    const opts = {
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    const currentLoggedInUser = cookies.get("currentUser");
    const loggedInUserId = currentLoggedInUser && currentLoggedInUser.id;
    const getCurrentPatient = async () => {
        const res = await getLoggedInUserDataByUserId(loggedInUserId);
        if (res && res.data) {
            res.data.map((value, index) => {
                if (value.userId === loggedInUserId) {
                    const currentPatientId = value.id;
                    setCurrentPatient({ ...currentPatient, id: currentPatientId });
                    loadProducts(currentPatientId);
                }
                return getCurrentPatient;
            })
        }
        
    }

    const loadProducts = async (patientId) => {
        const result = await getWorkoutVideos(patientId).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (result) {
            setWorkout(result.workoutsList);
            setTimeout(() => setLoading(false), 1000);

            // const videoKey = qs.parse(result[0].video_link, { ignoreQueryPrefix: true }).v;
            // //console.log("url.searchParams.get(v) :::", result.workoutsList[0].video_link)
            var url = new URL(result.workoutsList[0].video_link);
            var videoKey = url.searchParams.get("v");
            setVideoUrl(videoKey);
            setWorkoutCategory(result.workoutsList[0].workoutCategory.name);
            setTransparentLoading(false);
        }
    };

    const loadLikedWorkout = async () => {
        setTransparentLoading(true);
        setWorkoutCategory('');
        const response = await getLikedWorkoutVideos(currentPatient.id).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setTransparentLoading(false);
            }
        });
        if (response) {
            setLikedWorkout(response);
            if (response[0].length > 0) {
                var url = new URL(response[0].video_link);
                var videoKey = url.searchParams.get("v");
                setLikedVideoUrl(videoKey);
                setWorkoutCategory(response[0].workoutCategory.name);
            }
            setTransparentLoading(false);
        }
    }

    const createLike = async (workoutId) => {
        setTransparentLoading(true);
        const likedData = {
            patientId: currentPatient.id,
            workoutId: workoutId
        }

        const response = await createLikedWorkout(likedData).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setTransparentLoading(false);
            }
        });
        if (response) {
            loadProducts(currentPatient.id);
        }
    }

    const createUnlike = async (likeId) => {
        setTransparentLoading(true);
        const response = await removeLikedWorkout(likeId).catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setTransparentLoading(false);
            }
        });
        if (response) {
            loadProducts(currentPatient.id);
        }
    }

    const handleVideoClick = (data) => {
        var url = new URL(data.video_link);
        var videoKey = url.searchParams.get("v");
        setLikedVideoUrl(videoKey);
        setWorkoutCategory(data.workoutCategory.name);
    }

    const onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    const getVideoKey = (link) => {
        let newUrl;
        try {
            newUrl = new URL(link);
        } catch (_) {
            return false;
        }
        var videoKey = newUrl.searchParams.get("v");
        return videoKey
    }

    return (
        <div>
            {loading && (
                <Loader />
            )}
            {transparentLoading && (
                <TransparentLoader />
            )}
            <Container>
                <br />
                <Row>
                    <Col md={3} className="mb-2">
                        <Link to="/patient/nutrition"><div id="Box1" className="nutrition-card-box">Nutrition Plan</div></Link>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Link to="/patient/workout"><div id="Box2" className="nutrition-card-box">Workout</div></Link>
                    </Col>
                    {/*<Col md={2} className="mb-2">
                        <div id="Box3" className="nutrition-card-box">Lifestyle</div>
                    </Col>*/}
                    <Col md={3} className="mb-2">
                        <Link to="/patient/shop"><div id="Box4" className="nutrition-card-box">Shop</div></Link>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Link to="/patient/article"><div id="Box5" className="nutrition-card-box">Articles</div></Link>
                    </Col>
                    {/*<Col md={2} className="mb-2">
                        <div id="Box6" className="nutrition-card-box">Education</div>
                    </Col>*/}
                </Row>
                <br />
                <Row>
                    <Col md={12}>
                        <Tabs>
                            <TabList>
                                <Tab>DASHBOARD</Tab>
                                <Tab onClick={() => loadLikedWorkout()}>MY WORKOUTS</Tab>
                                <Tab>MEMBERSHIP</Tab>
                            </TabList>

                            <TabPanel>
                                <div id="dashboard">
                                    <Row>
                                        <Col md={8}>
                                            {/* <iframe src={`https://www.youtube.com/embed/${videoUrl}`} frameborder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowfullscreen /> */}
                                            <YouTube videoId={videoUrl} opts={opts} onReady={(e) => onReady(e)} />
                                        </Col>
                                        <Col md={4}>
                                            <div id="all-workout-list">
                                                <GridList cellHeight={220}>
                                                    {workout && workout.map((workoutData, index) => (

                                                        <GridListTile key={index}>
                                                            {!workoutData.liked && (
                                                                <FavoriteBorderIcon id="fav-icon" onClick={() => createLike(workoutData.id)} />
                                                            )}
                                                            {workoutData.liked && (
                                                                <FavoriteIcon id="fav-icon"
                                                                    onClick={() => createUnlike(workoutData.likeId)}
                                                                />
                                                            )}
                                                            {/* <div className="video-time"><img src={Timer} /> 5 min</div> */}
                                                            <img src={`https://img.youtube.com/vi/${getVideoKey(workoutData.video_link && workoutData.video_link)}/0.jpg`} alt={workoutData.title} />
                                                            <GridListTileBar
                                                                title={<span>{workoutData.title}</span>}
                                                                subtitle={<span>{workoutData.workoutCategory.name}</span>}
                                                                onClick={() => handleVideoClick(workoutData)}
                                                            />
                                                        </GridListTile>

                                                    ))}

                                                </GridList>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id="my-workout">
                                    <Row>
                                        <Col md={8}>
                                            <div>
                                                <Row className="m-0">
                                                    <Col xs={12} className="desc-bar">
                                                        <div className="mr-auto">{workoutCategory}</div>
                                                        {/* <NotificationsIcon /> */}
                                                    </Col>
                                                </Row>
                                                <br />
                                                <YouTube videoId={likedVideoUrl} opts={opts} onReady={(e) => onReady(e)} />
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="workout-tabs">
                                                {/* <Tabs>
                                                        <TabList>
                                                            <Tab>WEIGHT LOSS</Tab>
                                                            <Tab>MUSCLE GAIN</Tab>
                                                            <Tab>FITNESS</Tab>
                                                        </TabList>
                                                    <TabPanel> */}
                                                <FormControl id="workoutCategory-select">
                                                    <Select
                                                        native
                                                        value={workoutCategory}
                                                        // onChange={handleChange}
                                                        inputProps={{
                                                            name: 'category',
                                                            id: 'workout-select',
                                                        }}
                                                    >
                                                        <option value="1">Get Lean</option>
                                                        <option value="2">Get Strong</option>
                                                        <option value="3">Loss Weight</option>
                                                        <option value="6">Exercise</option>
                                                    </Select>
                                                </FormControl>
                                                {/* <br/> */}
                                                {/* <p className="desc-text">No equipment required for this workout</p> */}
                                                <div id="my-workout-list">
                                                    {likedWorkout && likedWorkout.map((workoutData, index) => (
                                                        workoutData.workout && (
                                                            <Card variant="outlined" className="mb-2" key={index} onClick={() => handleVideoClick(workoutData.workout)}>
                                                                <CardContent>
                                                                    <Row>
                                                                        <Col xs={4} className="p-0">
                                                                            <FavoriteBorderIcon id="fav-icon" />
                                                                            <img src={`https://img.youtube.com/vi/${getVideoKey(workoutData.workout.video_link)}/0.jpg`} alt={workoutData.workout.title} style={{ width: '100%', height: '120px', cursor: 'pointer', bottom: '17px', position: 'relative' }} />
                                                                        </Col>
                                                                        <Col xs={8} className={`p-0 product-info`}>
                                                                            <Row className="m-0" style={{ height: '75px', alignItems: 'center' }}>
                                                                                <Col xs={12} className="p-0">
                                                                                    <p className="product-name">{workoutData.workout.title}</p>
                                                                                </Col>
                                                                                {/* <Col xs={6} className="product-icons">
                                                                                        <div className="my-video-time"><img src={Timer} /> 5 min</div>
                                                                                    </Col> */}
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    )
                                                    )}
                                                </div>
                                                {/* </TabPanel> */}
                                                {/* <TabPanel>
                                                        <p className="desc-text">No equipment required for this workout</p>
                                                        <div id="my-workout-list">
                                                            {workout && workout.map((workoutData, index) => (
                                                                <Card variant="outlined" className="mb-2" key={index} onClick={() => handleVideoClick(workoutData.video_link)}>
                                                                    <CardContent>
                                                                        <Row>
                                                                            <Col xs={4} className="p-0">
                                                                                <img src={aed5000Membership} alt={workoutData.title} style={{ width: '100%', height: '75px', cursor: 'pointer' }} />
                                                                            </Col>
                                                                            <Col xs={8} className={`p-0 product-info ${workoutData.title.split(' ')[0] + index}`}>
                                                                                <Row className="m-0" style={{ height: '75px', alignItems: 'center' }}>
                                                                                    <Col xs={12} className="p-0">
                                                                                        <p className="product-name">{workoutData.title}</p>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                            )}
                                                        </div>
                                                    </TabPanel>
                                                    <TabPanel>
                                                        <p className="desc-text">No equipment required for this workout</p>
                                                        <div id="my-workout-list">
                                                            {workout && workout.map((workoutData, index) => (
                                                                <Card variant="outlined" className="mb-2" key={index} onClick={() => handleVideoClick(workoutData.video_link)}>
                                                                    <CardContent>
                                                                        <Row>
                                                                            <Col xs={4} className="p-0">
                                                                                <img src={exercise} alt={workoutData.title} style={{ width: '100%', height: '75px', cursor: 'pointer' }} />
                                                                            </Col>
                                                                            <Col xs={8} className={`p-0 product-info ${workoutData.title.split(' ')[0] + index}`}>
                                                                                <Row className="m-0" style={{ height: '75px', alignItems: 'center' }}>
                                                                                    <Col xs={12} className="p-0">
                                                                                        <p className="product-name">{workoutData.title}</p>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                    </CardContent>
                                                                </Card>
                                                            )
                                                            )}
                                                        </div>
                                                    </TabPanel>
                                                </Tabs> */}
                                                {/* <br />
                                                <div className="d-flex w-100">
                                                    <button className="w-24 mr-1 btn btn-primary cal-button">432CAL</button>
                                                    <button className="w-75 btn btn-primary workout-button">DO WORKOUT</button>
                                                </div> */}
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div id="membership">
                                    <Row>
                                        <Col md={5}>
                                            <div id="membership-list">
                                                <GridList cellHeight={220}>
                                                    <GridListTile>
                                                        <img src={freeMembership} alt="membership" />
                                                        <GridListTileBar
                                                            title={<><p className="m-0" style={{ lineHeight: '20px' }}>Free</p>
                                                                <p className="m-0" style={{ lineHeight: '23px' }}>Membership</p></>}
                                                            subtitle={<span></span>}
                                                            onClick={() => setMembership({ ...membership, free: true, aed1500: false, aed5000: false, aed10000: false })}
                                                        />
                                                    </GridListTile>
                                                    <GridListTile>
                                                        <img src={aed1500Membership} alt="membership" />
                                                        <GridListTileBar
                                                            title={<span><b>AED 1500</b></span>}
                                                            subtitle={<><span>1 month</span><br />
                                                                <span>Membership</span></>}
                                                            onClick={() => setMembership({ ...membership, free: false, aed1500: true, aed5000: false, aed10000: false })}
                                                        />
                                                    </GridListTile>
                                                    <GridListTile>
                                                        <img src={aed5000Membership} alt="membership" />
                                                        <GridListTileBar
                                                            title={<span><b>AED 5000</b></span>}
                                                            subtitle={<><span>3 month</span><br />
                                                                <span>Membership</span></>}
                                                            onClick={() => setMembership({ ...membership, free: false, aed1500: false, aed5000: true, aed10000: false })}
                                                        />
                                                    </GridListTile>
                                                    <GridListTile>
                                                        <img src={aed10000Membership} alt="membership" />
                                                        <GridListTileBar
                                                            title={<span><b>AED 10000</b></span>}
                                                            subtitle={<><span>6 month</span><br />
                                                                <span>Membership</span></>}
                                                            onClick={() => setMembership({ ...membership, free: false, aed1500: false, aed5000: false, aed10000: true })}
                                                        />
                                                    </GridListTile>
                                                </GridList>
                                            </div>
                                        </Col>
                                        <Col md={7}>
                                            <div id="membership-card">
                                                <GridList cellHeight={220}>
                                                    {free && (
                                                        <GridListTile>
                                                            <img src={freeMembership} alt="Free Membership" />
                                                            <GridListTileBar
                                                                title={<span>Free Membership</span>}
                                                                subtitle={<ul>
                                                                    <li>BELLY BURN</li>
                                                                    <li>WEIGHT LOSS</li>
                                                                    <li>YOGA</li>
                                                                    <li>GET LEAN </li>
                                                                </ul>}
                                                            // onClick={() => handleVideoClick(workoutData.video_link)}
                                                            />
                                                        </GridListTile>
                                                    )}
                                                    {aed1500 && (
                                                        <GridListTile>
                                                            <img src={aed1500Membership} alt="AED 1500" />
                                                            <GridListTileBar
                                                                title={<span>AED 1500</span>}
                                                                subtitle={<ul>
                                                                    <li>8 SESSIONS</li>
                                                                    <li>VALID FOR 3 MONTHS</li>
                                                                </ul>}
                                                            // onClick={() => handleVideoClick(workoutData.video_link)}
                                                            />
                                                        </GridListTile>
                                                    )}
                                                    {aed5000 && (
                                                        <GridListTile>
                                                            <img src={aed5000Membership} alt="AED 5000" />
                                                            <GridListTileBar
                                                                title={<span>AED 5000</span>}
                                                                subtitle={<ul>
                                                                    <li>24 SESSIONS</li>
                                                                    <li>1 FREE CONSULTATION WITH NUTRITIONIST</li>
                                                                    <li>VALID FOR 3 MONTHS</li>
                                                                </ul>}
                                                            // onClick={() => handleVideoClick(workoutData.video_link)}
                                                            />
                                                        </GridListTile>
                                                    )}
                                                    {aed10000 && (
                                                        <GridListTile>
                                                            <img src={aed10000Membership} alt="AED 10000" />
                                                            <GridListTileBar
                                                                title={<span>AED 10000</span>}
                                                                subtitle={<ul>
                                                                    <li>48 SESSIONS</li>
                                                                    <li>1 FREE SESSION</li>
                                                                    <li>1 FREE CONSULTATION</li>
                                                                    <li>VALID FOR 6 MONTHS</li>
                                                                </ul>}
                                                            // onClick={() => handleVideoClick(workoutData.video_link)}
                                                            />
                                                        </GridListTile>
                                                    )}
                                                </GridList>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </TabPanel>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
            {/* <Footer /> */}
        </div>
    )
}
export default Workout;