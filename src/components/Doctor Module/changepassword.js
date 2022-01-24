import React from 'react';
import Footer from './Footer';
//import './doctor.css';
import ChangePassword from '../CommonModule/changepassword';

const ChangeAccountPassword = () => {

    return (
        <div>
            <ChangePassword homeUrl="/doctor" />
            {/* <Footer /> */}
        </div>
    )
}
export default ChangeAccountPassword;