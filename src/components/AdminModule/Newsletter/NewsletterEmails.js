import React, { useState } from 'react'
import { useEffect } from 'react';
import { getNewsletterEmailApi } from '../../../service/adminbackendservices';
import TransparentLoader from '../../Loader/transparentloader'
import Table from '../components/Table/Table';
import Navbar from '../layout/Navbar'

const NewsletterEmails = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [newsletterEmails, setNewsletterEmails] = useState([]);

    const tableHeaders = [
        {
            label: "Sr.",
            key: "id",
        },
        {
            label: "Email",
            key: "email",
        }
    ]

    const getNewsletterEmailsHandler = async () => {
        const response = await getNewsletterEmailApi().catch(err => {
            console.log(err)
        });

        if (response.status === 200) {
            setNewsletterEmails(response.data.data)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getNewsletterEmailsHandler()
    }, [])

    return (
        <div>
            <Navbar pageTitle="newsletter" />
            <br />
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-sm-6"><h1>Newsletter Emails</h1></div>
                    <div className="col-md-6 col-sm-6 pr-0" style={{ textAlign: "right" }}>
                        <button className='btn btn-primary'>Export as CSV</button>
                    </div>
                </div>
                <Table
                    headers={tableHeaders}
                    data={newsletterEmails}
                    isLoading={isLoading}
                ></Table>
            </div>
        </div>
    )
}

export default NewsletterEmails