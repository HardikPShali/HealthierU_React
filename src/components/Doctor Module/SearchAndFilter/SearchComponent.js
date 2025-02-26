import React, { useState } from 'react'
import SearchBar from "material-ui-search-bar";


const SearchBarComponent = ({ updatedSearch }) => {
    const [searchText, setSearchText] = useState('');
    const handleSearchInputChange = (searchValue) => {
        setSearchText(searchValue);
        updatedSearch(searchValue);
    }
    return (
        <div style={{ marginLeft: '15px' }}>
            <SearchBar
                type="text"
                value={searchText}
                id="medicalrecord-search"
                autoComplete='off'
                onChange={(value) => handleSearchInputChange(value)}
                onCancelSearch={() => handleSearchInputChange("")}
            />
        </div>
    )
}

export default SearchBarComponent