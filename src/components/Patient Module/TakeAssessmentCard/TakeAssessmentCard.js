import React from 'react';
import healthAssessmentBg from '../../../images/svg/health-assessment-bg__compressed.svg';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import './TakeAssessmentCard.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


const TakeAssessmentCard = () => {
    const cookies = new Cookies();

    return (
        <div id="patient-card">
            <div className="patient-card_text col-md-6">
                <div className="patient-card_how-healthy-wrap">
                    <h3 style={{ marginLeft: 15 }} className="mb-3">
                        How healthy are you?
                    </h3>
                    {cookies.get('currentUser').questionCompleted === true ? (
                        <Link
                            to="/patient/questionnaire/existing"
                            style={{ marginRight: 20 }}
                        >
                            <button
                                type="button"
                                className="btn btn-primary btn-block health-assessment-btn"
                            >
                                Take Assessment
                            </button>
                        </Link>
                    ) : (
                        <Link to="/patient/questionnaire/new" style={{ marginRight: 20 }}>
                            <button
                                type="button"
                                className="btn btn-primary btn-block health-assessment-btn"
                            >
                                Take Assessment
                            </button>
                        </Link>
                    )}
                </div>
            </div>
            <div className="col-md-6 text-center w-100">
                <div className="health-assess-bg__wrapper">
                    <LazyLoadImage
                        src={healthAssessmentBg}
                        alt="home-2"
                        className="health-assess-bg"
                        effect='blur'
                    />
                    {/* <img
                        src={healthAssessmentBg}
                        alt="home-2"
                        className="health-assess-bg"
                    /> */}
                </div>
            </div>
        </div>
    );
};

export default TakeAssessmentCard;
