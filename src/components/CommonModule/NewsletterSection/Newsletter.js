import React, { useState, useEffect } from 'react';
import './Newsletter.css';
import validator from 'validator';
import { postNewsletterEmailApi } from '../../../service/frontendapiservices';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [emailSubmit, setEmailSubmit] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [authorisedError, setAuthorisedError] = useState(false);

  const newsletterEmailInputHandler = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
  };

  const postNewsletterEmail = async (email) => {
    try {
      const response = await postNewsletterEmailApi(email);
      console.log({ response });

      if (
        response.data.message === 'Email Added' ||
        response.data.status === 'true'
      ) {
        setEmailSubmit(true);
      }
    } catch (err) {
      console.log({
        err,
      });
      if (err.response.data.error === 'invalid_token') {
        setAuthorisedError(true);
        setEmailSubmit(false);
      }
    }
  };

  const newsletterSubmitHandler = (e) => {
    console.log(email);
    e.preventDefault();
    if (validator.isEmail(email)) {
      postNewsletterEmail(email);
      setEmail('');
    } else {
      setEmailError(true);
    }
  };

  useEffect(() => {
    return () => {
      setTimeout(() => {
        setEmailSubmit(false);
      }, 3000);
    };
  }, [emailSubmit]);

  return (
    <>
      <p> Email Newsletters </p>
      <p
        style={{
          fontSize: 11,
        }}
      >
        Stay up - to - date with the latest content and offers from HealthierU
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
          value='Subscribe'
          type='submit'
          className="btn submit-btn"
          onClick={(e) => newsletterSubmitHandler(e)}
        />
        {emailSubmit && (
          <span className="subscription-message">

            Thanks for subscribing to our newsletter
          </span>
        )}
        {emailError && (
          <span className="subscription-message">

            Please enter a valid email address
          </span>
        )}
        {authorisedError && (
          <span className="subscription-message">

            Please sign in to subscribe to our newletters
          </span>
        )}
      </form>
    </>
  );
};

export default Newsletter;
