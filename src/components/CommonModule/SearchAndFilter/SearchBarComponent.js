import React, { useState } from 'react'
import SearchBar from "material-ui-search-bar";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { getAppointmentsBySearch } from '../../../service/frontendapiservices';


const SearchBarComponent = () => {

    const [searchText, setSearchText] = useState('');

    const getAppointmentsByPatientName = async (search) => {
        const response = await getAppointmentsBySearch(search).catch((err) => {
            console.log('err', err);
        });
        console.log("Search Appointments response :::::::", response);
    }

    const handleSearchInputChange = async (searchValue) => {
        //console.log("searchValue :::::::", searchValue);
        if (searchValue === "") {
            console.log("blank searchValue is", searchValue);
            // setSearchText(searchValue);
        }
        else {
            console.log("searchValue is", searchValue);
            getAppointmentsByPatientName(searchValue);
            // setSearchText(searchValue);
        }
    };

    return (
        <div>
            <SearchBar
                type="text"
                value={searchText}
                id="appointment-search"
                autoComplete='off'
                onChange={(value) => handleSearchInputChange(value)}
                onCancelSearch={() => handleSearchInputChange("")}

            />
            {searchText !== "" && (
                <IconButton

                    className="searchForwardIcon"
                >
                    <ArrowForwardIcon />
                </IconButton>
            )}
        </div>
    )
}

export default SearchBarComponent