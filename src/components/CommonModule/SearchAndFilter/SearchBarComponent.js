import React, { useState } from 'react'
import SearchBar from "material-ui-search-bar";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";


const SearchBarComponent = ({ activeAppointments }) => {

    const [searchText, setSearchText] = useState('');

    const handleSearchInputChange = (searchValue) => {
        //console.log("searchValue :::::::", searchValue);
        if (searchValue === "") {
            console.log("searchValue is", searchValue);
            // setSearchText(searchValue);
        }
        console.log("searchText is", searchValue);
    };

    const handleSearchData = async () => {
        if (searchText !== "") {
            console.log("searchText is", searchText);
            setSearchText('');
        }
    }

    return (
        <div>
            {console.log("activeAppointments :::::::", activeAppointments)}
            <SearchBar
                type="text"
                value={searchText}
                id="appointment-search"
                autoComplete='off'

                onChange={(value) => handleSearchInputChange(value)}
                onCancelSearch={() => handleSearchInputChange("")}
                onRequestSearch={() => handleSearchData(false)}
                cancelOnEscape={true}
                onKeyDown={(e) => e.keyCode === 13 ? handleSearchData(true) : ""}

            />
            {searchText !== "" && (
                <IconButton
                    onClick={() => handleSearchData(true)}
                    className="searchForwardIcon"
                >
                    <ArrowForwardIcon />
                </IconButton>
            )}
        </div>
    )
}

export default SearchBarComponent