import React, { useState } from 'react';
import Navbar from '../layout/Navbar';
import Loader from '../../Loader/Loader';
import Table from '../components/Table/Table';
import {
    PAYMENT_DETAILS_TABLE_HEADERS,
    TABLE_MOCK_DATA,
} from './tableConstants';

const PaymentDetails = () => {
    const tableHeaders = PAYMENT_DETAILS_TABLE_HEADERS;
    const data = TABLE_MOCK_DATA;

    const [isLoading, setIsLoading] = useState(false);

    return (
        <div>
            {isLoading && <Loader />}
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
                                data={data}
                                isLoading={isLoading}
                            ></Table>
                        </div>
                        {/* <div className="col-md-2"></div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetails;
