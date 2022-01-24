import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import './patient.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import SearchBar from "material-ui-search-bar";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
//import IconButton from '@material-ui/core/IconButton';
//import { Link } from 'react-router-dom';
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import 'react-calendar/dist/Calendar.css';
import Avatar from 'react-avatar';
//import { checkAccessToken } from '../../service/RefreshTokenService';
import LocalStorageService from './../../util/LocalStorageService';
//import Cookies from 'universal-cookie';
import Loader from './../Loader/Loader';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { getDoctorList } from '../../service/adminbackendservices';
//const rightArrow = <FontAwesomeIcon icon={faChevronRight} />;

const GlobalSearch = () => {

    const [users, setUser] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filterData, setFilterData] = useState(users);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const result = await getDoctorList().catch(err => {
            if (err.response.status === 500 || err.response.status === 504) {
                setLoading(false);
            }
        });
        if (result && result.data) {
            setUser(result.data.doctors);
            setFilterData(result.data.doctors);
            setTimeout(() => setLoading(false), 1000);
        }

    };

    const handleSearch = (value) => {
        if (value === "") {
            setFilterData(users);
        }
        else {
            setSearchText(value);
            searchData(value);
        }
    }

    const searchData = (value) => {
        const lowercasedValue = value.toLowerCase().trim();
        const filteredData = users.filter(item => {
            return Object.keys(item).some(key =>
                item.specialities && item.specialities.length > 0 && item.specialities.some(specialty =>
                    specialty.keywordss && specialty.keywordss.some(keyword =>
                        keyword.name && keyword.name.toString().toLowerCase().includes(lowercasedValue)
                    )
                )
            );
        });
        //console.log("filteredData  :::: ", filteredData)
        setFilterData(filteredData);
    }

    return (
        <div>
            {loading && (
                <Loader />
            )}
            <Container>
                <Row>
                    <Col md={12}>
                        <div id="dorctor-list">
                            <div className="global-Togglebar">
                                <SearchBar type="text" value={searchText} id="doctor-search" style={{ width: '100% !important' }} onChange={(value) => handleSearch(value)} onCancelSearch={() => handleSearch("")} />
                            </div>
                            <br />
                            <br />
                            <div id="global-list">
                                <GridList cellHeight={220}>
                                    {filterData && filterData.map((user, index) => (
                                            <GridListTile key={index}>
                                            {/* {!user.liked && (
                                                <FavoriteBorderIcon id="fav-icon" />
                                            )}
                                            {user.liked && (
                                                <FavoriteIcon id="fav-icon" />
                                            )} */}
                                            {user.picture ? (<img src={user.picture} alt="" />)
                                                : (<Avatar name={user.firstName + " " + user.lastName} />)}
                                            
                                        <Link to={{pathname: '/patient/mydoctor', state: user}}><GridListTileBar style={{ cursor: 'pointer' }}
                                                title={<span>Dr. {user.firstName} {user.lastName}</span>}
                                                subtitle={<ul className="list--tags">{user.specialities &&
                                                    user.specialities.map((speciality, index) => (
                                                        <li key={index}>{speciality.name}</li>
                                                    ))}
                                                </ul>}
                                            /> </Link>
                                        </GridListTile>
                                       
                                    ))}

                                </GridList>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* <Footer /> */}
        </div >
    )
}

export default GlobalSearch;
