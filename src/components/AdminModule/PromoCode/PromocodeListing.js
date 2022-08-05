import React, { useEffect, useState } from 'react'
import Table from '../components/Table/Table';
import { PROMOCODE_LISTING_TABLE_HEADERS } from './tableConstants';
import Pagination from "react-bootstrap/Pagination";
const PromocodeListing = ({ data, pagination }) => {
    const [isLoading, setIsLoading] = useState(false);
    const tableHeaders = PROMOCODE_LISTING_TABLE_HEADERS;
    return (
        <div className='promocode-listing-view'>
            <div className='row'>
                <div className='col-md-12'>
                    {data.length > 0 ?
                        <Table
                            headers={tableHeaders}
                            data={data}
                            isLoading={isLoading}
                        ></Table>
                        : (
                            <div
                                className="col-12 ml-2"
                                style={{ textShadow: "none", color: "#3e4543", textAlign: 'center', marginTop: '15%' }}
                            >
                                No Data Found
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default PromocodeListing