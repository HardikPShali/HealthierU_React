import React, { useState } from 'react'
import Table from '../components/Table/Table';
import { PROMOCODE_USER_TABLE_HEADERS } from './tableConstants';
import Pagination from "react-bootstrap/Pagination";
const PromocodeUsers = ({ data, pagination }) => {
    const [isLoading, setIsLoading] = useState(false);
    const tableHeaders = PROMOCODE_USER_TABLE_HEADERS;

    return (
        <div className='promocode-listing-view'>
            <div className='row'>
                <div className='col-md-12'>
                    <Table
                        headers={tableHeaders}
                        data={data}
                        isLoading={isLoading}
                    //handleToggle={(e) => handleToggle(e, data.id)}
                    ></Table>
                    <Pagination size="sm" style={{ float: "right" }}>
                        {pagination?.totalPages ? (
                            Array.from(
                                Array(pagination.totalPages),
                                (e, i) => {
                                    return (
                                        <Pagination.Item
                                            key={i + 1}
                                        //active={i + 1 === currentPageNumber ? true : false}
                                        // onClick={(e) => clickPagination(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    );
                                }
                            )
                        ) : (
                            <span></span>
                        )}
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default PromocodeUsers