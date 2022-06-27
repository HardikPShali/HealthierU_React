import React, { useState, useEffect } from 'react'
import './Newsletter.css'
import validator from 'validator';

const Newsletter = () => {

    const [email, setEmail] = useState('');
    const [emailSubmit, setEmailSubmit] = useState(false);
    const [emailError, setEmailError] = useState(false);

    const newsletterEmailInputHandler = (event) => {
        setEmail(event.target.value);
        setEmailError(false);
    }

    const newsletterSubmithandler = () => {
        console.log(email);
        if (validator.isEmail(email)) {
            setEmailSubmit(true);
            setEmail('');
        }
        else {
            setEmailError(true);
        }
    }

    useEffect(() => {
        return () => {
            setTimeout(() => {
                setEmailSubmit(false);
            }, 3000)
        };
    }, [emailSubmit])

    return (
        <>
            <p>Email Newsletters</p>
            <p style={{ fontSize: 11 }}>
                Stay up-to-date with the latest content and offers from
                HealthierU
            </p>
            <form>
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    id="footer-input"
                    value={email}
                    onChange={(e) => newsletterEmailInputHandler(e)}

                />
                <input
                    defaultValue="Subscribe"
                    className="btn submit-btn"
                    onClick={() => newsletterSubmithandler()}
                />
                {
                    emailSubmit && (
                        <span className='subscription-message'>Thanks for subscribing to our newsletter</span>
                    )
                }
                {
                    emailError && (
                        <span className='subscription-message'>Please enter a valid email address</span>
                    )
                }
            </form>
        </>
    )
}

export default Newsletter