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
import {
  getPaginatedDoctorList,
  changeDoctorStatusOnUserTable,
  changeDoctorStatusOnDoctorTable,
  // approveDoctorByAdmin,
} from '../../../service/adminbackendservices';
import EditIcon from '@material-ui/icons/Edit';
import { doctorListLimit } from '../../../util/configurations';
import Pagination from '../../CommonModule/pagination';
import { getSearchData } from '../../../service/frontendapiservices';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { IconButton } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useHistory } from 'react-router-dom';
// import { DialogTitle } from "@material-ui/core";
// import CheckCircleIcon from "@material-ui/icons/CheckCircle";
// import {
//   TextValidator,
//   ValidatorForm,
// } from "react-material-ui-form-validator";
// import { MDBDataTableV5 } from 'mdbreact';
// import LocalStorageService from "../../../util/LocalStorageService";
// import properties from "../../../properties";
// import Axios from "axios";

const DoctorList = () => {
  const [loading, setLoading] = useState(true);
  const [transparentLoading, setTransparentLoading] = useState(false);
  const [userList, setUserList] = useState();
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const history = useHistory();
  const cookies = new Cookies();
  useEffect(() => {
    getUserList();
    cookies.remove('authorities', { path: '/' });
  }, []);

  const [offset] = useState(0);
  // const getUserList = (pageNumber) => {
  const getUserList = async () => {
    const res = await getPaginatedDoctorList(offset, doctorListLimit).catch(
      (err) => {
        if (err.response.status === 500 || err.response.status === 504) {
          setLoading(false);
        }
      }
    );
    console.log({ res })
    // const row = [];
    if (res && res.data) {
      setUserList(res.data);
      setFilterData(res.data.doctors);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalItems);
      setTimeout(() => setLoading(false), 1000);
      setTimeout(() => setTransparentLoading(false), 1000);
    }
  };

  const clickPagination = async (pageNumber) => {
    setTransparentLoading(true);
    setCurrentPageNumber(pageNumber);
    if (searchText !== '') {
      const res = await getSearchData(searchText, pageNumber, doctorListLimit);
      if (res.status === 200 && res.data?.doctors.length > 0) {
        setFilterData(res.data.doctors);
        setTransparentLoading(false);
      } else if (res.status === 204) {
        setFilterData([]);
        setTransparentLoading(false);
      }
    } else {
      const result = await getPaginatedDoctorList(pageNumber, doctorListLimit);
      if (result && result.data) {
        setFilterData(result.data.doctors);
        setTransparentLoading(false);
      }
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
    return handleSearch;
  };

  const handleSearchInputChange = (searchValue) => {
    if (searchValue === '') {
      setSearchText('');
      setFilterData(userList.doctors);
      setTotalPages(userList.totalPages);
      setTotalRecords(userList.totalItems);
      setCurrentPageNumber(0);
    } else {
      setSearchText(searchValue);
    }
  };

  const handleSearchData = async () => {
    if (searchText !== '') {
      // setTransparentLoading(true);
      setCurrentPageNumber(0);
      const res = await getSearchData(searchText, 0, doctorListLimit);
      if (res.status === 200 && res.data?.doctors.length > 0) {
        setFilterData(res.data.doctors);
        setTotalPages(res.data.totalPages);
        setTotalRecords(res.data.totalItems);
        // setTransparentLoading(false);
      } else if (res.status === 204) {
        setFilterData([]);
        setTotalPages(1);
        setTotalRecords(0);
        // setTransparentLoading(false);
      }
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
    setTimeout(() => setDisplay({ ...display, suggestion: 'block' }), 1500);
  };

  const loadMore = async () => {
    const result = await getPaginatedDoctorList(offset, doctorListLimit);
    if (result && result.data) {
      // var existingUsersList = [];
      var existingUsersList = userList;
      result.data &&
        result.data.doctors.map((newData) => {
          return existingUsersList.push(newData);
        });
      setUserList(existingUsersList);
      setFilterData(existingUsersList);
    }
    // .catch(error => {
    //   if (error.response && error.response.status === 401) {
    //     checkAccessToken();
    //   }
    // })
    return result;
  };

  const setCookies = (authority) => {
    cookies.set('authorities', 'ROLE_DOCTOR');
  };

  const [display, setDisplay] = useState({
    suggestion: 'none',
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [activeDialog, setActiveDialog] = useState(false);

  const activateDoctor = async (selectedUser) => {
    setTransparentLoading(true);
    const doctorData = {
      userId: selectedUser.userId,
      activated: true,
    };

    const data = {
      email: selectedUser.email,
      activated: true,
    };
    const response = await changeDoctorStatusOnUserTable(data);

    if (response?.status === 200) {
      const doctorTableResponse = await changeDoctorStatusOnDoctorTable(
        doctorData
      );
      if (doctorTableResponse?.status === 200) {
        setStatusMsg(
          `${selectedUser.firstName}  ${selectedUser.lastName} with email : ${selectedUser.email} is activated.`
        );
        setTransparentLoading(false);
        setActiveDialog(true);
      }
    }
    return activateDoctor;
  };

  const deactivateDoctor = async (selectedUser) => {
    setTransparentLoading(true);
    const doctorData = {
      userId: selectedUser.userId,
      activated: false,
    };
    const data = {
      email: selectedUser.email,
      activated: false,
    };
    const response = await changeDoctorStatusOnUserTable(data);
    if (response?.status === 200) {
      const doctorTableResponse = await changeDoctorStatusOnDoctorTable(
        doctorData
      );
      if (doctorTableResponse?.status === 200) {
        setStatusMsg(
          `${selectedUser.firstName} ${selectedUser.lastName} with email : ${selectedUser.email} is deactivated.`
        );
        setTransparentLoading(false);
        setActiveDialog(true);
      }
    }
    return deactivateDoctor;
  };

  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Navbar pageTitle="doctorList" />
      <div className="container">
        <div className="py-4">
          <Row style={{ alignItems: 'center' }}>
            <Col md={8}>
              <h1>Doctor List</h1>
            </Col>
            <Col md={4}>
              <div id="admin-search" style={{ textAlign: 'end' }}>
                <SearchBar
                  type="text"
                  value={searchText}
                  id="doctor-search"
                  onChange={(value) => { handleSearchInputChange(value); handleSearchData(); }}
                  onCancelSearch={() => handleSearchInputChange('')}
                  onRequestSearch={() => handleSearchData()}
                  cancelOnEscape={true}
                  onKeyDown={(e) =>
                    e.keyCode === 13 ? handleSearchData() : ''
                  }
                />
                {console.log('searchText', searchText)}
                {/* {searchText !== '' && (
                  <IconButton
                    onClick={() => handleSearchData()}
                    className="searchForwardIcon"
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                )} */}
                {/*<SearchBar type="text" value={searchText} onChange={(value) => handleSearch(value)} onCancelSearch={() => handleSearch('')} />
                <Link to="/admin/search"><div className="suggestion-text" style={{ display: display.suggestion }}><SearchIcon /> Did'nt find doctor, Do global search</div></Link>*/}
              </div>
            </Col>
            <Col>
              <div className="totalNumberOfDoctors">
                <span>
                  <b>Total Number of Doctors: {totalRecords}</b>
                </span>
              </div>
            </Col>
          </Row>
          <br />
          {/* <MDBDataTableV5 hover entriesOptions={[10,20, 25]} data={datatable} onPageChange={ value => setPagination(value.activePage) } searchTop searchBottom={false} fullPagination={true} /> */}

          <table className="table table-responsive table-borderless table-hover mdb-dataTable userTable">
            <thead>
              <tr>
                <th width={70}>S no.</th>
                <th width={80}>First Name</th>
                <th width={80}>Last Name</th>
                <th width={150}>Email</th>
                <th width={100}>Role</th>
                <th width={250}>Signup Date</th>
                <th width={265}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filterData?.length > 0 ? (
                filterData.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">
                      {currentPageNumber === 0
                        ? index + 1
                        : index + 1 + currentPageNumber * 15}
                    </th>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      {/* {user.authorities.some(
                        (userRole) => userRole === "ROLE_DOCTOR" ? "Doctor" : ""
                      )} */}
                      Doctor
                    </td>
                    <td>
                      <div
                        style={{
                          width: '250px',
                          height: 'auto',
                          overflow: 'unset',
                        }}
                      >
                        {(user.createTime &&
                          moment(user.createTime).format(
                            'DD MMM, YYYY hh:mm A'
                          )) ||
                          ''}
                      </div>
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
                        {/* {user.approved === false
                          && (<span className="alert alert-danger disabled py-2 px-2" role="alert">Doctor is not Approved</span>)}
                        {user.approved === null && user.activated
                          && (<button className="btn btn-danger ml-0 mr-2 py-2 px-3" data-title="Deactivate" onClick={() => deactivateDoctor(user)}>Deactivate</button>)}
                        {user.approved === null && !user.activated
                          && (<button className="btn btn-success ml-0 mr-2 py-2 px-3" data-title="Activate" onClick={() => activateDoctor(user)}>Activate</button>)} */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No doctor found...
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
          <Pagination
            total={totalPages}
            current={currentPageNumber + 1}
            pagination={(crPage) => clickPagination(crPage - 1)}
          />
          {/*<div className="text-center">
            <button className="btn btn-outline-elegant" onClick={loadMore}>Load More</button>
              </div>*/}
        </div>
        <Dialog aria-labelledby="customized-dialog-title" open={activeDialog}>
          <DialogContent>{statusMsg}</DialogContent>
          <DialogActions>
            <button
              type="button"
              autoFocus
              className="btn btn-info"
              onClick={() => history.go(0)}
            >
              ok
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DoctorList;
