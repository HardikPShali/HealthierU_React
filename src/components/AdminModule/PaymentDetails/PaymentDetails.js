import React, { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import Table from '../components/Table/Table';
import {
    PAYMENT_DETAILS_TABLE_HEADERS,
} from './tableConstants';
import { getAllPaymentDetailsForAdmin } from '../../../service/frontendapiservices';
import Pagination from "../../CommonModule/pagination";
import { toast } from 'react-toastify';
import moment from 'moment';


const PaymentDetails = () => {
    const tableHeaders = PAYMENT_DETAILS_TABLE_HEADERS;

    const [isLoading, setIsLoading] = useState(false);
    const [paymentDetailsData, setPaymentDetailsData] = useState([]);
    const [totalPagesData, setTotalPagesData] = useState(0);

    // GET PAYMENT DETAILS ON PAGE LOAD
    const getPaymentDetailsHandler = async (page, size) => {
        setIsLoading(true);
        const response = await getAllPaymentDetailsForAdmin(page, size).catch(err => {
            console.log(err);
        })
        console.log({ response });
        if (response.status === 200) {
            if (response.data.status === true) {
                const paymentDetailsFromresponse = response.data.data.content.map(paymentDetail => {
                    paymentDetail.startTime = moment(paymentDetail.startTime).format('DD-MM-YYYY HH:mm');
                    paymentDetail.id = paymentDetail.appointmentId;
                    return paymentDetail;
                })
                const totalPages = response.data.data.totalPages;
                // console.log({ totalPages })
                // console.log({ paymentDetailsFromresponse })
                setPaymentDetailsData(paymentDetailsFromresponse);
                setTotalPagesData(totalPages);
                setIsLoading(false);
            }

            if (response.data.status === false) {
                toast.info(`${response.data.message} after this page`, {
                    toastId: 'endOfPages',
                    hideProgressBar: true,
                });

            }
        }
        setIsLoading(false);
    }

    //PAGINATION
    const [currentPage, setCurrentPage] = useState(0);
    const clickPaginationHandler = async (pageNumber) => {
        setCurrentPage(pageNumber);
        const size = 10;
        // console.log({ pageNumber })
        getPaymentDetailsHandler(pageNumber, size);
    }

    useEffect(() => {
        getPaymentDetailsHandler(0, 10);
    }, []);

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
                        <div className="col-md-12">
                            <Table
                                headers={tableHeaders}
                                data={paymentDetailsData}
                                isLoading={isLoading}
                            ></Table>
                        </div>
                        {/* <div className="col-md-2"></div> */}
                    </div>
                    <Pagination
                        total={totalPagesData}
                        current={currentPage + 1}
                        pagination={(currPage) => clickPaginationHandler(currPage - 1)}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;
