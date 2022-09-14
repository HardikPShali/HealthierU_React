import React, { useState } from 'react'
import SearchBar from "material-ui-search-bar";

const SearchBarComponent = ({ updatedSearch, className }) => {

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
                className={className}
            />
        </div>
    )
}

export default SearchBarComponent