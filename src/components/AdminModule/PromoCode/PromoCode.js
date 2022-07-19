import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Navbar from '../layout/Navbar'
import './PromoCode.styles.css'

const PromoCode = () => {
    return (
        <div>
            <Navbar pageTitle="promocode" />
            <br />
            <div className='container'>
                <div className='row'>
                    <div className="col-md-12 col-sm-12"><h1>Promocode Management</h1></div>
                    <div className='col-md-12 col-sm-12'>
                        <Tabs
                            className="promocode-tabs mb-3"
                            defaultActiveKey="listing"
                            id="uncontrolled-tab-example"
                        >
                            <Tab eventKey="listing" title="Promocode Listing">
                                <h3>Promocode Listing</h3>
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