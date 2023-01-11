import React, { useEffect, useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Navbar from '../layout/Navbar'
import { LISTING_DATA, USER_DATA } from './demodata'
import './PromoCode.styles.css'
import PromocodeListing from './PromocodeListing'
import PromocodeUsers from './PromocodeUsers'
import { getPromocodeListing, manageCouponDetails, toggleCoupon } from '../../../service/frontendapiservices'
import { toast } from 'react-toastify'
import moment from 'moment';
import SearchBarComponent from '../../CommonModule/SearchAndFilter/SearchBarComponent';
import Pagination from "react-bootstrap/Pagination";
import Loader from '../../Loader/Loader';
const PromoCode = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [promoCodeListingData, setPromoCodeListingData] = useState([])
    const [manageCouponDetailsData, setManageCouponDetailsData] = useState([])
    const [promoCodeListingDataPagination, setPromoCodeListingDataPagination] = useState([])
    const [manageCouponDetailsDataPagination, setManageCouponDetailsDataPagination] = useState([])
    useEffect(() => {
        promoCodeListingDataFunction()
        // manageCouponDetailsFunction()
    }, [])
    const promoCodeListingDataFunction = async (size, page, searchKeyword) => {
        setIsLoading(true)
        setSearch('')
        setCurrentPageNumber(1)
        const res = await getPromocodeListing(size = '10', page = '0', searchKeyword = '').catch(err => {
            toast.error("Something went wrong.Please try again!")
            setIsLoading(false)
        })
        if (res) {
            const dataForPromocodeListing = res.data.data.couponUsageList
            setPromoCodeListingDataPagination(res.data.data)
            const promocodeListingArray = []
            if (dataForPromocodeListing) {
                dataForPromocodeListing.map((data) => {
                    promocodeListingArray.push({
                        id: data.slNo,
                        patientName: data.patientName,
                        patientId: data.patientId,
                        email: data.email,
                        promocodeType: data.promoCodeType,
                        doctorName: data.doctorName,
                        appointmentType: data.appointmentType,
                        appointmentDate: moment(data.appointmentDate).format("DD-MM-YYYY"),
                        startTime: moment(data.appointmentDate).format("HH:MM A"),
                    })
                })
            }
            setIsLoading(false)
            setPromoCodeListingData(promocodeListingArray)
        }
    }
    const manageCouponDetailsFunction = async () => {
        setIsLoading(true)
        setSearch('')
        setCurrentPageNumber(1)
        let size, page, searchKeyword
        const res = await manageCouponDetails(size = '10', page = '0', searchKeyword = '').catch(err => {
            toast.error("Something went wrong.Please try again!")
            setIsLoading(false)
        })
        if (res) {
            const dataForManageCoupon = res.data.data.content
            setManageCouponDetailsDataPagination(res.data.data)
            const manageCouponDataArray = []
            if (dataForManageCoupon) {
                dataForManageCoupon.map((data, index) => {
                    manageCouponDataArray.push({
                        id: index + 1,
                        patientName: data.firstName,
                        patientId: data.id,
                        email: data.email,
                        couponToggle: data.couponToggle
                    })
                })
            }
            setIsLoading(false)
            setManageCouponDetailsData(manageCouponDataArray)
        }
    }
    const [currentTab, setCurrentTab] = useState('listing')
    const clickTabEvent = async (event) => {
        setCurrentTab(event)
        if (event == 'listing') {
            promoCodeListingDataFunction()
        }
        else {
            manageCouponDetailsFunction()
        }
    }
    //Search
    const [search, setSearch] = useState('');
    const handleSearchInputChange = (searchValue) => {
        if (searchValue != "") {
            setSearch(searchValue);
            getGlobalSerachData(searchValue);
        }
        else {
            promoCodeListingDataFunction()
            manageCouponDetailsFunction()
        }
    };
    const getGlobalSerachData = async (search) => {
        let searchKeyword, size, page
        if (currentTab === 'listing') {
            const res = await getPromocodeListing(size = '10', page = '0', searchKeyword = search).catch(err => {
                toast.error("Something went wrong.Please try again!")
                setIsLoading(false)
            })
            if (res) {
                const dataForPromocodeListing = res.data.data.couponUsageList
                setPromoCodeListingDataPagination(res.data.data)
                const promocodeListingArray = []
                if (dataForPromocodeListing) {
                    dataForPromocodeListing.map((data) => {
                        promocodeListingArray.push({
                            id: data.slNo,
                            patientName: data.patientName,
                            patientId: data.patientId,
                            email: data.email,
                            promocodeType: data.promoCodeType,
                            doctorName: data.doctorName,
                            appointmentType: data.appointmentType,
                            appointmentDate: moment(data.appointmentDate).format("DD-MM-YYYY"),
                            startTime: moment(data.appointmentDate).format("HH:mm A"),
                        })
                    })
                }
                setPromoCodeListingData(promocodeListingArray)
            }
        } else {
            const res = await manageCouponDetails(size = '10', page = '0', searchKeyword = search).catch(err => {
                toast.error("Something went wrong.Please try again!")
                setIsLoading(false)
            })
            if (res) {
                const dataForManageCoupon = res.data.data.content
                setManageCouponDetailsDataPagination(res.data.data)
                const manageCouponDataArray = []
                if (dataForManageCoupon) {
                    dataForManageCoupon.map((data, index) => {
                        manageCouponDataArray.push({
                            id: index + 1,
                            patientName: data.firstName,
                            patientId: data.id,
                            email: data.email,
                            couponToggle: data.couponToggle
                        })
                    })
                }
                setManageCouponDetailsData(manageCouponDataArray)
            }
        }
    }
    //Pagination
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const clickPagination = async (pageNumber) => {
        setCurrentPageNumber(pageNumber);
        let page = pageNumber - 1;
        let size = 10;
        let data
        { search ? data = search : data = '' }
        if (currentTab === 'users') {
            const res = await manageCouponDetails(size, page, data)
            if (res) {
                const dataForManageCoupon = res.data.data.content
                setManageCouponDetailsDataPagination(res.data.data)
                const manageCouponDataArray = []
                if (dataForManageCoupon) {
                    dataForManageCoupon.map((data, index) => {
                        manageCouponDataArray.push({
                            id: index + 1,
                            patientName: data.firstName,
                            patientId: data.id,
                            email: data.email,
                            couponToggle: data.couponToggle
                        })
                    })
                }
                setManageCouponDetailsData(manageCouponDataArray)
            }
        }
        else {
            const res = await getPromocodeListing(size, page, data).catch(err => {
                toast.error("Something went wrong.Please try again!")
                setIsLoading(false)
            })
            if (res) {
                const dataForPromocodeListing = res.data.data.couponUsageList
                setPromoCodeListingDataPagination(res.data.data)
                const promocodeListingArray = []
                if (dataForPromocodeListing) {
                    dataForPromocodeListing.map((data) => {
                        promocodeListingArray.push({
                            id: data.slNo,
                            patientName: data.patientName,
                            patientId: data.patientId,
                            email: data.email,
                            promocodeType: data.promoCodeType,
                            doctorName: data.doctorName,
                            appointmentType: data.appointmentType,
                            appointmentDate: moment(data.appointmentDate).format("DD-MM-YYYY"),
                            startTime: moment(data.appointmentDate).format("HH:mm A"),
                        })
                    })
                }
                setPromoCodeListingData(promocodeListingArray)
            }
        }


    };
    //Toggle
    const handleToggle = async (e, data) => {
        const info = {
            patientId: data.patientId,
            //couponId: '2',
            toggle: e.target.checked
        }
        data.couponToggle = e.target.checked
        setManageCouponDetailsData([...manageCouponDetailsData])
        const res = await toggleCoupon(info).catch(err => {
            toast.error("Something went wrong.Please try again!")
        })
    }
    return (
        <div>
            {isLoading && (
                <Loader />
            )
            }
            <Navbar pageTitle="promocode" />
            <br />
            <div className='container'>
                <div className='row'>
                    <div className="col-md-12 col-sm-12 margin-large"><h1>Promocode Management</h1></div>
                    <div className="row md-1" style={{ paddingLeft: '70%' }}>
                        <SearchBarComponent
                            className="shadow p-1 mb-3 bg-white rounded"
                            updatedSearch={handleSearchInputChange}
                        />
                    </div>
                    <div className='col-md-12 col-sm-12'>
                        <br />
                        <Tabs
                            className="promocode-tabs mb-3"
                            defaultActiveKey="listing"
                            id="uncontrolled-tab-example"
                            onSelect={clickTabEvent}
                        >
                            <Tab eventKey="listing" title="Promocode Listing">
                                <PromocodeListing data={promoCodeListingData} pagination={promoCodeListingDataPagination} />
                            </Tab>

                            <Tab eventKey="users" title="Manage Users">
                                <PromocodeUsers data={manageCouponDetailsData} pagination={manageCouponDetailsDataPagination} toggle={handleToggle} />
                            </Tab>
                        </Tabs>
                        {currentTab === 'listing' ?
                            <Pagination size="sm" style={{ float: "right" }}>
                                {promoCodeListingDataPagination?.totalPages ? (
                                    Array.from(
                                        Array(promoCodeListingDataPagination.totalPages),
                                        (e, i) => {
                                            return (
                                                <Pagination.Item
                                                    key={i + 1}
                                                    active={i + 1 === currentPageNumber ? true : false}
                                                    onClick={(e) => clickPagination(i + 1)}
                                                >
                                                    {i + 1}
                                                </Pagination.Item>
                                            );
                                        }
                                    )
                                ) : (
                                    <span></span>
                                )}
                            </Pagination> :
                            <Pagination size="sm" style={{ float: "right" }}>
                                {manageCouponDetailsDataPagination?.totalPages ? (
                                    Array.from(
                                        Array(manageCouponDetailsDataPagination.totalPages),
                                        (e, i) => {
                                            return (
                                                <Pagination.Item
                                                    key={i + 1}
                                                    active={i + 1 === currentPageNumber ? true : false}
                                                    onClick={(e) => clickPagination(i + 1)}
                                                >
                                                    {i + 1}
                                                </Pagination.Item>
                                            );
                                        }
                                    )
                                ) : (
                                    <span></span>
                                )}
                            </Pagination>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PromoCode