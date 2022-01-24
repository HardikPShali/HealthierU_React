import React from 'react';
import './loader.css'

const SmallLoader = () => {
    return (
        <div id="smallLoader" className="lds-css ng-scope">
            <div style={{width:'100%' , height:'100%'}} className="lds-double-ring">
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
export default SmallLoader;