import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import './Shop.css';
import 'mdbreact/dist/css/mdb.css';
import Navbar from "../layout/Navbar";
import {
    updateSubCategory, getSubCategory, addSubCategoryProduct, deleteSubCategoryProduct
} from "../../../service/shopservice";
import { Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import editIcon from '../../../images/icons used/edit icon_40 pxl.svg';
import deleteIcon from '../../../images/icons used/delete_icon_40 pxl.svg';
import { useHistory } from 'react-router-dom';
const EditSubCategory = (props) => {

    const [shop, setShop] = useState({});
    const history = useHistory();

    //let history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        loadShop();
    }, []);

    const loadShop = async () => {
        const result = await getSubCategory(`${id}`);
        //console.log(result)
        setShop(result);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const resp = await updateSubCategory(shop, data);
        if (resp && resp.data) {
            toast.success("Sub Category successfully updated.");
            setTimeout(() =>history.go(0), 1000);
        }

    }

    const [show, setShow] = useState(false);
    const [showDelete, setDeleteShow] = useState(false);
    const [productId, setProductId] = useState(null)
    const [product, setProduct] = useState(null);
    const handleDeleteClose = () => setDeleteShow(false);
    const handleClose = () => {
        setProduct(null)
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }

    const handleShopChange = e => {
        setShop({ ...shop, [e.target.name]: e.target.value });
    };

    const handleShopProductChange = e => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const res = await addSubCategoryProduct(id, data);
        if (res && (res.status === 200 || res.status === 201)) {
            data.get('id') ? toast.success("Sub Category Product successfully updated.") : toast.success("Sub Category Product successfully added.");
            setTimeout(() => history.go(0), 1000);
            handleClose();
        }
    }

    const handleAddModal = () => {
        setProduct(null)
        handleShow();
    }

    const handleEditModal = (item) => {
        setProduct(item)
        handleShow();
    }

    const handleDeleteModal = remove => {
        setProductId(remove.id);
        setDeleteShow(true);
    }

    const handleDelete = async () => {
        const res = await deleteSubCategoryProduct(productId);
        if (res) {
            toast.success("Sub Category Product successfully deleted.");
            setTimeout(() => history.go(0), 1000);
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
                        <div className="col-md-10"><h1>Edit Sub Category</h1></div>
                        <div className="col-md-2">
                        </div>
                    </div>

                    <br />

                    <form onSubmit={e => handleSubmit(e)}>
                        <input hidden={true} id="id" name="id" value={id}
                            onChange={e => handleShopChange(e)}
                        ></input>
                        <div className="form-group row">
                            <label htmlFor="name" className="col-sm-2 col-form-label">Sub Category Name</label>
                            <div className="col-sm-10">

                                <input type="text" id="name" name="subCategoryName" className="form-control"
                                    onChange={e => handleShopChange(e)}
                                    value={shop?.subCategoryName}
                                    placeholder="Sub Category Name" required></input>
                            </div>
                        </div>

                        <div className="form-group row">
                            <label htmlFor="pictureUrl" className="col-sm-2 col-form-label">Picture Url</label>
                            <div className="col-sm-10">

                                <input type="text" id="pictureUrl" name="pictureUrl" className="form-control"
                                    onChange={e => handleShopChange(e)}
                                    value={shop?.pictureUrl}
                                    placeholder="Picture Url" required></input>
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
                    <br />
                    <br />
                    <br />
                    <div className="row">
                        <div className="col-md-10"><h1>Products</h1></div>
                        <div className="col-md-2 text-right">
                            <button type="button" className="btn btn-primary" onClick={handleAddModal}>Add Products</button>
                        </div>
                    </div>
                    <table className="table border shadow">
                        <thead className="thead-dark">
                            <tr>
                                <th width="100">S. No</th>
                                <th width="100">Name</th>
                                <th width="100">Brand</th>
                                <th width="100">Product Description</th>
                                <th width="200">Picture Url</th>
                                <th width="200">Link Url</th>
                                <th width="100">Price</th>
                                <th width="100">Currency</th>
                                <th width="100">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shop?.subCategoryProductList?.map((product, index) => (
                                <tr key={product.id}>
                                    <td width="100">{index + 1}</td>
                                    <td width="100">{product.name}</td>
                                    <td width="100">{product.brand}</td>
                                    <td width="100">{product.description}</td>
                                    <td width="200"><a href={product.pictureUrl} target="_blank" rel="noopener noreferrer" >Link</a></td>
                                    <td width="200"><a href={product.linkUrl} target="_blank" rel="noopener noreferrer" >Link</a></td>
                                    <td width="100">{product.price}</td>
                                    <td width="100">{product.currency}</td>
                                    <td width="100">

                                        <img width="15" height="15" onClick={() => handleEditModal(product)} src={editIcon} alt=""
                                            style={{ marginLeft: '5%', marginRight: '5%', cursor: 'pointer' }} />

                                        <img width="15" height="15" onClick={() => handleDeleteModal(product)} src={deleteIcon} alt=""
                                            style={{ marginLeft: '5%', marginRight: '5%', cursor: 'pointer' }} />


                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                    <Modal show={show} onHide={handleClose}>
                        <form onSubmit={e => handleAddProductSubmit(e)}>
                            <Modal.Header closeButton>
                                {product?.id ? <Modal.Title>Edit Product</Modal.Title> : <Modal.Title>Add Product</Modal.Title>}
                            </Modal.Header>
                            <Modal.Body>

                                <input type="hidden" id="id" name="id" value={product?.id ? product.id : null} />
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="name" name="name" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.name}
                                            placeholder="Name" required></input>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="brand" className="col-sm-2 col-form-label">Brand</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="brand" name="brand" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.brand}
                                            placeholder="Brand" required></input>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="description" className="col-sm-2 col-form-label">Product Description</label>
                                    <div className="col-sm-10">
                                        <textarea id="description" name="description" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.description}
                                            placeholder="Product Description" required></textarea>
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

                                <div className="form-group row">
                                    <label htmlFor="sku" className="col-sm-2 col-form-label">Sku</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="sku" name="sku" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.sku}
                                            placeholder="SKU" required></input>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="linkUrl" className="col-sm-2 col-form-label">Link Url</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="linkUrl" name="linkUrl" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.linkUrl}
                                            placeholder="Link Url" required></input>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label htmlFor="price" className="col-sm-2 col-form-label">Price</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="price" name="price" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.price}
                                            placeholder="Price" required></input>
                                    </div>
                                </div>


                                <div className="form-group row">
                                    <label htmlFor="price" className="col-sm-2 col-form-label">Currency</label>
                                    <div className="col-sm-10">

                                        <input type="text" id="currency" name="currency" className="form-control"
                                            onChange={e => handleShopProductChange(e)}
                                            value={product?.currency}
                                            placeholder="Currency" required></input>
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
                            <Modal.Title>Delete Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><p>Are you sure to Delete the Product ?</p></Modal.Body>
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

export default EditSubCategory;
