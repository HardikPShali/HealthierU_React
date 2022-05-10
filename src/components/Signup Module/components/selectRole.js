import React from "react";
import doctorSVG from "../../../images/doctorSVG.svg";
import patientSVG from "../../../images/patientSVG.svg";
import physical_trainerSVG from "../../../images/physicaltrainerSVG.svg";
const SelectRole = (props) => {
    return (
        <div className="wrapper" style={props.display}>
            <div id="user-type">
                {/* <!-- Tabs Titles --> */}
                <h2 className="user-title">Who are you?</h2>
                <br />
                {/* <!-- Login Form --> */}

                <div className="wyr-form-box">
                    <div className="row">
                        <div className="col-md-4">
                            <br />
                            <button
                                className="btn no-outline role"
                                onClick={() => props.handleDoctorClick()}
                            >
                                <img src={doctorSVG} alt="" className="sub nopadd" />
                                <br />
                                Provider

                            </button>
                        </div>
                        <div className="col-md-4">
                            <br />
                            <button
                                className="btn no-outline role"
                                onClick={() => props.handlePatientClick()}
                            >
                                <img src={patientSVG} alt="" className="sub nopadd" />
                                <br />
                                Individual
                            </button>
                        </div>
                        <div className="col-md-4">
                            <br />
                            <button
                                className="btn no-outline role"
                                onClick={() => props.handlePhysicaltrainerClick()}
                            >
                                <img
                                    src={physical_trainerSVG}
                                    alt=""
                                    className="sub nopadd"
                                />
                                <br />
                                Employer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SelectRole;