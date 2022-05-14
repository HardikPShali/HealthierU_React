import React from "react";
import LocalStorageService from "../util/LocalStorageService";

/**
 * 
 * @returns [list of roles of loggedin user]
 */
const useRole = () => {
    const loggedInUser = LocalStorageService.getCurrentUser();
    const returnArr = [loggedInUser.authorities];

    return returnArr;
}

export default useRole;