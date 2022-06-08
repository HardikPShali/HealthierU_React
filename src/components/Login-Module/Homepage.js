import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./landing.css";
// import ChatPage from '../CommonModule/Chat/ChatPage/ChatPage'
import {
  MDBCarousel,
  MDBCarouselCaption,
  MDBCarouselInner,
  MDBCarouselItem,
  MDBView,
  MDBMask,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardText,
} from "mdbreact";
import {
  Link,
  useHistory,
  // Redirect
} from "react-router-dom";
import screen1 from "../../images/patient-banner.png";
import screen2 from "../../images/patient-banner-2.png";
import screen3 from "../../images/patient-banner-3.png";
import home2 from "../../images/home-2.png";
import home3 from "../../images/home-3.png";
import { Container, Row, Col, Card } from "react-bootstrap";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Loader from "./../Loader/Loader";
import { getArticles } from "../../service/ArticleService";
import {
  HOMEPAGE_GETHELP,
  HOMEPAGE_TAKEACTION,
  HOMEPAGE_LEARNMORE,
} from "../../util/constant";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Cookies from "universal-cookie";

import aboutUsimg from "../../images/macbook-iphone-healthyU.png";
import step1 from "../../images/step1.PNG";
import step2 from "../../images/step2.PNG";
import step3 from "../../images/step3.png";
import step4 from "../../images/step4.PNG";
import step5 from "../../images/step5.PNG";
import step6 from "../../images/step6.PNG";
import step7 from "../../images/step7.PNG";
import step8 from "../../images/step8.PNG";
import step9 from "../../images/step9.PNG";
import step10 from "../../images/step10.PNG";
import step11 from "../../images/step11.PNG";
import step13 from "../../images/step13.png";

import features from "../../images/our-features.png";
import betterFuture from "../../images/better-future.png";
import CornelMedicine from "../../images/cornell-medicine-logo.png";
import ReemHospital from "../../images/reem-hospital-logo.png";
import Edge1 from "../../images/edgeone.png";
import Edge2 from "../../images/edgetwo.png";
import powerfulFeatureImg from "../../images/powerfulFeatureMob.png";
import heartIcon from "../../images/HeartSpl.png"
import labIcon from "../../images/LabSpl.png"
import molecularIcon from "../../images/MolecularSpl.png"
import careIcon from "../../images/CareSpl.png"

//import firebase from './../../firebase';
// import education from '../../images/education.png'
// import article1 from '../../images/article1.png'
// import article2 from '../../images/article2.png'
// import article3 from '../../images/article3.png'

const Homepage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState([]);
  const cookies = new Cookies();

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  useEffect(() => {
    // loadArticle();
  }, []);

  useEffect(() => {
    if (
      cookies.get("currentUser")?.id !== "" &&
      cookies.get("currentUser")?.authorities[0] === "ROLE_PATIENT"
    ) {
      history.push("/patient");
    }
    if (
      cookies.get("currentUser")?.id !== "" &&
      cookies.get("currentUser")?.authorities[0] === "ROLE_DOCTOR"
    ) {
      history.push("/doctor");
    }
    if (
      cookies.get("currentUser")?.id !== "" &&
      cookies.get("currentUser")?.authorities[0] === "ROLE_ADMIN"
    ) {
      history.push("/admin");
    }
  }, [cookies.get("currentUser")]);

  const loadArticle = async () => {
    const response = await getArticles().catch((err) => {
      if (
        err.response.status === 500 ||
        err.response.status === 504 ||
        err.response.status === 502
      ) {
        setLoading(false);
        setArticle([]);
      }
    });
    setArticle(response?.articlesList);
    setTimeout(() => setLoading(false), 2000);
    // console.log(article);
    // console.log(response?.articlesList);
  };

  return (
    <div>
      {loading && <Loader />}
      <Header />
      <MDBContainer id="carousel-container">
        <MDBCarousel
          activeItem={1}
          length={3}
          showIndicators={true}
          className="z-depth-1"
        >
          <MDBCarouselInner>
            <MDBCarouselItem itemId="1">
              <MDBView>
                <img
                  className="d-block w-100"
                  src={screen1}
                  alt="First slide"
                />
                <MDBMask overlay="black-strong" />
              </MDBView>
              <MDBCarouselCaption>
                <Container>
                <h3 className="text-primary-clr">Connect with our Global Wellness Experts Virtually</h3>
                <p className="text-primary-clr-p">Our specialties include mental health, nutrition, sleep health, immunity, fitness, and much more.</p>
                {/* <Link to="/signin">
                  <button className="btn btn-primary btn-mob-size">
                    {HOMEPAGE_GETHELP.BTN_TEXT}
                  </button>
                </Link> */}
                </Container>
              </MDBCarouselCaption>
            </MDBCarouselItem>
            <MDBCarouselItem itemId="2">
              <MDBView>
                <img
                  className="d-block w-100"
                  src={screen2}
                  alt="Second slide"
                />
                <MDBMask overlay="black-strong" />
              </MDBView>
              <MDBCarouselCaption>
                <Container>
                <h3 className="h3-responsive">Book Appointment</h3>
                <p className="help-desc">Your virtual health advisor in your preferred time zone.</p>
                {/* <Link to="/signin">
                  <button className="btn btn-primary btn-mob-size">
                    {HOMEPAGE_TAKEACTION.BTN_TEXT}
                  </button>
                </Link> */}
                </Container>
              </MDBCarouselCaption>
            </MDBCarouselItem>
            <MDBCarouselItem itemId="3">
              <MDBView>
                <img
                  className="d-block w-100"
                  src={screen3}
                  alt="Third slide"
                />
                <MDBMask overlay="black-slight" />
              </MDBView>
              <MDBCarouselCaption>
                <Container>
                <h3 className="h3-responsive">Take Charge of your Health</h3>
                <p className="help-desc">Get your personalized wellness plan to prevent and manage possible future diseases.</p>
                {/* <Link to="/signin">
                  <button className="btn btn-primary btn-mob-size">
                    {HOMEPAGE_LEARNMORE.BTN_TEXT}
                  </button>
                </Link> */}
                </Container>
              </MDBCarouselCaption>
            </MDBCarouselItem>
          </MDBCarouselInner>
        </MDBCarousel>
      </MDBContainer>
      {/* <Container className="p-0 padding-mobile">
        <Row id="aboutus-two">
          <Col md={4} lg={4} xl={4} >
            <h2>HealthierU</h2>
            <h4>Wellness Optimized</h4>
            <br />
            <p>
              HealthierU is an integrated and fully secured health
              communications platform that aims to bring the best international
              medical care to all users from across the globe.{" "}
            </p>
            <p>
              Get answers. Get well.
              <br />
              'Tap into the best virtual healthcare.'
            </p>
          </Col>
          <Col md={8} lg={8} xl={8}>
            <img className="image" src={aboutUsimg} alt="HealthierU " />
          </Col>
        </Row>
      </Container> */}
      {/* <div id="our-services">
        <Container>
          <Row id="aboutus-four">
            <Col md={5} style={{ padding: "0px" }}>
              <img className="image" src={features} alt="Features" />
            </Col>
            <Col md={1}></Col>
            <Col md={6}>
              <h2>Our Features</h2>
              <br />
              <br />
              <h5>Robust & scalable platform</h5>
              <p>
                A powerful technology stack for a highly-scalable
                <br />
                telemedicine platform.
              </p>

              <h5>Unlimited access to accredited doctors</h5>
              <p>
                We offer access to the best accredited doctors and medical
                <br />
                institutions in Europe and the USA.
              </p>

              <h5>Quick access to medical care</h5>
              <p>Connect to any of our global doctors at your convenience.</p>

              <h5>Healthcare data security</h5>
              <p>
                We respect and commit to protecting your privacy and
                <br />
                personal data.
              </p>

              <h5>Innovative AI - powered app</h5>
              <p>
                Our AI technology will help personalize and optimize your
                <br />
                needs based on a comprehensive assessment.
              </p>

              <h5>Integration of wearable devices</h5>
              <p>
                Connect with any wearable device and allow us to remotely
                <br />
                monitor your health.
              </p>
            </Col>
          </Row>
        </Container>
      </div> */}
      <div>
        <div id="about-us" className="about-us_section">
          <Container className="p-0 padding-mobile">
            {/* <h3 className="better-future text-uppercase text-center">
              HAND-IN-HAND FOR A BETTER FUTURE
            </h3> */}
            <div className="better-future-content">
              <div className="about-sec">
                <Row>
                  <Col sm={12} md={7} lg={5}>
                    <div className="about-content">
                      <h3>ABOUT US</h3>
                      <span className="line"></span>
                      <p className="light" id="how-it-work">
                        HealthierU utilizes next-generation telemedicine to
                        provide you with the best access to highly trained and
                        licensed experts from wellness centers and clinics
                        across the UAE and across the globe.
                      </p>
                    </div>
                    <div className="how-content">
                      <h3>HOW?</h3>
                      <ul className="light">
                        <li>We use technology to transform your experience.</li>
                        <li>
                          We believe in a proactive care management approach.
                        </li>
                        <li >
                          We create a consumer-first approach and a personalized
                          data-driven digital health experience.
                        </li>
                        <li >
                          We are pioneers in bringing the Internet of Health to
                          everyone.
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Container>
        </div>
        <div className="purpose-section">
          <Container className="p-0 padding-mobile">
            <div class="row">
              <Col sm={12} md={6} lg={6} xl={6} className="purpose-left">
                <h2>PURPOSE</h2>
                <p>WE EMPOWER YOU TO BECOME A BETTER VERSION OF YOURSELF.</p>
              </Col>
              <Col sm={12} md={6} lg={6} xl={6} className="purpose-right">
                <h1>HEALING</h1>
                <h1 class="mt0">PEOPLE,</h1>
                <span>NOT PATIENTS.</span>
              </Col>
            </div>
          </Container>
        </div>
        <div className="edge-section">
          <Container className="edge-section_container">
            <Row>
              <Col className="edge-text" sm={12} md={12} lg={6} xl={6}>
                <h1>OUR EDGE</h1>
                <p className="light edge-subtitle">
                  A one-of-a-kind and scalable wellness and prevention
                  telemedicine platform.
                </p>
                <ul>
                  <li>Personalized</li>
                  <li>Proactive system: Predicts diseases before they occur</li>
                  <li>Patient-centered</li>
                  <li>Value and not volume-based</li>
                  <li>Designed to prevent diseases</li>
                  <li>Barely any waiting time</li>
                  <li>
                    Treatment decisions are influenced by what is best for the
                    patient
                  </li>
                </ul>
              </Col>
              <Col className="edge-image" sm={12} md={12} lg={6} xl={6}>
                {/* <img className="mr-4" src={Edge1} alt=""></img> */}
                <img src={step3} alt=""></img>
              </Col>
              <div className="our_partners">
                <h4>Our Partner</h4>
                <div className="our_partners-logo">
                  <div className="cornel-logo">
                    <img src={CornelMedicine} alt="" />
                  </div>
                  {/* <div className="our_partners-vr-line"></div> */}
                  {/* <div className="reem-logo">
                    <img src={ReemHospital} alt="" />
                  </div> */}
                </div>
              </div>
            </Row>
          </Container>
        </div>
        <div className="powerful_feature">
          <Container>
            <Row>
              <Col className="powerful_Ftr-image" sm={12} md={12} lg={6} xl={6}>
                <img src={step13} alt=""></img>
              </Col>
              <Col className="powerful_Ftr-text" sm={12} md={12} lg={6} xl={6}>
                <h1>POWERFUL FEATURES</h1>
                <ul>
                  <li>Convenient and easy-to-use app</li>
                  <li>
                    Comprehensive solutions to help prevent and predict diseases
                  </li>
                  <li>
                    Unlimited 24/7 access to professionals in the wellness and
                    prevention field
                  </li>
                  <li>Robust and powerful technology</li>
                  <li>
                    Quick access to personalized supplements and wearables
                  </li>
                  <li>Customized nutrition meal and fitness plans</li>
                  <li>E-courses on wellness, health, and much more</li>
                  <li>Medicine and appointment reminders</li>
                  <li>Quick access to labs near you</li>
                  <li id="our-service">Healthcare data security</li>
                </ul>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="our_spl-section">
          <Container className="p-0 padding-mobile">
            <div>
              <h1 className="our_spl-title">OUR SPECIALITIES</h1>
              <p className="our_spl-subtitle">
                We offer programs and plans to help support your wellness
                journey.
              </p>
            </div>
            <Row>
              <Col sm={12} md={6} lg={3} xl={3} l>
                <img src={heartIcon} alt="" />
                <h3>REGENERATIVE MEDICINE</h3>
                <ul>
                  <li>Sleep Therapy</li>
                  <li>Immune Health</li>
                  <li>Sexual health</li>
                </ul>
              </Col>
              <Col sm={12} md={6} lg={3} xl={3} l>
                <img src={labIcon} alt="" />
                <h3>FUNCTIONAL MEDICINE</h3>
                <ul>
                  <li>Comprehensive lab diagnostics</li>
                  <li>Gut Microbiome</li>
                  <li>Sexual health hormones</li>
                </ul>
              </Col>
              <Col sm={12} md={6} lg={3} xl={3} l>
                <img src={molecularIcon} alt="" />
                <h3>MOLECULAR MEDICINE</h3>
                <ul>
                  <li>
                    Integrative and Holistic Nutrition and sport Performance
                  </li>
                </ul>
              </Col>
              <Col sm={12} md={6} lg={3} xl={3} l>
                <img src={careIcon} alt="" />
                <h3>ENERGY / BODY-MIND MEDICINE</h3>
                <ul>
                  <li>Stress management</li>
                  <li>Mental management</li>
                </ul>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      {/* <Container id="aboutus-three">
        <MDBContainer id="how-it-work">
          <MDBCarousel
            activeItem={1}
            length={4}
            slide={true}
            interval={false}
            showControls={true}
            multiItem
          >
            <MDBCarouselInner>
              <MDBRow>
                <MDBCarouselItem itemId="1">
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step1} />
                      <MDBCardBody>
                        <MDBCardText>
                        Connect with our Global Wellness Experts Virtually
                          <br />
                          Our specialties include mental health, nutrition, sleep health, immunity, fitness, and much more.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol md="2"></MDBCol>
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step2} />
                      <MDBCardBody>
                        <MDBCardText>
                          Set up your account within seconds
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBCarouselItem>
                <MDBCarouselItem itemId="2">
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step3} />
                      <MDBCardBody>
                        <MDBCardText>
                          Connect with the right care.
                          <br />
                          Find the right doctor for your need.
                          <br />
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol md="2"></MDBCol>
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step4} />
                      <MDBCardBody>
                        <MDBCardText>
                          Access your appointments in seconds.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBCarouselItem>
                <MDBCarouselItem itemId="3">
                  <MDBCol md="4">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step5} />
                      <MDBCardBody>
                        <MDBCardText>
                          Find the right care.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol md="4">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step6} />
                      <MDBCardBody>
                        <MDBCardText>
                          Schedule your online 
                          <br />
                          consultation.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol md="4">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step7} />
                      <MDBCardBody>
                        <MDBCardText>Consult with your doctor virtually.</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBCarouselItem>
                <MDBCarouselItem itemId="4">
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step8} />
                      <MDBCardBody>
                        <MDBCardText>
                          Have instant chat with your doctor.
                        </MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol md="2"></MDBCol>
                  <MDBCol md="5">
                    <MDBCard className="mb-2">
                      <MDBCardImage className="img-fluid" src={step9} />
                      <MDBCardBody>
                        <MDBCardText>Review your doctor's report and prescription.</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBCarouselItem>
              </MDBRow>
            </MDBCarouselInner>
          </MDBCarousel>
        </MDBContainer>
      </Container> */}
      {/* <Container id="first-box">
                <Row>
                    <Col md={6} id="col-card">
                        <h2>Nutrition</h2>
                        <p id="box-text">Eating smart has never been easier!
                            <br />
                            Customize your meal plan with the click of a button, get in touch with our registered dietitians and fitness specialists, and get a list of healthy recipes you can make, all from the comfort of your own home.</p>
                        <Link to="/signin">
                            <button className="btn btn-outline-primary know-more-btn">Know More</button>
                        </Link>
                    </Col>
                    <Col md={6} id="bg-img"></Col>
                </Row>
            </Container>
            <Container id="second-box">
                <Row>
                    <Col md={6} id="bg-img-2"></Col>
                    <Col md={6} id="col-card-2">
                        <h2>Workout</h2>
                        <p id="box-text">Build workout plans that fit your schedule and goals!
                            <br />
                            Our workout plans offer exercises and training routines for newbies and gym veterans alike. Choose from a list of basic free videos, and subscribe to any of our memberships to get in touch with our sports specialists.</p>
                        <Link to="/signin" >
                            <button className="btn btn-outline-primary know-more-btn-2">Know More</button>
                        </Link>
                    </Col>
                </Row>
            </Container> */}
      {/* <Container id="first-box">
                <Row>
                    <Col md={6} id="col-card">
                        <h2>Lifestyle</h2>
                        <p id="box-text">Get quick access to meditations and healthy foods by navigating
                        our lifestyle section and grocery list.
                        <br />
                        Our shopping list will improve the quality of your grocery shopping by making
                        it easier, faster and, most importantly, smarter. Learn more about meditation
                        and mindfulness, and experience less stress, anxiety, and more restful sleep.</p>
                        <button className="btn btn-outline-primary know-more-btn">'Know More</button>
                    </Col>
                    <Col md={6} id="bg-img-3"></Col>
                </Row>
            </Container> */}
      {/* <Container id="first-box">
                <Row>
                    <Col md={6} id="col-card">
                        <h2>Shop</h2>
                        <p id="box-text">
                            Order your own personalized wearables and supplements from our e-commerce shop. We offer a wide range of health devices and dietary supplements that your mind and body will thank you for.
                        </p>
                        <Link to="/signin" >
                            <button className="btn btn-outline-primary know-more-btn">Know More</button>
                        </Link>
                    </Col>
                    <Col md={6} id="bg-img-4"></Col>
                </Row>
            </Container> */}
      {/* <br />
            <br /> */}
      {/*<Container>
                <Card id="education-card">
                    <Card.Img src={education} alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title>Education</Card.Title>
                        <Card.Text>
                            Enroll to the best health related online course.<br />
                                Lorem ipsum dolor iset eductaion
                            </Card.Text>
                        <Card.Text>
                            <button className="btn btn-outline-primary know-more-btn">'Know More</button>
                        </Card.Text>
                    </Card.ImgOverlay>
                </Card>
            </Container>
            <br />
            <br />*/}
      {/* <Container>
                <h2 id="Article-title">Articles</h2>
                <p id="Article-text">
                    Get breaking scientific news and articles on longevity, nutrition, healthtech, agetech, gadgets, and much more.
                </p>
                <br />
                <br />
                <div id="article-row">
                    {article && article.length > 0 && (
                        <Carousel
                            swipeable={true}
                            draggable={true}
                            responsive={responsive}
                            autoPlaySpeed={1000}
                            keyBoardControl={true}
                            customTransition="all .5"
                            transitionDuration={500}
                            containerClass="carousel-container"
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                            dotListClass="custom-dot-list-style"
                            itemClass="carousel-item-padding-40-px"
                        >
                            {article && article.length > 0 && article.map((articleItem) => (
                                //<Col md={4} key={index}>
                                <Card key={articleItem.id}>
                                    <Card.Img variant="top" src={articleItem.picture} id="article-card-img" />
                                    <Card.Body id="article-card-body">
                                        <Card.Title>${articleItem.title}</Card.Title>
                                        <Card.Text>
                                            {articleItem.description}
                                        </Card.Text>
                                        <p id="button-cover">
                                            <Link to={{ pathname: `/article/${articleItem.id}` }} style={{ color: "#000" }}>Read More <ArrowForwardIcon /></Link>
                                        </p>
                                    </Card.Body>
                                </Card>
                                //</Col>
                            ))}
                        </Carousel>
                    )}

                    {article && article.length === 0 && (
                        <div>No article found...</div>
                    )}
                </div>
            </Container> */}
      {/* <br />
            <br /> */}
      <div style={{ backgroundColor: "#eee9df" }}>
        <Container className="p-0 padding-mobile">
          <Row className="pt-5 pb-5 two-box-padding">
            <Col md={12} lg={6} xl={6} className="mb-3">
              <Card>
                <Card.Img variant="top" src={home2} />
                <Card.Body>
                  <Card.Title>How healthy are you?</Card.Title>
                  <Card.Text>
                    Find out how you measure with health and
                    <br />
                    well-being assessment
                  </Card.Text>
                  <Link to="/signin">
                    <button
                      variant="primary"
                      className="btn btn-outline-light assessment-btn "
                    >
                      Take my assessment
                    </button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={6} xl={6}>
              <Card>
                <Card.Img variant="top" src={home3} />
                <Card.Body>
                  <Card.Title>Looking for an expert advise?</Card.Title>
                  <Card.Text>
                    Check out our available wellness specialists
                  </Card.Text>
                  <Link to="/signin">
                    <button
                      variant="primary"
                      className="btn btn-outline-light assessment-btn"
                    >
                      Meet Our Doctors
                    </button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer id="footer" />
      {/* <ChatPage /> */}
    </div>
  );
};

export default Homepage;
