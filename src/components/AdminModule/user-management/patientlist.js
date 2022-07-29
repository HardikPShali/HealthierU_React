import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import moment from 'moment';
import Loader from '../../Loader/Loader';
import TransparentLoader from '../../Loader/transparentloader';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdbreact/dist/css/mdb.css';
import '../admin.css';
import SearchBar from 'material-ui-search-bar';
import { Row, Col } from 'react-bootstrap';
import Cookies from 'universal-cookie';
import SearchIcon from '@material-ui/icons/Search';
import { getPaginatedPatientList } from '../../../service/adminbackendservices';
import EditIcon from '@material-ui/icons/Edit';
// import { MDBDataTableV5 } from 'mdbreact';
// import LocalStorageService from "../../../util/LocalStorageService";
// import properties from "../../../properties";
// import Axios from "axios";

const PatientList = () => {
  const [loading, setLoading] = useState(true);
  const [transparentLoading, setTransparentLoading] = useState(false);
  const [userList, setUserList] = useState();
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState();

  const cookies = new Cookies();

  useEffect(() => {
    getUserList();
    cookies.remove('authorities', { path: '/' });
  }, []);

  const limit = 20;
  const [offset, setOffset] = useState(0);
  // const getUserList = (pageNumber) => {
  const getUserList = async () => {
    const res = await getPaginatedPatientList(offset, limit).catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    // const row = [];
    if (res && res.data) {
      setUserList(res.data);
      setOffset(offset + 1);
      setFilterData(res.data);
      setTimeout(() => setLoading(false), 1000);
      setTimeout(() => setTransparentLoading(false), 1000);
    }
  };

  const handleSearch = (searchValue) => {
    if (searchValue === '') {
      setFilterData(userList);
      setDisplay({ ...display, suggestion: 'none' });
    } else {
      setSearchText(searchValue);
      searchData(searchValue);
    }
  };

  const searchData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    const filteredData = userList.filter((item) => {
      return Object.keys(item).some(
        (key) =>
          item[key] &&
          item[key]
            .toString()
            .toLowerCase()
            .includes(lowercasedValue)
      );
    });
    setFilterData(filteredData);
    if (filteredData.length == '0') {
      setTimeout(() => setDisplay({ ...display, suggestion: 'block' }), 1500);
    }
  };
  const loadMore = async () => {
    const result = await getPaginatedPatientList(offset, limit);
    if (result && result.data) {
      // var existingUsersList = [];
      var existingUsersList = userList;
      result.data &&
        result.data.map((newData) => {
          return existingUsersList.push(newData);
        });
      setOffset(offset + 1);
      setUserList(existingUsersList);
      setFilterData(existingUsersList);
    }
    return result;
  };

  const setCookies = (authority) => {
    cookies.set("authorities", "ROLE_PATIENT")
  };

  const [display, setDisplay] = useState({
    suggestion: 'none',
  });

  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Navbar pageTitle="patientList" />
      <div className="container">
        <div className="py-4">
          <Row style={{ alignItems: 'center' }}>
            <Col md={8}>
              <h1>Patient List</h1>
            </Col>
            <Col md={4}>
              <div id="admin-search">
                <SearchBar
                  type="text"
                  value={searchText}
                  onChange={(value) => handleSearch(value)}
                  onCancelSearch={() => handleSearch('')}
                />
                <Link to="/admin/search">
                  <div
                    className="suggestion-text"
                    style={{ display: display.suggestion }}
                  >
                    <SearchIcon /> Didn't find patient, Do global search
                  </div>
                </Link>
              </div>
            </Col>
          </Row>
          <br />
          {/* <MDBDataTableV5 hover entriesOptions={[10,20, 25]} data={datatable} onPageChange={ value => setPagination(value.activePage) } searchTop searchBottom={false} fullPagination={true} /> */}

          <table className="table table-responsive table-borderless table-hover mdb-dataTable userTable">
            <thead>
              <tr>
                <th width={70}>S no.</th>
                <th width={100}>Full Name</th>
                {/* <th width={100}>Last Name</th> */}
                <th width={150}>Email</th>
                <th width={100}>Role</th>
                <th width={250}>Signup Date</th>
                <th width={265}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filterData &&
                filterData.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.firstName}</td>
                    {/* <td>{user.lastName}</td> */}
                    <td>{user.email}</td>
                    <td>
                      Patient
                    </td>
                    <td>
                      {/* {moment(user && user.createdDate).format(
                        'DD MMM, YYYY hh:mm A'
                      )} */}
                      {(user.createTime &&
                        moment(user.createTime).format(
                          'DD MMM, YYYY hh:mm A'
                        )) ||
                        ''}
                    </td>
                    <td>
                      <div
                        style={{
                          width: '265px',
                          height: 'auto',
                          overflow: 'unset',
                        }}
                      >
                        <Link
                          className="btn btn-info mr-2 py-2 px-3"
                          data-title="Edit/View"
                          to={{
                            pathname: `/admin/user-management/edit/${user.userId}`,
                            state: user,
                          }}
                          onClick={() => setCookies(user.authorities)}
                        >
                          <EditIcon />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="text-center">
            <button className="btn btn-outline-elegant" onClick={loadMore}>
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
