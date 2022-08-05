import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Navbar from '../layout/Navbar'
import { LISTING_DATA, USER_DATA } from './demodata'
import './PromoCode.styles.css'
import PromocodeListing from './PromocodeListing'
import PromocodeUsers from './PromocodeUsers'
import { getPromocodeListing, manageCouponDetails } from '../../../service/frontendapiservices'
import { toast } from 'react-toastify'
import moment from 'moment';
const PromoCode = () => {
    const [promoCodeListingData, setPromoCodeListingData] = useState([])
    const [manageCouponDetailsData, setManageCouponDetailsData] = useState([])
    const [promoCodeListingDataPagination, setPromoCodeListingDataPagination] = useState([])
    const [manageCouponDetailsDataPagination, setManageCouponDetailsDataPagination] = useState([])
    useEffect(() => {
        promoCodeListingDataFunction()
        manageCouponDetailsFunction()
    }, [])
    const promoCodeListingDataFunction = async () => {
        const res = await getPromocodeListing().catch(err => {
            toast.error("Something went wrong.Please try again!")
        })
        if (res) {
            const dataForPromocodeListing = res.data.data.content
            setPromoCodeListingDataPagination(res.data.data)
            const promocodeListingArray = []
            dataForPromocodeListing.map((data) => {
                promocodeListingArray.push({
                    id: data.slNo,
                    patientName: data.patientName,
                    patientId: data.patientId,
                    promocodeType: data.promoCodeType,
                    doctorName: data.doctorName,
                    appointmentType: data.appointmentType,
                    appointmentDate: moment(data.appointmentDate).format("DD-MM-YYYY"),
                    startTime: moment(data.appointmentDate).format("HH:MM"),
                })
            })
            setPromoCodeListingData(promocodeListingArray)
        }
    }
    const manageCouponDetailsFunction = async () => {
        const res = await manageCouponDetails().catch(err => {
            toast.error("Something went wrong.Please try again!")
        })
        if (res) {
            const dataForManageCoupon = res.data.data.content
            setManageCouponDetailsDataPagination(res.data.data)
            const manageCouponDataArray = []
            dataForManageCoupon.map((data, index) => {
                manageCouponDataArray.push({
                    id: index + 1,
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
                                <PromocodeListing data={promoCodeListingData} pagination={promoCodeListingDataPagination} />
                            </Tab>

                            <Tab eventKey="users" title="Manage Users">
                                <PromocodeUsers data={manageCouponDetailsData} pagination={manageCouponDetailsDataPagination} />
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCode