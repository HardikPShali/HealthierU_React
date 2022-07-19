import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Navbar from '../layout/Navbar'
import { LISTING_DATA } from './demodata'
import './PromoCode.styles.css'
import PromocodeListing from './PromocodeListing'

const PromoCode = () => {

    const promoCodeListingData = LISTING_DATA

    return (
        <div>
            <Navbar pageTitle="promocode" />
            <br />
            <div className='container'>
                <div className='row'>
                    <div className="col-md-12 col-sm-12 margin-large"><h1>Promocode Management</h1></div>
                    <div className='col-md-12 col-sm-12'>
                        <Tabs
                            className="promocode-tabs mb-3"
                            defaultActiveKey="listing"
                            id="uncontrolled-tab-example"
                        >
                            <Tab eventKey="listing" title="Promocode Listing">
                                <PromocodeListing data={promoCodeListingData} />
                            </Tab>

                            <Tab eventKey="users" title="Manage Users">
                                <h3>Manage Users</h3>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCode