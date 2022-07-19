import React from 'react';

const loaderLogout = () => {
  return (
    <div id="loader-logout" className="lds-css ng-scope">
      <div
        style={{ width: '100%', height: '100%' }}
        className="lds-double-ring"
      >
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default loaderLogout;
