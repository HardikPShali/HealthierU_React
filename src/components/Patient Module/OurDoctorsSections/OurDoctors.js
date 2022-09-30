import React, { useEffect, useState } from 'react';
import OurDoctorCard from './OurDoctorCard';
import './OurDoctors.css';
import '../patient.css';
import { getAllDoctorsForHomepage } from '../../../service/frontendapiservices';

const OurDoctors = () => {
    const [doctorData, setDoctorData] = useState([]);
    const [loading, setLoading] = useState(false);

    const getOurDoctors = async () => {
        setLoading(true);
        const response = await getAllDoctorsForHomepage().catch((err) => {
            console.log(err);
            setLoading(false);
        });
        setDoctorData(response.data.data.slice(0, 4));
        setLoading(false);
    };

    useEffect(() => {
        getOurDoctors();
    }, []);


    return (
        <div>
            <h3 className="our-doctors--main-header mb-3 mt-2">Our Doctors</h3>
            <div className="our-doctor__card-box scroller-cardlist">
                <div className="card-holder">
                    <div className="our-doctor-card">
                        <div className="row">
                            {
                                loading && (
                                    <div className="col-md-12 ml-2" style={{ color: '#000', fontWeight: 400 }}>
                                        Loading...
                                    </div>
                                )
                            }
                            {doctorData &&
                                doctorData.map((doctor, index) => {
                                    return (
                                        <div className="col-md-3 pb-4" key={index}>
                                            <OurDoctorCard doctor={doctor} />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OurDoctors;
