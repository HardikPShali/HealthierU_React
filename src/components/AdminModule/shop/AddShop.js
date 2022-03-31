import React from "react";
import { Link } from "react-router-dom";
import './Shop.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import {
    postShop
} from "../../../service/shopservice";
import { toast } from 'react-toastify';
const AddShop = () => {


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await postShop(data);
        handleRedirect(resp)

    }

    const handleRedirect = (e) => {
        if (e) {
            toast.success("Shop successfully Added.");
            setTimeout(() => window.location.assign('/admin/shop/home'), 500);
        }
    }



    return (
        <div>
            <Navbar pageTitle="shop" />

            <br />
            <br />
            <div className="container Questionnaire-Edit-Div-Border">
                <div className="py-4">
                    <div className="row">
                        <div className="col-md-10"><h1>Add Shop</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <div className="form-group row">
                            <label htmlFor="category" className="col-sm-1 col-form-label">Category</label>
                            <div className="col-sm-11">
                                <input type="text" id="category" name="category" className="form-control"
                                    placeholder="Category" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="hasSubcategory" className="col-sm-1 col-form-label">Has Subcategory</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="hasSubcategory" id="hasSubcategory">
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>
                        </div>

                        <br />
                        <div className="row">
                            <div className="col-md-6">
                            </div>
                            <div className="col-md-6 text-right">
                                <button className="btn btn-primary mr-2">Save</button>
                                <Link to="/admin/shop/home">
                                    <button className="btn btn-light mr-2">Cancel</button>
                                </Link>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );


};

export default AddShop;
