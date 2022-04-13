import React, { useEffect, useState } from "react";
import './landing.css';
import { getArticle, getArticles } from "../../service/ArticleService";
import { Link } from 'react-router-dom';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Loader from '../Loader/Loader';
import Cookies from 'universal-cookie';
import { Container, Row, Col, Card } from 'react-bootstrap';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import moment from "moment";

//const docprofile = './src/images/doctor/'

const CommonViewArticle = () => {

    const cookies = new Cookies();

    const currentUser = cookies.get("currentUser");
    const { authorities = [] } = currentUser || {}

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

    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null)

    const [selectedArticle, setSelectedArticle] = useState();
    const [article, setArticle] = useState([]);


    useEffect(() => {
        loadArticle();
    }, []);

    const loadArticle = async () => {
        const response = await getArticles().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        setArticle(response.articlesList);
        setLoading(false);
    }

    const loadSelectedArticle = async (articleId) => {
        const result = await getArticle(articleId);
        //console.log(result)
        setSelectedArticle(result);
        setImage(result.picture)
    };




    return (<>
        <div style={{ backgroundColor: '#fff' }}>
            {loading && (
                <Loader />
            )}
            {!loading && (<>
                <br />
                <br />
                <Container>
                    <Row className="justify-content-center">
                        {authorities.some((user) => user === "ROLE_PATIENT") && (
                            <>
                                <Col md={6} className="mb-2">
                                    <Link to="/patient/nutrition"><div id="Box1" className="nutrition-card-box">Nutrition Plan</div></Link>
                                </Col>
                                <Col md={6} className="mb-2">
                                    <Link to="/patient/workout"><div id="Box2" className="nutrition-card-box">Workout</div></Link>
                                </Col>
                            </>
                        )}
                        {/*<Col md={2} className="mb-2">
        <div id="Box3" className="nutrition-card-box">Lifestyle</div>
    </Col>*/}
                        {/* <Col md={6} className="mb-2">
                            <Link to={authorities.some((user) => user === "ROLE_PATIENT") ? "/patient/article" : "/doctor/article"}><div id="Box5" className="nutrition-card-box">Articles</div></Link>
                        </Col> */}
                        {/* <Col md={3} className="mb-2">
                            <Link to={authorities.some((user) => user === "ROLE_PATIENT") ? "/patient/shop" : "/doctor/shop"}><div id="Box4" className="nutrition-card-box">Shop</div></Link>
                        </Col> */}

                        {/*<Col md={2} className="mb-2">
        <div id="Box6" className="nutrition-card-box">Education</div>
    </Col>*/}
                    </Row>
                    <br />
                    <h2 id="Article-title">Articles</h2>
                    <p id="Article-text">
                        Read the latest healthcare articles and doctor opinions on our brand new blog. Explore more about<br />
                        various treatments, health concerns, and home remedies from the best doctors!
                    </p>
                    <br />
                    <br />
                    <div id="article-row">
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
                            {article && article.length > 0 && article.map((articleItem, index) => (
                                //<Col md={4} key={index}>
                                <Card key={articleItem.id}>
                                    <Card.Img variant="top" src={articleItem.picture} id="article-card-img" />
                                    <Card.Body id="article-card-body">
                                        <Card.Title>{articleItem.title} </Card.Title>
                                        <Card.Text>
                                            {articleItem.description}
                                        </Card.Text>
                                        <p id="button-cover">
                                            <span style={{ color: "#000", cursor: 'pointer' }} onClick={() => loadSelectedArticle(articleItem.id)}>Read More <ArrowForwardIcon /></span>
                                        </p>
                                    </Card.Body>
                                </Card>
                                //</Col>
                            ))}
                        </Carousel>

                        {article && article.length === 0 && (
                            <div>No article found...</div>
                        )}
                    </div>
                </Container>
                <br />
                <br />
                <Container>
                    {selectedArticle && (
                        <div id="nutrition-col">
                            <Row>

                                <Col md={4}>
                                    <img src={image} alt="" style={{ width: "100%", height: "300px", borderRadius: '22px' }} />
                                </Col>
                                <Col md={8}>
                                    <h4 className="mb-3">{selectedArticle?.title}</h4>

                                    <h6 >Source: <a href={selectedArticle?.source} target="_blank" rel="noopener noreferrer">{selectedArticle?.source}</a></h6>
                                    <h6 className="mb-3">Published: {moment(selectedArticle.publishTime).format("DD MMM, YYYY")}</h6>
                                    <p id="box-text">{selectedArticle?.description}</p>
                                </Col>

                            </Row>
                        </div>
                    )}
                </Container>
                <br />
                <br />
            </>)}
        </div>
    </>)


}

export default CommonViewArticle;

