import React from 'react';
//import ReactDOM from 'react-dom'
import { Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import UnprotectedRoutes from '../components/CommonModule/RoutesComponent/UnprotectedRoutes';
// import PaypalMobile from '../components/Patient Module/MobilePayment/PaypalMobile';

const Homepage = Loadable({
    loader: () => import('../components/Login-Module/Homepage'),
    loading: () => <div></div>
});
const Signin = Loadable({
    loader: () => import('../components/Login-Module/Signin'),
    loading: () => <div></div>
});
const ForgetPassword = Loadable({
    loader: () => import('../components/Login-Module/ForgetPassword'),
    loading: () => <div></div>
});
const CreatePassword = Loadable({
    loader: () => import('../components/Login-Module/CreatePassword'),
    loading: () => <div></div>
});
const Signup = Loadable({
    loader: () => import('../components/Signup Module/Signup'),
    loading: () => <div></div>
});
const Healthbehaviour = Loadable({
    loader: () => import('../components/Signup Module/Healthbehaviour'),
    loading: () => <div></div>
});
const Signupform = Loadable({
    loader: () => import('../components/Signup Module/Signupform'),
    loading: () => <div></div>
});
const AboutUs = Loadable({
    loader: () => import('../components/Login-Module/about-us'),
    loading: () => <div></div>
});

const ViewArticle = Loadable({
    loader: () => import('../components/Login-Module/ViewArticle'),
    loading: () => <div></div>
});

const PrivacyPolicyPage = Loadable({
    loader: () => import('../components/CommonModule/PrivacyPolicy'),
    loading: () => <div></div>
});

const TermsAndConditionsPage = Loadable({
    loader: () => import('../components/CommonModule/TermsAndConditions'),
    loading: () => <div></div>
});

const HelpAndSupportPage = Loadable({
    loader: () => import('../components/CommonModule/HelpAndSupport'),
    loading: () => <div></div>
});

const LicensesPage = Loadable({
    loader: () => import('../components/CommonModule/Licenses'),
    loading: () => <div></div>
});

const PartnersPage = Loadable({
    loader: () => import('../components/CommonModule/Partners'),
    loading: () => <div></div>
});
const SelectRolePage = Loadable({
    loader: () => import('../components/Signup Module/components/selectRole'),
    loading: () => <div></div>
});

const PaypalMob = Loadable({
    loader: () => import('../components/Patient Module/MobilePayment/PaypalMobile'),
    loading: () => <div></div>
});

const FAQPage = Loadable({
    loader: () => import('../components/CommonModule/FAQ/FAQ'),
    loading: () => <div></div>
})

const MainRoute = () => (
    <Switch>
        <UnprotectedRoutes exact path="/" component={Homepage} />
        <UnprotectedRoutes exact path="/signup" component={Signup} />
        <UnprotectedRoutes exact path="/signupform" component={Signupform} />
        <UnprotectedRoutes exact path="/healthbehaviour" component={Healthbehaviour} />
        <UnprotectedRoutes exact path="/signin" component={Signin} />
        <UnprotectedRoutes exact path="/forgetpassword" component={ForgetPassword} />
        <UnprotectedRoutes exact path="/createpassword" component={CreatePassword} />
        <UnprotectedRoutes exact path="/about-us" component={AboutUs} />
        <UnprotectedRoutes exact path="/article/:id" component={ViewArticle} />
        <UnprotectedRoutes exact path="/privacy-policy" component={PrivacyPolicyPage} />
        <UnprotectedRoutes exact path="/terms-and-conditions" component={TermsAndConditionsPage} />
        <UnprotectedRoutes exact path="/faq-page" component={FAQPage} />
        <UnprotectedRoutes exact path="/help-and-support" component={HelpAndSupportPage} />
        <UnprotectedRoutes exact path="/licenses" component={LicensesPage} />
        <UnprotectedRoutes exact path="/partners" component={PartnersPage} />
        <UnprotectedRoutes exact path="/select-role" component={SelectRolePage} />
        <UnprotectedRoutes exact path='/mobile-payment' component={(props) => <PaypalMob {...props} />} />
        <Redirect to='/signin' />
    </Switch>
);

export default MainRoute;