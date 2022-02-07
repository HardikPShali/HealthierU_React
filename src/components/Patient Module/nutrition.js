import React, { useState, useEffect } from 'react';
// import Footer from './Footer';
import './patient.css';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from '../Loader/Loader';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Calendar from 'short-react-calendar';
//import moment from 'moment';
import { PieChart } from 'react-minimal-pie-chart';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
//import { checkAccessToken } from '../../service/RefreshTokenService';
// import LocalStorageService from './../../util/LocalStorageService';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Avatar from 'react-avatar';
import MealData from './nutrition-meal-plan-data.json';
import {
    getNutritionDoctorList
} from '../../service/frontendapiservices';

import { doctorListLimit } from '../../util/configurations';

const Nutrition = () => {

    const [loading, setLoading] = useState(true);
    // const [serverError, setServerError] = useState(false);
    const [kcal, setKcal] = useState(1100);
    const [mealPlan, setMealPlan] = useState();

    const [bmiInfo, setBmiInfo] = useState({
        type: 'metric',
        age: '',
        height: '',
        weight: '',
        gender: '',
        result: '',
        message: '',
        error: ''
    });

    const { type, age, height, weight, gender, result, message, error } = bmiInfo;

    //console.log(bmiInfo);

    const [expanded, setExpanded] = useState('panel1');

    const [doctorList, setDoctorList] = useState([]);

    // console.log("doctorList: ", doctorList)

    const handleInputChange = (e) => {
        setBmiInfo({ ...bmiInfo, [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value });
    }

    // BMI Calculator Start

    const bmiCalculate = () => {
        if (!age || !height || !weight || !gender) {
            setBmiInfo({ ...bmiInfo, result: '', message: '', error: 'Please fill all fields.' });
            setKcal(1100);
        }
        else {
            if (age <= 18) {
                const BMI = parseFloat(weight / Math.pow(height, 2) * 10000);
                const mass = weight * 2.205;
                const heightInches = height / 2.54;
                const massResult = Math.round(mass);
                const heightResult = Math.round(heightInches);
                const kcalValue = parseInt(665 + (4.35 * massResult) + (4.7 * heightResult) - (4.7 * age));
                const kcalResult = Math.round(kcalValue);
                const bmiResult = BMI.toFixed(1);
                let message = "";
                if (bmiResult >= 14 && bmiResult <= 18.9) {
                    message = "Healthy weight";
                }
                else if (bmiResult >= 19 && bmiResult <= 22.9) {
                    message = "Overweight";
                }
                else if (bmiResult >= 23) {
                    message = "Obese";
                }
                else if (bmiResult < 13.9) {
                    message = "Underweight";
                }
                setBmiInfo({ ...bmiInfo, result: bmiResult, message: message, error: '' });
                setKcal(kcalResult);
                loadMealPlans(kcalResult);

            }
            else if (age > 18) {
                const BMI = parseFloat(weight / Math.pow(height, 2) * 10000);
                const mass = weight * 2.205;
                const heightInches = height / 2.54;
                const massResult = Math.round(mass);
                const heightResult = Math.round(heightInches);
                const kcalValue = parseInt(665 + (4.35 * massResult) + (4.7 * heightResult) - (4.7 * age));
                const kcalResult = Math.round(kcalValue);
                const bmiResult = BMI.toFixed(1);
                let message = "";
                if (BMI.toFixed(1) >= 18.5 && BMI.toFixed(1) <= 24.99) {
                    message = "Normal";
                }
                else if (BMI.toFixed(1) >= 25 && BMI.toFixed(1) <= 29.9) {
                    message = "Overweight";
                }
                else if (BMI.toFixed(1) >= 30) {
                    message = "Obese";
                }
                else if (BMI.toFixed(1) < 18.5) {
                    message = "Underweight";
                }

                setBmiInfo({ ...bmiInfo, result: bmiResult, message: message, error: '' });
                setKcal(kcalResult);
                loadMealPlans(kcalResult);
            }
        }
    }

    // BMI Calculator End

    const [offset, setOffset] = useState(0);

    const loadDoctors = async () => {
        const res = await getNutritionDoctorList("", offset, doctorListLimit).catch(error => {
            if (error.response && (error.response.status === 502 || error.response.status === 500)) {
                //setServerError(true);
                // setTimeout(() => window.location.assign("/patient"), 5000);
                setLoading(false);
            }
        })
        if (res && res.data) {
            setTimeout(() => setLoading(false), 1000);
            setOffset(offset + 1);
            setDoctorList(res.data.doctors);
        }
        //}

    };

    useEffect(() => {
        loadDoctors();
        loadMealPlans(kcal);
    }, [kcal]);

    const loadMore = async () => {
        const result = await getNutritionDoctorList("", offset, doctorListLimit);
        if (result && result.data) {
            //var existingUsersList = [];
            var existingUsersList = doctorList;
            result.data && result.data.doctors.length > 0 && result.data.doctors.map(newData => {
                return (existingUsersList.push(newData));
            })
            setOffset(offset + 1);
            setDoctorList(existingUsersList);
        }
        //})

    }
    const loadMealPlans = async (calories) => {
        let cal = '';
        if (calories > 500 && calories < 1150) {
            cal = 1100;
        }
        else if (calories > 1150 && calories < 1250) {
            cal = 1200;
        }
        else if (calories > 1250 && calories < 1350) {
            cal = 1300;
        }
        else if (calories > 1350 && calories < 1450) {
            cal = 1400;
        }
        else if (calories > 1450 && calories < 1550) {
            cal = 1500;
        }
        else if (calories > 1550 && calories < 1650) {
            cal = 1600;
        }
        else if (calories > 1650 && calories < 1750) {
            cal = 1700;
        }
        else if (calories > 1750 && calories < 1850) {
            cal = 1800;
        }
        else if (calories > 1850 && calories < 1950) {
            cal = 1900;
        }
        else if (calories > 1950 && calories < 2050) {
            cal = 2000;
        }
        else if (calories > 2050 && calories < 2150) {
            cal = 2100;
        }
        else if (calories > 2150 && calories < 2250) {
            cal = 2200;
        }
        else if (calories > 2250 && calories < 2350) {
            cal = 2300;
        }
        else if (calories > 2350 && calories < 2450) {
            cal = 2400;
        }
        else if (calories > 2450 && calories < 2550) {
            cal = 2500;
        }
        // const result = await axios.get("http://localhost:3012/nutrition?KCAL="+cal);
        if (MealData && MealData.nutrition) {
            MealData.nutrition.map(meal => {
                return (meal.KCAL === cal && (
                    setMealPlan(meal)
                ))
            })
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            {loading && (
                <Loader />
            )}
            {/*serverError && (
                <>
                    <center>
                        <h2>Something went wrong. Try again after some time!</h2>
                        <p>You will be redirected to HomePage in 5 sec.</p>
                    </center>
                </>
            )}
            {!serverError && (
            <>*/}
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
                        <Link to="/patient/shop"><div id="Box5" className="nutrition-card-box">Articles</div></Link>
                    </Col>
                    {/*<Col md={2} className="mb-2">
                                <div id="Box6" className="nutrition-card-box">Education</div>
                            </Col>*/}
                </Row>


                <Row>
                    <Col md={3}>
                        <div id="nutrition-col">
                            <h4 className="mb-3">BMI Calculator</h4>

                            <div className="bmi-cal-box">
                                <form>
                                    <select className="mb-3" name="type" value={type} onChange={(e) => handleInputChange(e)}>
                                        <option value="metric">Metric Units</option>
                                    </select>

                                    <div id="bmi-age" className="mb-3">
                                        <Row className="m-0">
                                            <Col xs={4} className="p-0">Age</Col>
                                            <Col xs={4} className="pl-0 pr-1">
                                                <input type="number" min="0" value={age} name="age" onChange={(e) => handleInputChange(e)} className="pl-2 pr-2" />
                                            </Col>
                                            <Col xs={4} className="p-0"><small>Ages: 2 - 120</small></Col>
                                        </Row>
                                    </div>

                                    <div id="bmi-gender" className="mb-2">
                                        <Row className="m-0">
                                            <Col xs={4} className="p-0">Gender</Col>
                                            <Col xs={8} className="pl-0 pr-1 align-items-center d-flex" style={{ fontSize: 12 }}>
                                                {/* <input type="radio" className="pl-2 pr-2 mr-1" /> Male 
                                                <input type="radio" className="pl-2 pr-2 mr-1 ml-3" /> Female */}
                                                <FormControl component="fieldset">
                                                    {/* <FormLabel component="legend" className="left">Gender</FormLabel> */}
                                                    <RadioGroup id="gender-radio" aria-label="gender" name="gender"
                                                        variant="filled" value={gender} onChange={(e) => handleInputChange(e)} >
                                                        <FormControlLabel value="female" control={<Radio color="primary" />} label="Female" />
                                                        <FormControlLabel value="male" control={<Radio color="primary" />} label="Male" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div id="bmi-mass" className="mb-3">
                                        <Row className="m-0">
                                            <Col xs={4} className="p-0">Height</Col>
                                            <Col xs={8} className="pl-0 pr-1">
                                                <input type="number" min="0" value={height} name="height" onChange={(e) => handleInputChange(e)} className="pl-2 pr-2" />
                                            </Col>
                                        </Row>
                                    </div>

                                    <div id="bmi-mass" className="my-2">
                                        <Row className="m-0">
                                            <Col xs={4} className="p-0">Weight</Col>
                                            <Col xs={8} className="pl-0 pr-1">
                                                <input type="number" min="0" value={weight} name="weight" onChange={(e) => handleInputChange(e)} className="pl-2 pr-2" />
                                            </Col>
                                        </Row>
                                    </div>
                                </form>
                            </div>
                            <button className="btn btn-primary bmi-cal" onClick={() => bmiCalculate()}>Calculate</button>
                            <br />
                            <br />
                            {result && (
                                <>
                                    <Row>
                                        <Col xs={4}><b>BMI: </b></Col>
                                        <Col xs={8}>{result}  <b>kg/m<sup>2</sup></b></Col>
                                    </Row>
                                    <Row>
                                        <Col xs={4}><b>Status: </b></Col>
                                        <Col xs={8}>{message}</Col>
                                    </Row>
                                </>
                            )}
                            {error && (
                                <>
                                    <b className="text-danger">{error}</b>
                                </>
                            )}
                        </div>
                    </Col>

                    <Col md={4}>
                        <div id="nutrition-col">
                            <h4>Meal Plan</h4>

                            {/* <Calendar
                                value={new Date()}
                                calendarType="US"
                                oneWeekCalendar={true}
                                formatShortWeekday={(locale, date) => moment(date).format('dd')}
                            /> */}

                            <div className="calories-info">Calories: {kcal} kcal/day</div>
                            <div className="nutrition-info my-2">
                                <div className="info-title">Nutrition Information</div>
                                <Row className="m-0 nutrition-info-row">
                                    <Col xs={6} style={{ borderRight: '2px solid #fff' }}>
                                        <span>CALORIES</span><b className="nut-value">{kcal}</b>
                                    </Col>
                                    <Col xs={6}>
                                        <span>POINTS</span><b className="nut-value">14</b>
                                    </Col>
                                </Row>
                            </div>
                            <PieChart
                                data={[
                                    { title: '13% Protein', value: 13, color: '#FF6563' },
                                    { title: '40% Carbs', value: 40, color: '#F6CEB4' },
                                    { title: '47% Fat', value: 47, color: '#00d0cc' },
                                ]}
                                startAngle={-360}
                                lengthAngle={360}
                                lineWidth={50}
                                className="nutrition-chart"
                                animate={true}
                                animationDuration={1500}
                            />
                            <div className="chart-info">
                                <span className="dot1 mr-1"></span> 13% Protein
                                <span className="dot2 ml-3 mr-1"></span> 40% Carbs
                                <span className="dot3 ml-3 mr-1"></span> 47% Fat
                            </div>
                            <br />

                            <div className="loader-one">
                                <span className="progress" style={{ width: '41%' }}>
                                    <b className="float-left">41%</b>
                                </span>
                                <p>of a 1200 cal diet</p>
                            </div>
                            <div className="loader-two">
                                <span className="progress" style={{ width: '31%' }}>
                                    <b className="float-left">31%</b>
                                </span>
                                <p>of a 2000 cal diet</p>
                            </div>
                        </div>
                    </Col>

                    <Col md={5}>
                        <div id="nutrition-col-3">
                            <MuiAccordion square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                <MuiAccordionSummary aria-controls="panel1d-content" id="panel-header">
                                    <Typography>Nutrition Plan</Typography>
                                </MuiAccordionSummary>
                                <MuiAccordionDetails>
                                    <h4>Nutrition Plan</h4>

                                    {/* <Calendar
                                        value={new Date()}
                                        calendarType="US"
                                        oneWeekCalendar={true}
                                        formatShortWeekday={(locale, date) => moment(date).format('dd')}
                                    /> */}

                                    <div className="calories-info">Calories: {kcal} kcal/day</div><br />
                                    <div className="nutrition-list">
                                        <GridList cellHeight={220}>
                                            <GridListTile>
                                                <GridListTileBar
                                                    title={<span>BreakFast</span>}
                                                    subtitle={<ul>
                                                        {mealPlan && mealPlan.Breakfast.map(breakfast => (
                                                            <li>{breakfast.name}</li>
                                                        ))}
                                                        {/* <li>One grapefruit</li>
                                                                <li>Two poached eggs (or fried in a non-stick pan)</li>
                                                                <li>Two slices whole-grain toast with one pat of butter each</li>
                                                                <li>One cup low-fat milk</li>
                                                                <li>One cup of black coffee or herbal tea</li> */}
                                                    </ul>}
                                                />
                                            </GridListTile>
                                            <br />
                                            <br />
                                            <GridListTile>
                                                <GridListTileBar
                                                    title={<span>Morning Snacks</span>}
                                                    subtitle={<ul>
                                                        {mealPlan && mealPlan.MorningSnack.map(morningSnack => (
                                                            <li>{morningSnack.name}</li>
                                                        ))}
                                                        {/* <li>One banana</li>
                                                                <li>One cup plain yogurt with two tablespoons honey</li>
                                                                <li>Glass of water</li> */}
                                                    </ul>}
                                                />
                                            </GridListTile>
                                            <br />
                                            <br />
                                            <GridListTile>
                                                <GridListTileBar
                                                    title={<span>Lunch</span>}
                                                    subtitle={<ul>
                                                        {mealPlan && mealPlan.Lunch.map(lunch => (
                                                            <li>{lunch.name}</li>
                                                        ))}
                                                        {/* <li>Chicken breast (6-ounce portion), baked or roasted (not breaded or fried)</li>
                                                                <li>Large garden salad with tomato and onion with one cup croutons, topped with one tablespoon oil and vinegar (or salad dressing)</li>
                                                                <li>Glass of water</li> */}
                                                    </ul>}
                                                />
                                            </GridListTile>
                                            <br />
                                            <br />
                                            <GridListTile>
                                                <GridListTileBar
                                                    title={<span>Snacks</span>}
                                                    subtitle={<ul>
                                                        {mealPlan && mealPlan.EveningSnack.map(snacks => (
                                                            <li>{snacks.name}</li>
                                                        ))}
                                                        {/* <li>One cup carrot slices</li>
                                                                <li>Three tablespoons hummus</li>
                                                                <li>One-half piece of pita bread</li>
                                                                <li>One cup low-fat milk</li>
                                                                <li>Glass of water or herbal tea</li> */}
                                                    </ul>}
                                                />
                                            </GridListTile>
                                            <br />
                                            <br />
                                            <GridListTile>
                                                <GridListTileBar
                                                    title={<span>Dinner</span>}
                                                    subtitle={<ul>
                                                        {mealPlan && mealPlan.Dinner.map(dinner => (
                                                            <li>{dinner.name}</li>
                                                        ))}
                                                        {/* <li>One cup steamed broccoli</li>
                                                                <li>One cup of brown rice</li>
                                                                <li>Halibut (four-ounce portion)</li>
                                                                <li>Small garden salad with one cup spinach leaves, tomato, and onion topped with two tablespoons oil and vinegar or salad dressing</li>
                                                                <li>One glass white wine (regular or dealcoholized)</li>
                                                                <li>Sparkling water with lemon or lime slice</li> */}
                                                    </ul>}
                                                />
                                            </GridListTile>
                                        </GridList>
                                    </div>

                                </MuiAccordionDetails>
                            </MuiAccordion>
                            <MuiAccordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                <MuiAccordionSummary aria-controls="panel2d-content" id="panel-header">
                                    <Typography>Talk to an expert</Typography>
                                </MuiAccordionSummary>
                                <MuiAccordionDetails>
                                    <div id="card-list">
                                        {doctorList && doctorList.length > 0 ? (
                                            <GridList cellHeight={220}>
                                                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                                                </GridListTile>
                                                {doctorList.map((user, index) => (
                                                    //user.specialities && user.specialities.some(speciality => speciality.name === "Sports Medicine") && (
                                                    <GridListTile key={index}>
                                                        <FavoriteBorderIcon id="fav-icon" />
                                                        {user.picture ? (<img src={user.picture} alt="" />)
                                                            : (<Avatar name={user.firstName + " " + user.lastName} />)}
                                                        <Link to={{ pathname: `/patient/mydoctor`, state: "sports medicine" }}>
                                                            <GridListTileBar style={{ cursor: 'pointer' }}
                                                                title={<span>Dr. {user.firstName} {user.lastName}</span>}
                                                                subtitle={<ul className="list--tags">{user.specialities &&
                                                                    user.specialities.map((speciality, i) => (
                                                                        <li key={i}>{speciality.name}</li>
                                                                    ))}
                                                                </ul>}
                                                            /></Link>
                                                    </GridListTile>
                                                    //)
                                                ))}

                                            </GridList>

                                        ) : (
                                            <div>
                                                <center>No Doctor Found ...</center>
                                            </div>
                                        )}
                                        {doctorList && doctorList.length > (doctorListLimit - 1) && (
                                            <div className="text-center">
                                                <button className="btn btn-outline-secondary" onClick={loadMore}>Load More</button>
                                            </div>
                                        )}
                                    </div>
                                </MuiAccordionDetails>
                            </MuiAccordion>
                        </div>
                    </Col>
                </Row >
            </Container >
            {/* <Footer /> */}
            {/*   </>
            )}*/}
        </div >
    )
}
export default Nutrition;