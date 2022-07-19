import React, { useState } from 'react'
import Table from '../components/Table/Table';
import { PROMOCODE_LISTING_TABLE_HEADERS } from './tableConstants';

const PromocodeListing = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const tableHeaders = PROMOCODE_LISTING_TABLE_HEADERS;

    return (
        <div className='promocode-listing-view'>
            <div className='row'>
                <div className='col-md-12'>
                    <Table
                        headers={tableHeaders}
                        data={data}
                        isLoading={isLoading}
                    ></Table>
                </div>
            </div>

        </div>
    )
}

export default PromocodeListing