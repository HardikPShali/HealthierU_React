import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Navbar from '../layout/Navbar'
import { LISTING_DATA, USER_DATA } from './demodata'
import './PromoCode.styles.css'
import PromocodeListing from './PromocodeListing'
import PromocodeUsers from './PromocodeUsers'
import { getPromocodeListing, manageCouponDetails } from '../../../service/frontendapiservices'
import { toast } from 'react-toastify'
const PromoCode = () => {
    const [promoCodeListingDataRes, setPromocodeListingDataRes] = useState([])
    const [manageCouponDetailsData, setManageCouponDetailsData] = useState([])
    const promoCodeListingData = LISTING_DATA;
    useEffect(() => {
        promoCodeListingDataFunction()
        manageCouponDetailsFunction()
    }, [])
    const promocodeUsersData = USER_DATA;
    const promoCodeListingDataFunction = async () => {
        const res = await getPromocodeListing().catch(err => {
            toast.error("Something went wrong.Please try again!")
        })
        if (res) {
            const dataForPromocodeListing = res.data.data.content
            const promocodeListingArray = []
            dataForPromocodeListing.map((data) => {
                promocodeListingArray.push({
                    id: data.id,
                    patientName: data.patientName,
                    patientId: data.patientId,
                    promocodeType: data.promocodeType,
                    doctorName: data.doctorName,
                    appointmentType: data.appointmentType,
                    appointmentDate: data.appointmentDate,
                    startTime: data.startTime,
                })
            })
            setPromocodeListingDataRes(promocodeListingArray)
        }
    }
    const manageCouponDetailsFunction = async () => {
        const res = await manageCouponDetails().catch(err => {
            toast.error("Something went wrong.Please try again!")
        })
        if (res) {
            const dataForManageCoupon = res.data.data.content
            const manageCouponDataArray = []
            dataForManageCoupon.map((data) => {
                manageCouponDataArray.push({
                    // id: data.id,
                    patientName: data.firstName,
                    patientId: data.id,
                    couponToggle: data.couponToggle
                })
            })
            setManageCouponDetailsData(manageCouponDataArray)
        }
    }
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
                                <PromocodeUsers data={manageCouponDetailsData} />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCode