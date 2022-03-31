import React from "react";


export default function DeleteModal(props) {
    return (
      <div className="modal d-block">
        <div className="modal-dialog">
          <div className="modal-content">
            { props.children }
          </div>
        </div>
      </div>
    );
  }