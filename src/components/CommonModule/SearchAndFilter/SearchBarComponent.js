import React, { useState } from 'react'
import SearchBar from "material-ui-search-bar";


const SearchBarComponent = () => {
    const [searchText, setSearchText] = useState('');

    const handleSearchInputChange = (searchValue) => {
        //console.log("searchValue :::::::", searchValue);
        if (searchValue === "") {
            console.log("searchValue is", searchValue);
        }
        console.log("searchText is", searchValue);
    };

    const handleSearchData = async () => {
        if (searchText !== "") {
            console.log("searchText is", searchText);

        }
    }




    return (
        <div>
            <SearchBar
                type="text"
                value={searchText}
                id="doctor-search"
                autoComplete='off'

                onChange={(value) => handleSearchInputChange(value)}
                onCancelSearch={() => handleSearchInputChange("")}
                onRequestSearch={() => handleSearchData(false)}
                cancelOnEscape={true}
                onKeyDown={(e) => e.keyCode === 13 ? handleSearchData(true) : ""}

            />
        </div>
    )
}

export default SearchBarComponent