import React, { useEffect, useState } from 'react';
import OurDoctorCard from './OurDoctorCard';
import './OurDoctors.css';
import '../patient.css';
import { getAllDoctorsForHomepage } from '../../../service/frontendapiservices';

const OurDoctors = () => {
    const [doctorData, setDoctorData] = useState([]);

    const getOurDoctors = async () => {
        const response = await getAllDoctorsForHomepage().catch((err) => {
            console.log(err);
        });
        setDoctorData(response.data.data);
    };

    useEffect(() => {
        getOurDoctors();
    }, []);


    return (
        <div className="our-doctor__card-box scroller-cardlist">
            <h3 className="our-doctors--main-header">Our Doctors</h3>
            <div className="card-holder">
                <div className="our-doctor-card">
                    <div className="row">
                        {doctorData &&
                            doctorData.map((doctor, index) => {
                                return (
                                    <div className="col-md-6 px-2 pb-3" key={index}>
                                        <OurDoctorCard doctor={doctor} />
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurDoctors;
