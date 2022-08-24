import React, { useEffect, useState } from "react";
import mail from "../../images/logo/mail.svg";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import Header from "../Login-Module/Header";
import Footer from "../Login-Module/Footer";
import "../Login-Module/landing.css";
import { Container, Row, Col } from "react-bootstrap";
import Loader from "./../Loader/Loader";
import Cookies from "universal-cookie";
import { handleGoogleAuth } from "./../../service/googleapiservice";
import { getCurrentUserInfo } from "../../service/AccountService";
import LocalStorageService from "./../../util/LocalStorageService";
import { GOOGLECLIENTID } from "../../util/configurations";
import gmailIcon from "../../images/icons used/gmailIcon.png";
import { useHistory } from "react-router-dom";
import GoogleSignInButton from "../CommonModule/GoogleAuth/GoogleSignInButton/GoogleSignInButton";

const Signup = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(0);

  const cookies = new Cookies();
  useEffect(() => {
    const width = document.getElementById("signupBtn").clientWidth;
    setGoogleBtnWidth(width);

    cookies.remove("GOOGLE_ACCESS_TOKEN");
    cookies.remove("GOOGLE_PROFILE_DATA");
    setTimeout(() => setLoading(false), 1000);
  }, []);
  const failureResponseGoogle = async (response) => {
    //console.log(response);
  };
  const storeGoogleToken = (response) => {
    cookies.set("GOOGLE_ACCESS_TOKEN", response.credential, { path: '/' });
    cookies.set("GOOGLE_PROFILE_DATA", response.profileObj, { path: '/' });
    history.push("/signupform");
  };
  const responseGoogle = async (response) => {
    console.log(response.tokenId);
    console.log(response.profileObj);
    cookies.set("GOOGLE_ACCESS_TOKEN", response.tokenId, { path: '/' });
    cookies.set("GOOGLE_PROFILE_DATA", response.profileObj, { path: '/' });
    const googleUserData = {
      token: response.tokenId,
    };
    const googleAccessToken = await handleGoogleAuth(googleUserData, history);
    if (googleAccessToken) {
      console.log("googleAccessToken  :: ", googleAccessToken);
      LocalStorageService.setToken(googleAccessToken);

      const currentUserInformation = await getCurrentUserInfo();
      cookies.set("currentUser", currentUserInformation.data.userInfo, { path: '/' });
      const currentLoggedInUser = cookies.get("currentUser");
      const { authorities = [] } = currentLoggedInUser || {};

      if (authorities.some((user) => user === "ROLE_PATIENT")) {
        history.push("/patient");
      }
      if (authorities.some((user) => user === "ROLE_DOCTOR")) {
        history.push("/doctor");
      }
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <Header hideButton={true} />
      <Container id="signup-bg">
        <Row>
          <Col md={7}></Col>
          <Col md={5}>
            <h2 id="signin-title">Sign up</h2>
            <div className="sign-box signup-box-helper">
              <Link to="/signupform">
                <button
                  id="signupBtn"
                  className="btn btn-primary w-100 py-2 pl-2 sign-btn shadow-sm"
                >
                  <div className="signup-btnWrap">
                    <img
                      src={mail}
                      alt=""
                      className="sub signUp_icon"
                    />
                    Sign up with email
                  </div>


                </button>
              </Link>
              <p className="text-divider">
                <span>or</span>
              </p>

              {/* <GoogleLogin
                clientId={GOOGLECLIENTID}
                render={renderProps => (
                  <button
                    className="btn google-signup shadow-sm"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}>
                    <img src={gmailIcon} alt="" className="sub" width="54px" /> Sign Up with Google
                  </button>
                )}
                buttonText="Sign up with Google"
                className="google-signup"
                onSuccess={(res) => storeGoogleToken(res)}
                onFailure={(res) => failureResponseGoogle(res)}
                cookiePolicy={'single_host_origin'}

              /> */}
              <div className="w-100 mt-3">
                {googleBtnWidth > 0 && (
                  <GoogleSignInButton
                    id="google-signup-btn"
                    width={googleBtnWidth}
                    autoSelect={false}
                    text="signup_with"
                    context="signup"
                    responseCallBack={storeGoogleToken}
                    responseError={(e) => console.log(e)}
                  />
                )}
              </div>
              <p className="signup-text">Already a member?</p>
              <Link className="w-100 d-block" to="/signin">
                <button className="w-100 btn btn-primary sign-btn shadow-sm">
                  Sign In
                </button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};
export default Signup;
