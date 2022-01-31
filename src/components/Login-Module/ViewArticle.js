import React, { useEffect, useState } from "react";
import Header from './Header'
import Footer from './Footer'
import './landing.css';
import { getArticle } from "../../service/ArticleService";
import { Link, useHistory, useParams } from 'react-router-dom';

import { Container, Row, Col } from 'react-bootstrap'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import IconButton from '@material-ui/core/IconButton';
//import Loader from '../Loader/Loader'

//const docprofile = './src/images/doctor/'

const ViewArticle = () => {
    //const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null)

    let history = useHistory();
    const { id } = useParams();

    const [article, setArticle] = useState({});


    useEffect(() => {
        loadArticle();
    }, []);

    const loadArticle = async () => {
        const result = await getArticle(`${id}`);
        //console.log(result)
        setArticle(result);
        setImage(result.picture)
    };




    return (<>
        <div style={{ backgroundColor: '#fff' }}>
            <Header />
            <br />
            <br />

            <Container>

                <Row className="article-top-row">
                    <Col md={3} className="mb-2">
                        <Link to="/signin"><div id="Box1" className="nutrition-card-box">Nutrition Plan</div></Link>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Link to="/signin"><div id="Box2" className="nutrition-card-box">Workout</div></Link>
                    </Col>
                    {/* <Col md={2} className="mb-2">
                        <div id="Box3" className="nutrition-card-box">Lifestyle</div>
                    </Col> */}
                    <Col md={3} className="mb-2">
                        <Link to="/signin"><div id="Box4" className="nutrition-card-box">Shop</div></Link>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Link to="/signin"><div id="Box5" className="nutrition-card-box">Articles</div></Link>
                    </Col>
                    {/* <Col md={2} className="mb-2">
                        <div id="Box6" className="nutrition-card-box">Education</div>
                    </Col> */}
                </Row>
                <br />
                <IconButton style={{ background: '#00D0CC', color: '#fff', marginRight: "10px" }} onClick={() => {
                    history.goBack();
                }}><KeyboardBackspaceIcon /> </IconButton>
                <br />
                <div id="nutrition-col">

                    <Row>

                        <Col md={4}>
                            <img src={image} alt="" style={{ width: "100%", height: "300px", borderRadius: '22px' }} />
                        </Col>
                        <Col md={8}>
                            <h4 className="mb-3">{article?.title}</h4>

                            <h6 >Source: <a href={article?.source} target="_blank">{article?.source}</a></h6>
                            <h6 className="mb-3">Published: {article.publishTime}</h6>
                            <p id="box-text">{article?.description}</p>
                        </Col>

                    </Row>
                </div>
            </Container>
            <br />
            <br />
            <Footer />
        </div>
    </>)


}


export default ViewArticle;

