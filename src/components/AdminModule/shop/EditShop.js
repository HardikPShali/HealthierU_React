import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import './Shop.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import {
    postShop, getShop, addSubCategory, deleteSubCategory
} from "../../../service/shopservice";
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import editIcon from '../../../images/icons used/edit icon_40 pxl.svg';
import deleteIcon from '../../../images/icons used/delete_icon_40 pxl.svg';

const EditShop = (props) => {

    const [shop, setShop] = useState({});


    //let history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        loadShop();
    }, []);

    const loadShop = async () => {
        const result = await getShop(`${id}`);
        //console.log(result)
        setShop(result);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await postShop(data);
        if (resp) {
            toast.success("Shop successfully updated.");
            setTimeout(() => window.location.assign('/admin/shop/home'), 1000);
        }

    }

    const [show, setShow] = useState(false);
    const [showDelete, setDeleteShow] = useState(false);
    const [subCategoryId, setSubCategoryId] = useState(null);
    const [product, setProduct] = useState(null);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleClose = () => {
        setProduct(null)
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }

    const handleRedirect = (e) => {
        if (e) {
            toast.success("Category successfully updated.");
            setTimeout(() => window.location.reload(), 500);
        }
    }

    const handleShopChange = e => {
        setShop({ ...shop, [e.target.name]: e.target.value });
    };

    const handleShopProductChange = e => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const res = await addSubCategory(id, data);
        if (res && (res.status === 200 || res.status === 201)) {
            toast.success("Sub Category successfully added.");
            setTimeout(() => window.location.reload(), 1000);
            handleClose();
        }
    }

    const handleAddModal = () => {
        setProduct(null)
        handleShow();
    }

    const handleDeleteModal = remove => {
        setSubCategoryId(remove.id);
        setDeleteShow(true);
    }

    const handleDelete = async () => {
        const res = await deleteSubCategory(subCategoryId);
        if (res) {
            toast.success("Sub Category successfully deleted.");
            setTimeout(() => window.location.reload(), 1000);
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
                        <div className="col-md-10"><h1>Edit Shop</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <input hidden={true} id="id" name="id" value={shop?.id}
                            onChange={e => handleShopChange(e)}
                        ></input>
                        <div className="form-group row">
                            <label htmlFor="category" className="col-sm-1 col-form-label">Category</label>
                            <div className="col-sm-11">
                                <input type="text" id="category" name="category" className="form-control"
                                    onChange={e => handleShopChange(e)}
                                    value={shop?.category}
                                    placeholder="Category" required></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="hasSubcategory" className="col-sm-1 col-form-label">Has Subcategory</label>
                            <div className="col-sm-11">

                                <select className="form-control" name="hasSubcategory" id="hasSubcategory"
                                    value={shop?.hasSubcategory}
                                    onChange={e => handleShopChange(e)}>
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
                                <button className="btn btn-primary mr-2">Update</button>
                                <Link to="/admin/shop/home">
                                    <button className="btn btn-light mr-2">Cancel</button>
                                </Link>
                            </div>
                        </div>

                    </form>
                    {shop?.hasSubcategory === true && (<>
                        <br />
                        <br />
                        <br />
                        <div className="row">
                            <div className="col-md-10"><h1>Sub Categories</h1></div>
                            <div className="col-md-2 text-right">
                                <button type="button" className="btn btn-primary" onClick={handleAddModal}>Add Sub Categories</button>
                            </div>
                        </div>
                        <table className="table border shadow">
                            <thead className="thead-dark">
                                <tr>
                                    <th width="100">S. No</th>
                                    <th width="100">Sub Category Name</th>
                                    <th width="200">Picture Url</th>
                                    <th width="100">Has Product</th>
                                    <th width="200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shop?.productSubCategoryList.map((subCat, index) => (
                                    <tr key={subCat.id}>
                                        <td width="100">{index + 1}</td>
                                        <td width="200">{subCat.subCategoryName}</td>
                                        <td width="200"><a href={subCat.pictureUrl} target="_blank" rel="noopener noreferrer">Link</a></td>
                                        <td width="100">{subCat.subCategoryProductList.length > 0 ? "TRUE" : "FALSE"}</td>
                                        <td width="100">

                                            <Link to={`/admin/shop/editsubcategory/${subCat.id}`}><img width="15" height="15" src={editIcon} alt=""
                                                style={{ marginLeft: '5%', marginRight: '5%' }} /></Link>

                                            <img width="15" height="15"
                                                onClick={() => handleDeleteModal(subCat)}
                                                src={deleteIcon} alt="" style={{ marginLeft: '5%', marginRight: '5%', cursor: 'pointer' }} />


                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>
                        </table>
                    </>)}

                    <Modal show={show} onHide={handleClose}>
                        <form onSubmit={e => handleAddSubCategory(e)}>
                            <Modal.Header closeButton>
                                {product?.id ? <Modal.Title>Edit Product</Modal.Title> : <Modal.Title>Add Product</Modal.Title>}
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-sm-2 col-form-label">Sub Category Name</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="name" name="subCategoryName" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.subCategoryName}
                                            placeholder="Sub Category Name" required></input>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="pictureUrl" className="col-sm-2 col-form-label">Picture Url</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="pictureUrl" name="pictureUrl" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.pictureUrl}
                                            placeholder="Picture Url" required></input>
                                    </div>
                                </div>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Save
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                    <Modal show={showDelete} onHide={handleDeleteClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Sub Category</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><p>Are you sure to Delete the Sub Category ?</p></Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleDeleteClose}>
                                Close
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete()}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <ToastContainer
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                    {/* Same as */}
                    <ToastContainer />
                </div>
            </div>
        </div>
    );



};

export default EditShop;
