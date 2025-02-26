import { Switch, Route } from 'react-router-dom';
import React from "react";
import Loadable from 'react-loadable';
import Loader from '../Loader/Loader';
//import Cookies from 'universal-cookie';
const Home = Loadable({
    loader: () => import('./user-management/home'),
    loading: () => <div><Loader /></div>
});

const AdminDocument = Loadable({
    loader: () => import('./user-management/fille-upload/AdminDocument'),
    loading: () => <div><Loader /></div>
});

const AddUser = Loadable({
    loader: () => import('./user-management/adduser'),
    loading: () => <div><Loader /></div>
});
//const Users = Loadable({
//   loader: () => import('./user-management/user'),
//   loading: () => <div></div>
//});
const EditUser = Loadable({
    loader: () => import('./user-management/edituser'),
    loading: () => <div><Loader /></div>
});
const Logout = Loadable({
    loader: () => import('../Logout'),
    loading: () => <div><Loader /></div>
});


const HomeQuestionnaire = Loadable({
    loader: () => import('./questionnaire/Home'),
    loading: () => <div><Loader /></div>
});

const AddQuestionnaire = Loadable({
    loader: () => import('./questionnaire/AddQuestionnaire'),
    loading: () => <div><Loader /></div>
});

const EditQuestionnaire = Loadable({
    loader: () => import('./questionnaire/EditQuestionnaire'),
    loading: () => <div><Loader /></div>
});

const HomeShop = Loadable({
    loader: () => import('./shop/Home'),
    loading: () => <div><Loader /></div>
});

const AddShop = Loadable({
    loader: () => import('./shop/AddShop'),
    loading: () => <div><Loader /></div>
});

const EditShop = Loadable({
    loader: () => import('./shop/EditShop'),
    loading: () => <div><Loader /></div>
});

const EditSubCategory = Loadable({
    loader: () => import('./shop/Editsubcategory'),
    loading: () => <div><Loader /></div>
})

const HomeArticle = Loadable({
    loader: () => import('./article/Home'),
    loading: () => <div><Loader /></div>
});

const AddArticle = Loadable({
    loader: () => import('./article/AddArticle'),
    loading: () => <div><Loader /></div>
});


const EditArticle = Loadable({
    loader: () => import('./article/EditArticle'),
    loading: () => <div><Loader /></div>
});


const PatientChatNew = Loadable({
    loader: () => import('../Patient Module/PatientChatNew'),
    loading: () => <div><Loader /></div>
});
const ServiceProvider = Loadable({
    loader: () => import('./user-management/addservice-provider'),
    loading: () => <div><Loader /></div>
});

const GlobalSearch = Loadable({
    loader: () => import('./globalsearch'),
    loading: () => <div><Loader /></div>
});

const WorkoutHome = Loadable({
    loader: () => import('./workout/home'),
    loading: () => <div><Loader /></div>
});

const AddWorkout = Loadable({
    loader: () => import('./workout/addworkout'),
    loading: () => <div><Loader /></div>
});

const EditWorkout = Loadable({
    loader: () => import('./workout/editworkout'),
    loading: () => <div><Loader /></div>
});

const ChangeAccountPassword = Loadable({
    loader: () => import('./changepassword'),
    loading: () => <div><Loader /></div>
});

const DoctorList = Loadable({
    loader: () => import('./user-management/doctorlist'),
    loading: () => <div><Loader /></div>
});

const PatientList = Loadable({
    loader: () => import('./user-management/patientlist'),
    loading: () => <div><Loader /></div>
});

const ServiceProvidersHome = Loadable({
    loader: () => import('./service-provider/home'),
    loading: () => <div><Loader /></div>
});

const AddServiceProvider = Loadable({
    loader: () => import('./service-provider/AddServiceProvider'),
    loading: () => <div><Loader /></div>
});

const EditServiceProvider = Loadable({
    loader: () => import('./service-provider/EditServiceProvider'),
    loading: () => <div><Loader /></div>
});

const ServiceCategory = Loadable({
    loader: () => import('./service-provider/ServiceCategory'),
    loading: () => <div><Loader /></div>
});

const NewsletterEmailsComponent = Loadable({
    loader: () => import('./Newsletter/NewsletterEmails'),
    loading: () => <div><Loader /></div>
})

const PromocodeManagement = Loadable({
    loader: () => import('./PromoCode/PromoCode'),
    loading: () => <div><Loader /></div>
});

const VersioningManagement = Loadable({
    loader: () => import('./Versioning/VersionList'),
    loading: () => <div><Loader /></div>
});

const PaymentsDetails = Loadable({
    loader: () => import('./PaymentDetails/PaymentDetails'),
    loading: () => <div></div>
});

const PreLoginAuthentication = Loadable({
    loader: () => import('./PreLoginAuthentication/PreLoginAuthentication'),
    loading: () => <div></div>
});

function PageNotFound() {
    return <h1 style={{ textAlign: "center", marginTop: 40 }}>Page not found</h1>;

}

const AdminRoutes = () => {
    return (<><Switch>
        <Route exact path="/admin" component={Home} />
        <Route exact path="/admin/doctorlist" component={DoctorList} />
        <Route exact path="/admin/patientlist" component={PatientList} />
        <Route exact path="/admin/user-management/users/add" component={AddUser} />
        <Route exact path="/admin/user-management/document" component={AdminDocument} />
        <Route exact path="/admin/article/home" component={HomeArticle} />
        <Route exact path="/admin/article/add" component={AddArticle} />
        <Route exact path="/admin/article/edit/:id" component={EditArticle} />
        <Route exact path="/admin/questionnaire/home" component={HomeQuestionnaire} />
        <Route exact path="/admin/questionnaire/add" component={AddQuestionnaire} />
        <Route exact path="/admin/questionnaire/edit/:id" component={EditQuestionnaire} />
        <Route exact path="/admin/shop/home" component={HomeShop} />
        <Route exact path="/admin/shop/add" component={AddShop} />
        <Route exact path="/admin/shop/edit/:id" component={EditShop} />
        <Route exact path="/admin/shop/editsubcategory/:id" component={EditSubCategory} />
        <Route exact path="/admin/patient/chat" component={PatientChatNew} />
        {/*<Route exact path="/admin/user-management/users/:id" component={Users}/>*/}
        <Route exact path="/admin/user-management/edit/:selectedId" component={EditUser} />
        <Route exact path="/admin/addservice-provider" component={ServiceProvider} />
        <Route exact path="/admin/search" component={GlobalSearch} />
        <Route exact path="/admin/workout/home" component={WorkoutHome} />
        <Route exact path="/admin/workout/add" component={AddWorkout} />
        <Route exact path="/admin/workout/edit/:id" component={EditWorkout} />
        <Route exact path="/admin/serviceprovider/home" component={ServiceProvidersHome} />
        <Route exact path="/admin/serviceprovider/add" component={AddServiceProvider} />
        <Route exact path="/admin/serviceprovider/edit/:id" component={EditServiceProvider} />
        <Route exact path="/admin/serviceprovider/servicecategory" component={ServiceCategory} />
        <Route exact path="/admin/changepassword" component={ChangeAccountPassword} />
        <Route exact path="/admin/newsletter-emails" component={NewsletterEmailsComponent} />
        <Route exact path="/admin/promocode-management" component={PromocodeManagement} />
        <Route exact path="/admin/versioning" component={VersioningManagement} />
        <Route exact path="/admin/payment-details" component={PaymentsDetails} />
        <Route exact path="/admin/PreLoginAuthentication" component={PreLoginAuthentication} />
        <Route exact path="/admin/logout" component={Logout} />
        <Route component={PageNotFound} />
    </Switch></>)
}

export default AdminRoutes;