import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Shop from '../CommonModule/Shop';
import Loader from './../Loader/Loader';

const PatientShop = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    return (
        <div>
            {loading && (
                <Loader />
            )}
            <Shop/>
            {/* <Footer /> */}
        </div>
    )
}
export default PatientShop;