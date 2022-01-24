import React from 'react';
//import ReactDOM from 'react-dom'
import {Switch, Route, Redirect} from 'react-router-dom';
import Loadable from 'react-loadable';

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

const MainRoute = () => (
  <Switch>
    <Route exact path="/" component={Homepage} />
    <Route exact path="/signup" component={Signup} />
    <Route exact path="/signupform" component={Signupform} />   
    <Route exact path="/healthbehaviour" component={Healthbehaviour} />
    <Route exact path="/signin" component={Signin} />
    <Route exact path="/forgetpassword" component={ForgetPassword} />
    <Route exact path="/createpassword" component={CreatePassword} />
    <Route exact path="/about-us" component={AboutUs} />
    <Route exact path="/article/:id" component={ViewArticle} />
    
    <Redirect to='/signin'/>
  </Switch>
  );
  
  export default MainRoute;