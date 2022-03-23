import React from "react";
import "./Button.css";
import { Link, MemoryRouter } from "react-router-dom";


const Button = (props) => {
    const { variant = 'primary', children, addLink } = props;
    return (
        <div>
            <MemoryRouter>
                <Link
                    to={{
                        pathname: `/admin/${addLink}/add`,

                    }}
                >
                    <button className={`btn ${variant}`} onClick='${pathname}'>
                        Add {children}
                    </button>
                </Link>
            </MemoryRouter>


        </div>

    )


}

export default Button;