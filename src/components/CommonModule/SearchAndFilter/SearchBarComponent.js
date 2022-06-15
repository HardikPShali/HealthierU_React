import React, { useState } from 'react'
import SearchBar from "material-ui-search-bar";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { getAppointmentsBySearch } from '../../../service/frontendapiservices';


const SearchBarComponent = ({ updatedSearch }) => {

    const [searchText, setSearchText] = useState('');


    const handleSearchInputChange = (searchValue) => {
        setSearchText(searchValue);
        updatedSearch(searchValue);
    }

    return (
        <div style={{ marginLeft: '15px', width: '100%', }}>
            <SearchBar
                type="text"
                value={searchText}
                id="appointment-search"
                autoComplete='off'
                onChange={(value) => handleSearchInputChange(value)}
                onCancelSearch={() => handleSearchInputChange("")}

            />
        </div>
    )
}

export default SearchBarComponent