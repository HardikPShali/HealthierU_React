import React from 'react';
import Navbar from './layout/Navbar';
import ChangePassword from '../CommonModule/changepassword';
import './admin.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdbreact/dist/css/mdb.css';

const ChangeAccountPassword = () => {

    return (
        <div>
            <Navbar />
            <br/>
            <ChangePassword />
        </div>
    )
}
export default ChangeAccountPassword;