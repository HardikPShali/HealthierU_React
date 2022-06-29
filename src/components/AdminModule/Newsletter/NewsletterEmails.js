import React, { useState } from 'react'
import { useEffect } from 'react';
import { getNewsletterEmailApi } from '../../../service/adminbackendservices';
import './NewsletterEmail.scss'
import Table from '../components/Table/Table';
import Navbar from '../layout/Navbar'
import { CSVLink } from 'react-csv';

const NewsletterEmails = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [newsletterEmails, setNewsletterEmails] = useState([]);

    const csvHeaders = [
        { label: 'Sr. No.', key: 'id' },
        { label: 'Email', key: 'email' },
    ]

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

    const csvReport = {
        filename: 'NewsletterEmails.csv',
        headers: csvHeaders,
        data: newsletterEmails
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
                        {/* <button className='btn btn-primary'> */}
                        <CSVLink
                            data={newsletterEmails}
                            filename={"NewsletterEmails.csv"}
                            className="btn btn-primary"
                            target="_blank"
                            headers={csvHeaders}
                        >
                            Export as CSV
                        </CSVLink>
                        {/* </button> */}
                    </div>
                </div>
                <div className='newsletter-email-container'>
                    <div className='newsletter-email-container__table'>
                        <Table
                            headers={tableHeaders}
                            data={newsletterEmails}
                            isLoading={isLoading}
                        ></Table>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default NewsletterEmails