import React, { useState } from 'react'
import Table from '../components/Table/Table';
import { PROMOCODE_USER_TABLE_HEADERS } from './tableConstants';

const PromocodeUsers = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const tableHeaders = PROMOCODE_USER_TABLE_HEADERS;

    // const handleToggle = (e, eachTimes) => {
    //     eachTimes.active = e.target.checked;
    //     const data = {
    //         id: eachTimes.id,
    //         active: e.target.checked
    //     }
    //     console.log({ data });
    // }

    return (
        <div className='promocode-listing-view'>
            <div className='row'>
                <div className='col-md-12'>
                    <Table
                        headers={tableHeaders}
                        data={data}
                        isLoading={isLoading}
                    // handleToggle={(e) => handleToggle(e)}
                    ></Table>
                </div>
            </div>
        </div>
    )
}

export default PromocodeUsers