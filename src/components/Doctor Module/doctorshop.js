import React, { useState, useEffect } from 'react';
// import Footer from './Footer';
import './doctor.css';
import Shop from '../CommonModule/Shop';
import Loader from '../Loader/Loader';

const DoctorShop = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <div>
            {loading && (
                <Loader />
            )}
            <Shop />
            {/* <Footer /> */}
        </div>
    )
}
export default DoctorShop;