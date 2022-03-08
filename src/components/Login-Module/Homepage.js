import React, { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import './landing.css';
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask, MDBContainer } from
    "mdbreact";
import {
    Link,
    // Redirect 
} from 'react-router-dom'
import screen1 from '../../images/screen1.png'
import screen2 from '../../images/screen2.png'
import screen3 from '../../images/screen3.png'
import home2 from '../../images/home-2.png'
import home3 from '../../images/home-3.png'
import { Container, Row, Col, Card } from 'react-bootstrap';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Loader from './../Loader/Loader';
import { getArticles } from "../../service/ArticleService";
import { HOMEPAGE_GETHELP, HOMEPAGE_TAKEACTION, HOMEPAGE_LEARNMORE } from '../../util/constant';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Cookies from 'universal-cookie';


//import firebase from './../../firebase';
// import education from '../../images/education.png'
// import article1 from '../../images/article1.png'
// import article2 from '../../images/article2.png'
// import article3 from '../../images/article3.png'

const Homepage = () => {

    const [loading, setLoading] = useState(true);
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
        loadArticle();
    }, []);

    useEffect(() => {
        if (cookies.get("currentUser")?.id !== "" && cookies.get("currentUser")?.authorities[0] === "ROLE_PATIENT") {
            window.location.assign("/patient");
        }
        if (cookies.get("currentUser")?.id !== "" && cookies.get("currentUser")?.authorities[0] === "ROLE_DOCTOR") {
            window.location.assign("/doctor");
        }
        if (cookies.get("currentUser")?.id !== "" && cookies.get("currentUser")?.authorities[0] === "ROLE_ADMIN") {
            window.location.assign("/admin");
        }
    }, [cookies.get('currentUser')]);


    const loadArticle = async () => {
        const response = await getArticles().catch(err => {
            if (err.response.status === 500 || err.response.status === 504 || err.response.status === 502) {
                setLoading(false);
                setArticle([]);
            }
        });
        setArticle(response?.articlesList);
        setTimeout(() => setLoading(false), 2000);
        console.log(article);
        console.log(response?.articlesList);
    }

    return (
        <div>
            {loading && (
                <Loader />
            )}
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
                                <MDBMask overlay="black-light" />
                            </MDBView>
                            <MDBCarouselCaption>
                                <h3 className="h3-responsive">{HOMEPAGE_GETHELP.TITLE}</h3>
                                <p className="help-desc">{HOMEPAGE_GETHELP.DESCRIPTION}</p>
                                <Link to="/signin">
                                    <button className="btn btn-light get-started-btn">{HOMEPAGE_GETHELP.BTN_TEXT}</button>
                                </Link>
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
                                <h3 className="h3-responsive">{HOMEPAGE_TAKEACTION.TITLE}</h3>
                                <p className="help-desc">{HOMEPAGE_TAKEACTION.DESCRIPTION}</p>
                                <Link to="/signin">
                                    <button className="btn btn-light get-started-btn">{HOMEPAGE_TAKEACTION.BTN_TEXT}</button>
                                </Link>
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
                                <h3 className="h3-responsive">{HOMEPAGE_LEARNMORE.TITLE}</h3>
                                <p className="help-desc">{HOMEPAGE_LEARNMORE.DESCRIPTION}</p>
                                <Link to="/signin">
                                    <button className="btn btn-light get-started-btn">{HOMEPAGE_LEARNMORE.BTN_TEXT}</button>
                                </Link>
                            </MDBCarouselCaption>
                        </MDBCarouselItem>
                    </MDBCarouselInner>
                </MDBCarousel>
            </MDBContainer>
            <div style={{ backgroundColor: "#eee9df" }}>
                <Container>
                    <br />
                    <br />
                    <Row>
                        <Col>
                            <Card>
                                <Card.Img variant="top" src={home2} />
                                <Card.Body>
                                    <Card.Title>How healthy are you?</Card.Title>
                                    <Card.Text>
                                        Find out how you measure with health and<br />
                                        well-being assessment
                                    </Card.Text>
                                    <Link to="/signin">
                                        <button variant="primary" className="btn btn-outline-light assessment-btn">Take my assessment</button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card>
                                <Card.Img variant="top" src={home3} />
                                <Card.Body>
                                    <Card.Title>Looking for an expert advise?</Card.Title>
                                    <Card.Text>
                                        Check out our available wellness specialists
                                    </Card.Text>
                                    <Link to="/signin">
                                        <button variant="primary" className="btn btn-outline-light assessment-btn">Meet Our Doctors</button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <br />
                </Container>
            </div>
            <Container id="first-box">
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
            </Container>
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
            <Container id="first-box">
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
            </Container>
            <br />
            <br />
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
            <Container>
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
            </Container>
            <br />
            <br />
            <Footer />
        </div>
    )
}

export default Homepage

