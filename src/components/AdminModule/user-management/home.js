import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/Navbar";
import moment from "moment";
import Loader from "../../Loader/Loader";
import TransparentLoader from "../../Loader/transparentloader";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import "../admin.css";
import SearchBar from "material-ui-search-bar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
// import Typography from '@material-ui/core/Typography';
import { Row, Col } from "react-bootstrap";
import Cookies from "universal-cookie";
import {
  TextValidator,
  ValidatorForm,
  // TextValidator
} from "react-material-ui-form-validator";
import {
  getDoctorByUserID,
  getPaginatedUserList,
  approveDoctorByAdmin,
  updateApprovedDoctorRRate,
  changeDoctorStatusOnUserTable,
  changeDoctorStatusOnDoctorTable,
} from "../../../service/adminbackendservices";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Pagination from "../../CommonModule/pagination";
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
// import PublishIcon from "@material-ui/icons/Publish";
// import { checkAccessToken } from '../../../service/RefreshTokenService';
// import SearchIcon from "@material-ui/icons/Search";
// import { MDBDataTableV5 } from 'mdbreact';
// import LocalStorageService from "../../../util/LocalStorageService";
// import properties from "../../../properties";
// import Axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [transparentLoading, setTransparentLoading] = useState(false);
  // const [pagination, setPagination] = useState(0);
  const [userList, setUserList] = useState();
  const [searchText, setSearchText] = useState("");
  const [filterData, setFilterData] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const history = useHistory();





  // updating rate in doctor flow
  const [selectedUser, setSelectedUser] = useState({});
  const [selectedUserData, setSelectedUserData] = useState({});

  const cookies = new Cookies();

  const [open, setOpen] = useState(false);

  const handleClickOpen = async (userData) => {
    setSelectedUserData(userData);
    const currentUserData = await getDoctorByUserID(userData);
    console.log({ currentUserData });
    setSelectedUser(currentUserData.doctors[0]);
    if (
      currentUserData &&
      currentUserData.doctors.length > 0 &&
      !currentUserData.doctors[0].rate &&
      !currentUserData.doctors[0].halfRate
    ) {
      setOpen(true);
    } else if (
      currentUserData &&
      currentUserData.doctors.length > 0 &&
      currentUserData.doctors[0].rate &&
      currentUserData.doctors[0].halfRate
    ) {
      approveDoctor(userData);
    }
  };
  const [uploadOpen, setUploadOpen] = useState(false);
  // const handleUploadOpen = (user) => {
  //   setSelectedUser(user);
  //   setUploadOpen(true);
  // };
  const handleUploadClose = () => {
    setUploadOpen(false);
  };

  useEffect(() => {
    getUserList();
    cookies.remove("authorities", { path: "/" });
  }, []);

  const limit = 20;
  const [offset, setOffset] = useState(0);
  // const getUserList = (pageNumber) => {
  const getUserList = async () => {
    const res = await getPaginatedUserList(offset, limit).catch((err) => {
      if (err.response.status === 500 || err.response.status === 504) {
        setLoading(false);
      }
    });
    // const row = [];
    if (res && res.data) {
      setUserList(res.data.userList);
      setOffset(offset + 1);
      setFilterData(res.data.userList);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.totalItems);
      setTimeout(() => setLoading(false), 1000);
      setTimeout(() => setTransparentLoading(false), 1000);
    }
  };
  const clickPagination = async (pageNumber) => {
    setTransparentLoading(true);
    setCurrentPageNumber(pageNumber);
    const result = await getPaginatedUserList(pageNumber, limit);
    if (result && result.data) {
      setFilterData(result.data.userList);
      setTransparentLoading(false);
    }
  };

  const handleSearch = (searchValue) => {
    if (searchValue === "") {
      setFilterData(userList);
      setDisplay({ ...display, suggestion: "none" });
    } else {
      setSearchText(searchValue);
      searchData(searchValue);
    }
  };

  const handleRateChange = (e) => {
    setSelectedUser({ ...selectedUser, rate: e.target.value });
  };

  const handleHalfRateChange = (e) => {
    setSelectedUser({ ...selectedUser, halfRate: e.target.value });
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
    setTimeout(() => setDisplay({ ...display, suggestion: "block" }), 1500);
  };
  // const loadMore = async () => {
  //   const result = await getPaginatedUserList(offset, limit);
  //   if (result && result.data) {
  //     // var existingUsersList = [];
  //     var existingUsersList = userList;
  //     result.data &&
  //       result.data.map((newData) => {
  //         existingUsersList.push(newData);
  //       });
  //     setOffset(offset + 1);
  //     setUserList(existingUsersList);
  //     setFilterData(existingUsersList);
  //   }
  //   // .catch(error => {
  //   //   if (error.response && error.response.status === 401) {
  //   //     checkAccessToken();
  //   //   }
  //   // })
  // };
  const approveDoctor = async (userData) => {
    // setTransparentLoading(true);
    userData.approved = true;
    const response = await approveDoctorByAdmin(userData);
    console.log({ response });
    if (response.status === 200 || response.status === 201) {
      okClickOnActivateDoctor()
      history.go(0);

    }
  };

  const handleDetails = async (e) => {
    var bodyFormData = new FormData();
    const updatedSelectedUser = { ...selectedUser };
    // delete updatedSelectedUser.salutation;
    bodyFormData.append("profileData", JSON.stringify(updatedSelectedUser));
    // console.log({ formData: [...bodyFormData] });
    // delete bodyFormData.salutation;
    const response = await updateApprovedDoctorRRate(bodyFormData);
    console.log({ response })
    if (response.status === 200 || response.status === 201) {
      approveDoctor(selectedUserData);
    }
  };

  const [setUploadData] = useState();
  const handleFileChange = (e) => {
    setUploadData(e.target.files);
  };

  const handleFileUpload = (user) => {
    //console.log("Files :: ", uploadData);
  };

  const setCookies = (authority) => {
    authority.some((role) =>
      role === "ROLE_DOCTOR"
        ? cookies.set("authorities", "ROLE_DOCTOR")
        : role === "ROLE_PATIENT"
          ? cookies.set("authorities", "ROLE_PATIENT")
          : role === "ROLE_ADMIN"
            ? cookies.set("authorities", "ROLE_ADMIN")
            : "ROLE_USER"
    );
  };

  const [display, setDisplay] = useState({
    suggestion: "none",
  });
  const [statusMsg, setStatusMsg] = useState("");
  const [activeDialog, setActiveDialog] = useState(false);

  const activateDoctor = async (selectedUser) => {
    setTransparentLoading(true);
    const doctorData = {
      userId: selectedUser.id,
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
  };

  const deactivateDoctor = async (selectedUser) => {
    setTransparentLoading(true);
    const doctorData = {
      userId: selectedUser.id,
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
  };

  const okClickOnActivateDoctor = () => {
    // history.go(0);
    toast.success('Doctor Approved');
  }

  return (
    <div>
      {loading && <Loader />}
      {transparentLoading && <TransparentLoader />}
      <Navbar pageTitle="home" />
      <div className="container">
        <div className="py-4">
          <Row style={{ alignItems: "center" }}>
            <Col md={8}>
              <h1>User Management</h1>
            </Col>
            <Col md={4}>
              <div id="admin-search">
                <SearchBar
                  type="text"
                  value={searchText}
                  onChange={(value) => handleSearch(value)}
                  onCancelSearch={() => handleSearch("")}
                />
                {/* <Link to="/admin/search">
                  <div
                    className="suggestion-text"
                    style={{ display: display.suggestion }}
                  >
                    <SearchIcon /> Did'nt find doctor or patient, Do global
                    search
                  </div>
                </Link> */}
              </div>
            </Col>
            <Col>
              <div className="totalNumberOfDoctors">
                <span>
                  <b>Total Number of Doctors:{totalRecords}</b>
                </span>
              </div>
            </Col>
          </Row>
          <br />
          {/* <MDBDataTableV5 hover entriesOptions={[10,20, 25]} data={datatable} onPageChange={ value => setPagination(value.activePage) } searchTop searchBottom={false} fullPagination={true} /> */}

          <table className="table shadow">
            <thead className="thead-dark">
              <tr>
                <th width={70}>S no.</th>
                <th width={80}>Full Name</th>
                {/* <th width={80}>Last Name</th> */}
                <th width={150}>Email</th>
                <th width={80}>Role</th>
                <th width={250}>Signup Date</th>
                <th width={290}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filterData &&
                filterData.map((user, index) => (
                  <tr key={index}>
                    <th scope="row">
                      {currentPageNumber === 0
                        ? index + 1
                        : index + 1 + currentPageNumber * 20}
                    </th>
                    <td>{user.firstName + ' ' + (user.lastName || "")}</td>
                    {/* <td>{user.lastName}</td> */}
                    <td>{user.email}</td>
                    <td>
                      {user.authorities.some(
                        (userRole) => userRole === "ROLE_DOCTOR"
                      )
                        ? "Doctor"
                        : user.authorities.some(
                          (userRole) => userRole === "ROLE_PATIENT"
                        )
                          ? "Patient"
                          : user.authorities.some(
                            (userRole) => userRole === "ROLE_ADMIN"
                          )
                            ? "Administrator"
                            : ""}
                    </td>
                    <td>
                      <div
                        style={{
                          width: "200px",
                          height: "auto",
                          overflow: "unset",
                        }}
                      >
                        {moment(user && user.createdDate).format(
                          "DD MMM, YYYY hh:mm A"
                        )}
                      </div>
                    </td>
                    <td>
                      <div
                        style={{
                          width: "290px",
                          height: "auto",
                          overflow: "unset",
                        }}
                      >
                        {/* <Link className="btn btn-primary mr-2 py-2 px-4" to={`/admin/user-management/users/${user.login}`} onClick={() => setCookies(user.authorities)}>View</Link> */}
                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_DOCTOR"
                        ) &&
                          user.profileCompleted && (
                            <Link
                              className="btn btn-info mr-2 py-2 px-3"
                              data-title="Edit/View"
                              to={{
                                pathname: `/admin/user-management/edit/${user.id}`,
                                state: user,
                              }}
                              onClick={() => setCookies(user.authorities)}
                            >
                              <EditIcon />
                            </Link>
                          )}
                        {/* <button className="btn btn-red ml-0 mr-2 py-2 px-3" data-title="Upload" onClick={() => handleUploadOpen(user)}><PublishIcon /></button></>)} */}

                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_PATIENT"
                        ) &&
                          user.profileCompleted && (
                            <Link
                              className="btn btn-info mr-2 py-2 px-3"
                              data-title="Edit/View"
                              to={{
                                pathname: `/admin/user-management/edit/${user.id}`,
                                state: user,
                              }}
                              onClick={() => setCookies(user.authorities)}
                            >
                              <EditIcon />
                            </Link>
                          )}
                        {/* <button className="btn btn-red ml-0 mr-2 py-2 px-3" data-title="Upload" onClick={() => handleUploadOpen(user)}><PublishIcon /></button>)} */}
                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_DOCTOR"
                        ) &&
                          !user.approved &&
                          user.profileCompleted && (
                            <button
                              className="btn btn-success ml-0 mr-2 py-2 px-3"
                              data-title="Accept"
                              onClick={() => handleClickOpen(user)}
                            >
                              <CheckCircleIcon />
                            </button>
                          )}
                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_DOCTOR"
                        ) &&
                          !user.profileCompleted && (
                            <span
                              className="alert alert-danger disabled py-2 px-2"
                              role="alert"
                            >
                              Doctor didn't yet complete his profile
                            </span>
                          )}
                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_PATIENT"
                        ) &&
                          !user.profileCompleted && (
                            <span
                              className="alert alert-danger disabled py-2 px-2"
                              role="alert"
                            >
                              Patient didn't yet complete his profile
                            </span>
                          )}
                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_DOCTOR"
                        ) &&
                          user.approved &&
                          user.profileCompleted &&
                          user.activated && (
                            <button
                              className="btn btn-danger ml-0 mr-2 py-2 px-3"
                              data-title="Deactivate"
                              onClick={() => deactivateDoctor(user)}
                            >
                              Deactivate
                            </button>
                          )}
                        {user.authorities.some(
                          (userRole) => userRole === "ROLE_DOCTOR"
                        ) &&
                          user.approved &&
                          user.profileCompleted &&
                          !user.activated && (
                            <button
                              className="btn btn-success ml-0 mr-2 py-2 px-3"
                              data-title="Activate"
                              onClick={() => activateDoctor(user)}
                            >
                              Activate
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            total={totalPages}
            current={currentPageNumber + 1}
            pagination={(crPage) => clickPagination(crPage - 1)}
          />
          {/* <div className="text-center">
                            <button className="btn btn-outline-elegant" onClick={loadMore}>Load More</button>
                        </div> */}
        </div>
      </div>
      <Dialog aria-labelledby="customized-dialog-title" open={open}>
        <ValidatorForm onSubmit={() => handleDetails(selectedUser)}>
          <DialogTitle id="customized-dialog-title">
            Please enter the consultation fee.
          </DialogTitle>
          <DialogContent dividers>
            {/* <Typography gutterBottom> */}
            <Row>
              <Col xs={6}>
                <p>30 min Fee</p>
                <span className="currencyinput">
                  $
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0"
                    value={selectedUser.halfRate ? selectedUser.halfRate : ""}
                    onChange={(e) => handleHalfRateChange(e)}
                  />
                </span>
              </Col>
              <Col xs={6}>
                <p>1 Hour Fee</p>
                <span className="currencyinput">
                  $
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0"
                    value={selectedUser.rate ? selectedUser.rate : ""}
                    onChange={(e) => handleRateChange(e)}
                  />
                </span>
              </Col>
            </Row>
            {/* </Typography> */}
          </DialogContent>
          <DialogActions>
            <button
              type="submit"
              autoFocus
              className="btn btn-primary sign-btn"
            >
              OK
            </button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>

      <Dialog aria-labelledby="customized-dialog-title" open={uploadOpen}>
        <ValidatorForm onSubmit={() => handleFileUpload(selectedUser)}>
          <DialogTitle id="customized-dialog-title">
            Please upload Document for {selectedUser?.firstName}.
          </DialogTitle>
          <DialogContent dividers>
            {/* <Typography gutterBottom> */}
            <Row>
              <Col xs={12}>
                <p>Upload Document</p>
                <TextValidator
                  type="file"
                  name="file"
                  id="standard-input"
                  inputProps={{
                    multiple: true,
                  }}
                  onChange={(e) => handleFileChange(e)}
                  variant="filled"
                />
              </Col>
            </Row>
            {/* </Typography> */}
          </DialogContent>
          <DialogActions>
            <button
              type="submit"
              autoFocus
              className="btn btn-primary sign-btn"
            >
              Upload
            </button>
            <button
              type="button"
              autoFocus
              className="btn btn-info"
              onClick={handleUploadClose}
            >
              Close
            </button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
      {/* Activate / Diactivate Dialog */}

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
    </div >
  );
};

export default Home;
