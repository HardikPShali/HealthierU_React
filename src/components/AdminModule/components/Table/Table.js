import React from "react";
import { Link, MemoryRouter } from "react-router-dom";
import editIcon from "../../../../images/icons used/edit icon_40 pxl.svg";
import deleteIcon from "../../../../images/icons used/delete_icon_40 pxl.svg";
import ContentLoader from "react-content-loader";
import "./Table.css";
import PropTypes from 'prop-types';

const Table = (props) => {
  const { headers, data, isLoading, editLink, handleDelete, id, handleToggle } = props;

  return (
    <table className="table shadow">
      <thead className="thead-dark">
        <tr>
          {headers.map((header) => {
            return (
              <th key={header.key} scope="col">
                {header.label}
              </th>
            );
          })}
          {/* <th scope="col">Sr.</th>
        <th scope="col">Category</th>
        <th scope="col">Has Subcategory</th>
        <th scope="col" className="Questionnaire-Action-Area-padding">Action</th> */}
        </tr>
      </thead>
      <tbody>
        {!isLoading
          ? data.map((datas) => (
            <tr key={datas.id}>
              {headers.map((header) => {
                if (header.key === "action") {
                  return (
                    <td key="action">
                      <div>
                        <MemoryRouter>
                          <Link
                            to={{
                              pathname: `${editLink}${datas.id}`,

                            }}
                          >

                            <img
                              width="15"
                              height="15"
                              src={editIcon}
                              onClick='${pathname}'
                              alt=""
                              style={{ marginLeft: "5%", marginRight: "5%" }
                              }
                            />
                          </Link>
                        </MemoryRouter>


                        <img
                          width="15"
                          height="15"
                          src={deleteIcon}
                          onClick={() => handleDelete(datas.id)}
                          className="delete-icon"
                          alt=""
                          style={{ marginLeft: "5%", marginRight: "5%" }}
                        />
                      </div>
                    </td>
                  );
                }
                else if (header.key === 'toggle') {
                  return (
                    <td key="toggle">
                      <div className="selected-users-toggle">
                        <label className="toggle-switch">
                          <input
                            // checked={datas.active}
                            id="toggleSlots"
                            type="checkbox"
                          // onChange={(e) => handleToggle(e)}
                          />
                          <span className="toggle-slider round"></span>
                        </label>
                      </div>
                    </td>
                  );
                }
                else {
                  return <td key="category">{datas[header.key]}</td>;
                }
              })}
            </tr>
          ))
          : [...Array(4).keys()].map((dummyData) => {
            return (<tr>
              <td>
                <ContentLoader viewBox="0 0 250 20" width={250} height={20}>
                  <rect x="0" y="0" rx="4" ry="4" width="250" height="20" />
                </ContentLoader>
              </td>
              <td>
                <ContentLoader viewBox="0 0 250 20" width={250} height={20}>
                  <rect x="0" y="0" rx="4" ry="4" width="250" height="20" />
                </ContentLoader>
              </td>
              <td>
                <ContentLoader viewBox="0 0 250 20" width={250} height={20}>
                  <rect x="0" y="0" rx="4" ry="4" width="250" height="20" />
                </ContentLoader>
              </td>
            </tr>)
          })}
      </tbody>
    </table>
  );
};

export default Table;

Table.propTypes = {
  data: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  editLink: PropTypes.string,
  handleDelete: PropTypes.func
}