import React, { useEffect, useState } from 'react';
import mail from '../../images/logo/mail.svg';
import { Link } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import Header from '../Login-Module/Header'
import Footer from '../Login-Module/Footer'
import '../Login-Module/landing.css';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from './../Loader/Loader';
import Cookies from 'universal-cookie';
import { handleGoogleAuth } from './../../service/googleapiservice';
import { getCurrentUserInfo } from '../../service/AccountService';
import LocalStorageService from './../../util/LocalStorageService';
import { GOOGLECLIENTID } from '../../util/configurations';
import gmailIcon from '../../images/icons used/gmailIcon.png';

const Signup = () => {

  const [loading, setLoading] = useState(true);
  const cookies = new Cookies();
  useEffect(() => {
    cookies.remove("GOOGLE_ACCESS_TOKEN");
    cookies.remove("GOOGLE_PROFILE_DATA");
    setTimeout(() => setLoading(false), 1000);
  }, []);
  const failureResponseGoogle = async (response) => {
    //console.log(response);
  }
  const responseGoogle = async (response) => {
    //console.log(response.tokenId);
    //console.log(response.profileObj);
    cookies.set("GOOGLE_ACCESS_TOKEN", response.tokenId);
    cookies.set("GOOGLE_PROFILE_DATA", response.profileObj);
    const googleUserData = {
      token: response.tokenId
    }
    const googleAccessToken = await handleGoogleAuth(googleUserData);
    if (googleAccessToken) {
      //console.log("googleAccessToken  :: ", googleAccessToken);
      LocalStorageService.setToken(googleAccessToken);

      const currentUserInformation = await getCurrentUserInfo();
      cookies.set('currentUser', currentUserInformation);
      const currentLoggedInUser = cookies.get("currentUser");
      const {authorities =[] } = currentLoggedInUser || {}

      if (authorities.some((user) => user === "ROLE_PATIENT")) {
        window.location.assign('/patient');
      }
      if (authorities.some((user) => user === "ROLE_DOCTOR")) {
        window.location.assign('/doctor');
      }
    }
  }

  return (
    <div>
      {loading && (
        <Loader />
      )}
      <Header />
      <Container id="signup-bg">
        <Row>
          <Col md={7}></Col>
          <Col md={5}>
            <h2 id="signin-title">
              Sign up
                            </h2>
            <div className="sign-box">
              <Link to="/signupform"><button className="btn btn-light sign-btn"><img src={mail} alt="" className="sub" width="54px" />Sign up with email</button></Link>
              <p className="text-divider"><span>or</span></p>
              <GoogleLogin
                clientId={GOOGLECLIENTID}
                render={renderProps => (
                  <button
                    className="btn google-signup"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}>
                    <img src={gmailIcon} alt="" className="sub" width="54px" /> Sign Up with Google
                  </button>
                )}
                buttonText="Sign up with Google"
                className="google-signup"
                onSuccess={(res) => responseGoogle(res)}
                onFailure={(res) => failureResponseGoogle(res)}
                cookiePolicy={'single_host_origin'}

              />
              <p className="signup-text">Already a member?</p>
              <Link to="/signin"><button className="btn btn-outline-primary sign-btn">Sign In</button></Link>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default Signup;
