import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
// import Loader from '../Loader/Loader';
import './shop.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
// import Rating from '@material-ui/lab/Rating';
// import Box from '@material-ui/core/Box';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// import ShareIcon from '@material-ui/icons/Share';
import LocalMallOutlinedIcon from '@material-ui/icons/LocalMallOutlined';
import $ from 'jquery';
import SearchBar from "material-ui-search-bar";
import TuneIcon from '@material-ui/icons/Tune';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import productImage from '../../images/shop/Fitbit.jpg';
import Cookies from 'universal-cookie';
import {
    getListOfSubCategoryAndProducts,
    getSubCategoryProducts,
    getSingleProduct,
    getShops
} from '../../service/shopservice';


const Shop = () => {

    // const [loading, setLoading] = useState(true);

    const [expanded, setExpanded] = useState();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState();
    const [searchText, setSearchText] = useState("");
    const [filterProducts, setFilterProducts] = useState();
    const [selectedProduct, setSelectedProduct] = useState();
    const [subCategories, setSubCategories] = useState();
    const [selectedCategory, setSelectedCategory] = useState("Wearable"); //selectedCategory

    const [productQuantity, setProductQuantity] = useState(1);

    const cookies = new Cookies();

    const currentUser = cookies.get("currentUser");
    const { authorities = [] } = currentUser || {}

    const increment = () => {
        setProductQuantity(productQuantity + 1);
    }

    const decrement = () => {
        setProductQuantity(productQuantity === 0 ? 0 : productQuantity - 1);
    }

    useEffect(() => {
        loadSubCategories();
    }, []);

    const loadSubCategories = async () => {
        const res = await getShops();
        if (res) {
            setSelectedCategory(res[0].category);
            setExpanded(res[0].category);
            setCategories(res);
            const result = await getListOfSubCategoryAndProducts(res[0].category);
            if (result) {
                setSubCategories(result[0]);
                loadProducts(result[0].productSubCategoryList[0].id)
                const index = 0;
                toggleClass(result[0].productSubCategoryList[0].subCategoryName.split(' ')[0] + index)
            }
        }
    };

    const loadProducts = async (subCategoryId) => {
        const result = await getSubCategoryProducts(subCategoryId);
        if (result) {
            setProducts(result);
            setFilterProducts(result);
            // setTimeout(() => setLoading(false), 1000);
        }
    };

    const toggleClass = (currentClass) => {
        var selectedItem = `.${currentClass}`;
        //console.log('selectedItem', selectedItem);
        // Select all list items 
        var listItems = $(".product-info");

        // Remove 'active' tag for all list items 
        listItems.removeClass("active");

        // Add 'active' tag for currently selected item 
        $(selectedItem).addClass("active");
    }

    const loadSaleProduct = async () => {
        const result = await axios.get("http://localhost:3011/products");
        if (result && result.data) {
            setProducts(result.data);
            loadSingleProduct(result.data[0].id);
        }
        return loadSaleProduct;
    }

    const handleChange = (panel) => async (event, newExpanded) => {
        const result = await getListOfSubCategoryAndProducts(panel);
        if (result) {
            setSubCategories(result[0]);
            loadProducts(result[0].productSubCategoryList[0].id)
            const index = 0;
            toggleClass(result[0].productSubCategoryList[0].subCategoryName.split(' ')[0] + index)
            setExpanded(newExpanded ? panel : false);
            setDisplay({ ...display, simpleProducts: 'block', saleProducts: 'none', allProducts: 'block', singleProduct: 'none' })
        }


        //else if (panel === "panel3") {
        //    setDisplay({ ...display, simpleProducts: 'none', saleProducts: 'block' })
        //    loadSaleProduct();
        // }
    };

    const handleProductClick = async (productId) => {
        const result = await getSingleProduct(productId);
        if (result) {
            setSelectedProduct(result);
            setDisplay({ ...display, allProducts: 'none', singleProduct: 'block' });
        }
    };

    const loadSingleProduct = async (productId) => {
        const result = await axios.get(`http://localhost:3011/products/${productId}`);
        if (result && result.data) {
            setSelectedProduct(result.data);
        }
    };

    const [display, setDisplay] = useState({
        allProducts: 'block',
        singleProduct: 'none',
        simpleProducts: 'block',
        saleProducts: 'none'
    })
    //console.log(display);

    const handleSearch = (value) => {
        setSearchText(value);
        searchData(value);
    }

    const searchData = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        if (lowercasedValue === "") {
            setFilterProducts(products);
        }
        else {
            const filteredData = products.filter(item => {
                return Object.keys(item).some(key =>
                    item[key].toString().toLowerCase().includes(lowercasedValue)
                );
            });
            setFilterProducts(filteredData);
        }
    }

    const isURL = (str) => {
        let srcLink = str;
        let convertedString = srcLink.toLowerCase();

        if (/https/g.test(convertedString)) {
            return true;
        } else {
            return false
        }
    }

    return (
        <div>
            <Container className='mb-5'>
                <br />

                <Row className="justify-content-center">
                    {authorities.some((user) => user === "ROLE_PATIENT") && (
                        <>
                            <Col md={3} className="mb-2">
                                <Link to="/patient/nutrition"><div id="Box1" className="nutrition-card-box">Nutrition Plan</div></Link>
                            </Col>
                            <Col md={3} className="mb-2">
                                <Link to="/patient/workout"><div id="Box2" className="nutrition-card-box">Workout</div></Link>
                            </Col>
                        </>
                    )}
                    {/*<Col md={2} className="mb-2">
                        <div id="Box3" className="nutrition-card-box">Lifestyle</div>
                    </Col>*/}
                    <Col md={3} className="mb-2">
                        <Link to={authorities.some((user) => user === "ROLE_PATIENT") ? "/patient/shop" : "/doctor/shop"}><div id="Box4" className="nutrition-card-box">Shop</div></Link>
                    </Col>
                    <Col md={3} className="mb-2">
                        <Link to={authorities.some((user) => user === "ROLE_PATIENT") ? "/patient/article" : "/doctor/article"}><div id="Box5" className="nutrition-card-box">Articles</div></Link>
                    </Col>
                    {/*<Col md={2} className="mb-2">
                        <div id="Box6" className="nutrition-card-box">Education</div>
                    </Col>*/}
                </Row>



                <Row>
                    <Col md={3}>
                        <div id="shop-col-1">
                            {categories && categories.length > 0 && categories.map((category, index) => (
                                <MuiAccordion square expanded={expanded === category.category} onChange={handleChange(category.category)}>
                                    <MuiAccordionSummary aria-controls="panel1d-content" id="panel-header" key={index}>
                                        <Typography>{category.category}</Typography>
                                    </MuiAccordionSummary>
                                    <MuiAccordionDetails>
                                        <div>{category.category}</div>
                                    </MuiAccordionDetails>
                                </MuiAccordion>
                            ))}

                            {/*<MuiAccordion square expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                <MuiAccordionSummary aria-controls="panel2d-content" id="panel-header">
                                    <Typography>Supplements</Typography>
                                </MuiAccordionSummary>
                                <MuiAccordionDetails>
                                    <div>Supplements</div>
                                </MuiAccordionDetails>
                            </MuiAccordion>

                            <MuiAccordion square expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                <MuiAccordionSummary aria-controls="panel3d-content" id="panel-header">
                                    <Typography>Deal &amp; Offers</Typography>
                                </MuiAccordionSummary>
                                <MuiAccordionDetails>
                                    <div>Deal &amp; Offers</div>
                                </MuiAccordionDetails>
                            </MuiAccordion>*/}
                        </div>
                    </Col>

                    <Col md={4} style={{ display: display.simpleProducts }}>
                        <div id="shop-col">
                            <div id="product-list">
                                {subCategories && subCategories.productSubCategoryList && subCategories.productSubCategoryList.map((product, index) => (
                                    <Card variant="outlined" className="mb-2" key={index} onClick={() => {
                                        toggleClass(product.subCategoryName.split(' ')[0] + index)
                                        loadProducts(product.id);
                                    }}>
                                        <CardContent>
                                            <Row>
                                                <Col xs={4} className="p-0">
                                                    <img src={product.pictureUrl && isURL(product.pictureUrl) ? product.pictureUrl : productImage} alt={product.subCategoryName} style={{ width: '100%', height: '75px', cursor: 'pointer' }} />
                                                </Col>
                                                <Col xs={8} className={`p-0 product-info ${product.subCategoryName.split(' ')[0] + index}`}>
                                                    <Row className="m-0">
                                                        <Col xs={6} className="p-0">
                                                            <p className="product-name">{product.subCategoryName}</p>
                                                            {/* <Box component="fieldset" borderColor="transparent">
                                                                <Rating
                                                                    name="simple-controlled"
                                                                    value={product.rating}
                                                                />
                                                            </Box> */}
                                                        </Col>
                                                        <Col xs={6} className="product-icons">
                                                            <IconButton>
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <br />
                                                            <IconButton>
                                                                <LocalMallOutlinedIcon />
                                                            </IconButton>
                                                            <IconButton>
                                                                <FavoriteBorderIcon />
                                                            </IconButton>
                                                            {/* <IconButton>
                                                                <ShareIcon />
                                                            </IconButton> */}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </CardContent>
                                    </Card>
                                )
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col md={5} style={{ display: display.simpleProducts }}>
                        <div id="shop-col">
                            <div style={{ display: display.allProducts }}>
                                <div className="Togglebar">
                                    <span id="toggle-icons">
                                        <IconButton>
                                            <TuneIcon />
                                        </IconButton>
                                        <IconButton>
                                            <LocalMallOutlinedIcon />
                                        </IconButton>
                                        <IconButton>
                                            <FavoriteBorderIcon />
                                        </IconButton>
                                        {/* <IconButton>
                                            <ShareIcon />
                                        </IconButton> */}
                                    </span>
                                    <SearchBar type="text" id="product-search" value={searchText} onChange={(value) => handleSearch(value)} onCancelSearch={() => handleSearch("")} />
                                </div>
                                <br />
                                <div id="card-list">
                                    {filterProducts?.subCategoryProductList.length > 0 ? (
                                        <GridList cellHeight={220}>
                                            {filterProducts.subCategoryProductList && filterProducts.subCategoryProductList.map((product, index) => (
                                                <GridListTile key={index}>
                                                    <FavoriteBorderIcon id="fav-icon" />
                                                    <img src={product.pictureUrl && isURL(product.pictureUrl) ? product.pictureUrl : productImage} alt={product.name} />
                                                    <GridListTileBar
                                                        title={<span>{product.name}</span>}
                                                        subtitle={<span>{product.currency + " " + product.price}
                                                        </span>}
                                                        onClick={() => handleProductClick(product.id)}
                                                    />
                                                </GridListTile>

                                            ))}

                                        </GridList>
                                    ) : <div style={{ textAlign: "center" }}>No product found ...</div>}
                                </div>
                            </div>
                            <div style={{ display: display.singleProduct }}>
                                <IconButton id="back-button" onClick={() => setDisplay({ ...display, allProducts: 'block', singleProduct: 'none' })}>
                                    <KeyboardBackspaceIcon />
                                </IconButton>
                                <br />
                                {selectedProduct && (
                                    <>
                                        <AwesomeSlider
                                            bullets={false}
                                        >
                                            <div data-src={selectedProduct.pictureUrl && isURL(selectedProduct.pictureUrl) ? selectedProduct.pictureUrl : productImage} />
                                        </AwesomeSlider>
                                        <Row>
                                            <Col xs={8}>
                                                <h3 className="product-name">{selectedProduct.name}</h3>
                                                <p className="product-desc">
                                                    {selectedProduct.description}
                                                </p>
                                            </Col>
                                            <Col xs={4}>
                                                <span className="product-price float-right">{selectedProduct.currency + " " + selectedProduct.price}</span>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-center">
                                            <Col xs={8}>
                                                <div className="product-quantity">
                                                    <span>Quantity</span>
                                                    <IconButton className="quantity-button">
                                                        <AddIcon onClick={() => increment()} />
                                                    </IconButton>
                                                    <span className="quantity-value">{productQuantity}</span>
                                                    <IconButton className="quantity-button">
                                                        <RemoveIcon onClick={() => decrement()} />
                                                    </IconButton>
                                                </div>
                                            </Col>
                                            <Col xs={4} className="text-right">
                                                <IconButton className="cart-button">
                                                    <LocalMallOutlinedIcon />
                                                </IconButton>
                                            </Col>
                                        </Row>

                                    </>
                                )}
                            </div>
                        </div>
                    </Col>

                    {/* Deals & offer */}

                    <Col md={4} style={{ display: display.saleProducts }}>
                        <div id="shop-col">
                            <div id="sale-product-list">
                                <GridList cellHeight={220}>
                                    {filterProducts && filterProducts.subCategoryProductList && filterProducts.subCategoryProductList.map((product, index) => (
                                        <GridListTile key={index}>
                                            <FavoriteBorderIcon id="fav-icon" />
                                            <img src={productImage} alt={product.name} />
                                            <button className="product-discount">{product.discount}%</button>
                                            <GridListTileBar
                                                title={<span>{product.name}</span>}
                                                subtitle={<span>$ {product.price}</span>}
                                                onClick={() => handleProductClick(product.id)}
                                            />
                                        </GridListTile>

                                    ))}

                                </GridList>
                            </div>
                        </div>
                    </Col>

                    <Col md={5} style={{ display: display.saleProducts }}>
                        <div id="shop-col">
                            <div>
                                {selectedProduct && (
                                    <>
                                        <AwesomeSlider
                                            bullets={false}
                                            style={{ marginTop: '-10px' }}
                                        >
                                            <div data-src={productImage} />
                                            <div data-src={productImage} />
                                            <div data-src={productImage} />
                                        </AwesomeSlider>
                                        <Row>
                                            <Col xs={7}>
                                                <h3 className="product-name">{selectedProduct.name}</h3>
                                                <p className="product-desc">
                                                    {selectedProduct.description}
                                                </p>
                                            </Col>
                                            <Col xs={3} className="p-0">
                                                <span className="product-price float-left">${selectedProduct.price}</span>
                                            </Col>
                                            <Col xs={2} className="p-0">
                                                <button className="single-product-discount">{selectedProduct.discount}%</button>
                                            </Col>
                                        </Row>
                                        <Row className="align-items-center" style={{ position: 'relative', top: '50px' }}>
                                            <Col xs={8}>
                                                <div className="product-quantity">
                                                    <span>Quantity</span>
                                                    <IconButton className="quantity-button">
                                                        <AddIcon onClick={() => increment()} />
                                                    </IconButton>
                                                    <span className="quantity-value">{productQuantity}</span>
                                                    <IconButton className="quantity-button">
                                                        <RemoveIcon onClick={() => decrement()} />
                                                    </IconButton>
                                                </div>
                                            </Col>
                                            <Col xs={4} className="text-right">
                                                <IconButton className="cart-button">
                                                    <LocalMallOutlinedIcon />
                                                </IconButton>
                                            </Col>
                                        </Row>

                                    </>
                                )}
                            </div>
                        </div>
                    </Col>



                </Row>
            </Container>
        </div>
    )
}
export default Shop;