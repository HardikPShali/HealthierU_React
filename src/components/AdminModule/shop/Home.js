import React from "react";
import { getShops, deleteShop } from "../../../service/shopservice";
import { Link } from "react-router-dom";
import "./Shop.css";
import { Button, Modal } from "react-bootstrap";
import Navbar from "../layout/Navbar";
//import {deleteQuestion} from "../../../component/questionnaire/QuestionService";
import "mdbreact/dist/css/mdb.css";
import "../components/Table/Table";
import Table from "../components/Table/Table";
import AddButton from "../components/Button/Button";
import "../components/Button/Button";

class ShopHome extends React.Component {
  state = {
    isLoading: true,
    shop: null,
    selectedShop: null,
    error: null,
    showDelete: false,
  };

  headers = [
    {
      label: "Sr.",
      key: "serialno",
    },
    {
      label: "Category",
      key: "category",
    },
    {
      label: "Has Subcategory",
      key: "hasSubcategoryDisplay",
    },
    {
      label: "Action",
      key: "action",
    },
  ];

  async componentDidMount() {
    // GET request using fetch with async/await
    const response = await getShops();
    const data = response.map((d, i) => {
      d.serialno = i + 1;
      d.hasSubcategoryDisplay = d.hasSubcategory ? 'TRUE' : 'FALSE';
      return d;
    })
    this.setState({ shop: data, isLoading: false });
  }

  handleDeleteModal = (remove) => {
    this.setState({ selectedShop: remove });
    this.setState({ showDelete: true });
  };

  render() {
    const { isLoading } = this.state;

    return (
      <div>
        <Navbar pageTitle="shop" />
        <br />
        <div className="container">
          <div className="py-4">
            <div className="row">
              <div className="col-md-10">
                <h1>Shop</h1>
              </div>
              <div className="col-md-2 text-right pr-0">
                {/* <Link to="/admin/shop/add">
                  <button type="button" className="btn btn-primary">
                    Add Shop
                  </button>
                </Link> */}
                <AddButton addLink='shop'>Shop</AddButton>
              </div>
            </div>
            <Table
              data={this.state.shop}
              isLoading={isLoading}
              headers={this.headers}
              editLink='/admin/shop/edit/'
              handleDelete={this.handleDeleteModal}
            ></Table>
            {/* <table className="table border shadow">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sr.</th>
                                <th scope="col">Category</th>
                                <th scope="col">Has Subcategory</th>
                                <th scope="col" className="Questionnaire-Action-Area-padding">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {!isLoading ? (
                                this.state.shop.map((shopCat,index) => (
                                    <tr key={shopCat.id}>
                                        <td key="number">{index+1}</td>
                                        <td key="category">{shopCat.category}</td>
                                        <td key="hasSubcategory" >{shopCat.hasSubcategory === true ? "TRUE" : shopCat.hasSubcategory === false ? "FALSE" : ""}</td>
                                        <td key="action" className="Questionnaire-Action-Area-padding">
                                            <div>
                                                <Link
                                                    to={{
                                                        pathname: `/admin/shop/edit/${shopCat.id}`,
                                                        //questionnaire: question
                                                    }}>
                                                <button className="btn btn-info mr-2">Edit</button></Link>
                                                <button className="btn btn-danger"
                                                        onClick={() => this.handleDeleteModal(shopCat)}>Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                              <tr>Loading...</tr>
                              )}
                            </tbody>
                        </table> */}
          </div>
        </div>

        <Modal
          show={this.state.showDelete}
          onHide={() => this.setState({ showDelete: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Delete Shop</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure to Delete the Shop ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ showDelete: false })}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => this.handleDeleteShopSubmission()}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleDeleteShopSubmission = async (event) => {
    //console.log(this.state.selectedShop)
    const resp = deleteShop(this.state.selectedShop.id);

    await resp.then((response) => {
      this.setState({ selectedShop: null, showDelete: false });
      this.componentDidMount();
      return response.data;
    });
  };
}

export default ShopHome;
