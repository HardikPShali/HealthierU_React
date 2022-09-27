import React, { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import Table from '../components/Table/Table';
import { PAYMENT_DETAILS_TABLE_HEADERS } from './tableConstants';
import {
    consultationHistory,
    getAllPaymentDetailsForAdmin,
} from '../../../service/frontendapiservices';
import Pagination from '../../CommonModule/pagination';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import SearchBarComponent from '../../CommonModule/SearchAndFilter/SearchBarComponent';
import FilterPatientDetails from './FilterPatientDetails';
// import { FrontEndPagination } from './FrontEndPagination';

const PaymentDetails = () => {
    const tableHeaders = PAYMENT_DETAILS_TABLE_HEADERS;

    const [isLoading, setIsLoading] = useState(false);
    const [paymentDetailsData, setPaymentDetailsData] = useState([]);
    const [totalPagesData, setTotalPagesData] = useState(0);
    const [search, setSearch] = useState('');

    const [noDataFound, setNoDataFound] = useState(false);

    // GET PAYMENT DETAILS ON PAGE LOAD
    const getPaymentDetailsHandler = async (
        searchText,
        filter = {},
        page = 0,
        size = 20
    ) => {
        setIsLoading(true);
        const todayDate = moment()
            // .startOf('month')
            .toISOString();
        const dayBeforeFourMonth = moment()
            .clone()
            .subtract(4, 'months')
            .startOf('month')
            .toISOString();

        const data = {
            page: page,
            size: size,
            search: '',
            startTime: dayBeforeFourMonth, //2022-05-31T18:30:00.000Z  //dayBeforeFourMonth
            endTime: todayDate, //'2022-09-19T18:30:00.000Z'  //todayDate
        };

        if (searchText && searchText !== '') {
            data.search = searchText;
        }

        if (filter.patientStartTime && filter.patientStartTime !== '') {
            data.startTime = filter.patientStartTime.toISOString();
        }
        if (filter.patientEndTime && filter.patientEndTime !== '') {
            const endtime = new Date(filter.patientEndTime);
            endtime.setHours(23, 59, 59);
            data.endTime = endtime.toISOString();
        }

        const response = await getAllPaymentDetailsForAdmin(data).catch((err) => {
            console.log(err);
        });
        // console.log({ response });
        if (response.status === 200) {
            if (response.data.status === true) {
                const paymentDetailsFromresponse = response.data.data.content.map(
                    (paymentDetail) => {
                        paymentDetail.appointmentStartTime = moment(
                            paymentDetail.appointmentStartTime
                        ).format('DD-MM-YYYY HH:mm');
                        // paymentDetail.id = paymentDetail.appointmentId;
                        return paymentDetail;
                    }
                );
                // console.log({
                //     paymentDetailsFromresponse: paymentDetailsFromresponse.length,
                // });
                const totalPages = response.data.data.totalPages;
                // console.log({ totalPages })
                // console.log({ paymentDetailsFromresponse })
                setPaymentDetailsData(paymentDetailsFromresponse);
                setTotalPagesData(totalPages);
                setIsLoading(false);

                setNoDataFound(false);

                if (paymentDetailsFromresponse.length === 0) {
                    setNoDataFound(true);
                }
            }

            if (response.data.status === false) {
                toast.info(`${response.data.message} after this page`, {
                    toastId: 'endOfPages',
                    hideProgressBar: true,
                    autoClose: 2000,
                });
            }
        }
        setIsLoading(false);
    };

    //SEARCH BY DOC
    const handleSearchInputChange = async (searchValue) => {
        //console.log("searchValue :::::::", searchValue);
        if (searchValue === '') {
            console.log('blank searchValue is | in SearchBarComponent', searchValue);
            setSearch('');
            getPaymentDetailsHandler(searchValue);
        } else {
            setSearch(searchValue);
            getPaymentDetailsHandler(searchValue);
            // console.log("searchValue is | in SearchBarComponent", searchValue);
        }
    };

    //FILTER BY APPOINTMENT START TIME
    const handleFilterChange = (filter) => {
        getPaymentDetailsHandler(search, filter);
    };

    //PAGINATION FROM FRONTEND
    // const [currentPage, setCurrentPage] = useState(1);
    // const [dataPerPage, setDataPerPage] = useState(15);

    // const indexOfLastData = currentPage * dataPerPage;
    // const indexOfFirstData = indexOfLastData - dataPerPage;
    // const currentData = paymentDetailsData.slice(indexOfFirstData, indexOfLastData);

    // const clickPaginationHandler = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    // useEffect(() => {
    //     getPaymentDetailsHandler();
    // }, []);

    //PAGINATION FROM BACKEND
    const [currentPage, setCurrentPage] = useState(0);
    const clickPaginationHandler = async (pageNumber) => {
        setCurrentPage(pageNumber);
        const size = 10;
        // console.log({ pageNumber })
        getPaymentDetailsHandler('', {}, pageNumber, size);
    };

    useEffect(() => {
        getPaymentDetailsHandler();
    }, []);

    //EXPORT TO CSV LOGIC
    const csvHeaders = PAYMENT_DETAILS_TABLE_HEADERS;

    //NO DATA FOUND STYLES
    const noDataFoundStyle = {
        fontSize: 18,
        fontWeight: 500,
    };

    return (
        <div>
            {/* {isLoading && <Loader />} */}
            <Navbar pageTitle="paymentDets" />
            <br />
            <div className="container">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 pb-3">
                            <h1>Payment Details Management</h1>
                        </div>
                        {/* <div className="col-md-2"></div> */}
                        <div className="d-flex justify-content-between ">
                            <SearchBarComponent
                                className="shadow p-1 mb-3 bg-white rounded"
                                updatedSearch={handleSearchInputChange}
                            />{' '}
                        </div>
                        <div className="ml-2">
                            <FilterPatientDetails updatedFilter={handleFilterChange} />{' '}
                            {/* updatedFilter={handleFilterChange} */}
                        </div>

                        <div
                            className="col-md-8 col-sm-8 pb-2 ml-4 mt-1"
                            style={{ textAlign: 'right' }}
                        >
                            <CSVLink
                                data={paymentDetailsData}
                                filename={'Payment_Details_HealthierU.csv'}
                                className="btn btn-primary"
                                target="_blank"
                                headers={csvHeaders}
                            >
                                Export as CSV
                            </CSVLink>
                        </div>

                        <div className="col-md-12">
                            <Table
                                headers={tableHeaders}
                                data={paymentDetailsData}
                                isLoading={isLoading}
                            ></Table>
                            {noDataFound && (
                                <div className="text-center">
                                    <span style={noDataFoundStyle}>No Data Found</span>
                                </div>
                            )}
                        </div>
                        {/* <div className="col-md-2"></div> */}
                    </div>
                    {/* PAGINATION FROM BACKEND */}

                    <Pagination
                        total={totalPagesData}
                        current={currentPage + 1}
                        pagination={(currPage) => clickPaginationHandler(currPage - 1)}
                    />
                    {/* PAGINATION FROM FRONTEND */}
                    {/* <div style={{
                        marginLeft: 15
                    }}>
                        <FrontEndPagination
                            totalData={paymentDetailsData.length}
                            dataPerPage={dataPerPage}
                            paginate={clickPaginationHandler}
                        />
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;
