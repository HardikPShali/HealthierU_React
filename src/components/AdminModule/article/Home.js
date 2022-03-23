import React from "react";

import { getArticles,deleteArticle } from "../../../service/ArticleService";
import { Link } from "react-router-dom";

import { Button,Modal } from "react-bootstrap";
import Navbar from "../layout/Navbar";
import 'mdbreact/dist/css/mdb.css';
import editIcon from '../../../images/icons used/edit icon_40 pxl.svg';
import deleteIcon from '../../../images/icons used/delete_icon_40 pxl.svg';
import "../components/Table/Table";
import Table from "../components/Table/Table";
import AddButton from "../components/Button/Button";
import "../components/Button/Button";

class ArticleHome extends React.Component {


    state = {
        isLoading: true,
        articles: null,
        selectedArticle: null,
        error: null,
        showDelete: false
    }
    headers = [
        {
            label: "Sr.",
            key: "serialno",
        },
        {
            label: "Title",
            key: "title",
        },
        {
            label: "Description",
            key: "description",
        },
        {
            label: "Name",
            key: "name",
        },
        {
            label: "Published",
            key: "published",
        },
     
        {
            label: "Action",
            key: "action",
        },
    ];

    async componentDidMount() {
        // GET request using fetch with async/await
        const response = await getArticles();
        
        const data = response.articlesList.map((d, i) => {
            d.serialno = i + 1;
            d.published = d.published ? 'TRUE' : 'FALSE';
            return d;
        })
        this.setState({ articles: data, isLoading: false })
    }

    handleDeleteModal = remove => {

        this.setState({ selectedArticle: remove })
        this.setState({showDelete: true});
    }

    

    render() {
        //const { isLoading, article, error } = this.state;
        const { isLoading } = this.state;

        return (
            <div>
                <Navbar pageTitle="article" />
                <br />
                <div className="container">
                    <div className="py-4">
                        <div className="row">
                            <div className="col-md-10"><h1>Articles</h1></div>
                            <div className="col-md-2 text-right pr-0">
                                {/* <Link to="/admin/article/add">
                                    <button type="button" className="btn btn-primary">Add Article</button>
                                </Link> */}
                                 <AddButton addLink='article'>Article</AddButton>
                            </div>
                        </div>
                        <Table
                            data={this.state.articles}
                            isLoading={isLoading}
                            headers={this.headers}
                            editLink='/admin/article/edit/'
                            handleDelete={this.handleDeleteModal}
                        ></Table>
                        {/* <table className="table border shadow">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Sr.</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Published</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!isLoading ? (
                                    this.state.articles.articlesList.map((article, index) => (
                                        <tr key={article.id}>
                                            <td key="number">{index + 1}</td>
                                            <td key="title">{article.title}</td>
                                            <td key="description">{article.description}</td>
                                            <td key="name">{article.name}</td>
                                            <td key="published" >{String(article.published).toUpperCase()}</td>
                                            <td key="action">
                                                <div>


                                                    <Link
                                                        to={{
                                                            pathname: `/admin/article/edit/${article.id}`
                                                        }}>
                                                        <img width="15" height="15" src={editIcon} alt=""
                                                            style={{ marginLeft: '5%', marginRight: '5%' }} />
                                                    </Link>

                                                    <img width="15" height="15" src={deleteIcon} 
                                                    onClick={() => this.handleDeleteModal(article.id)} alt=""
                                                        style={{ marginLeft: '5%', marginRight: '5%' }} />

                                                </div>
                                            </td>
                                        </tr>
                                    ))) : (
                                        <span>Loading...</span>
                                    )}
                            </tbody>
                        </table> */}
                    </div>
                </div>

                <Modal show={this.state.showDelete} onHide={() => this.setState({ showDelete: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Article</Modal.Title>
                    </Modal.Header>
                    <Modal.Body><p>Are you sure to Delete the Article ?</p></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ showDelete: false })}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={() => this.handleDeleteArticleSubmission()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }


    handleDeleteArticleSubmission = async (event) => {
        const resp = deleteArticle(this.state.selectedArticle);

        await resp.then(response => {
            this.setState({ selectedArticle: null, showDelete: false })
            this.componentDidMount();
            return response;
        })
    }

};

export default ArticleHome;
