import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { Link, NavLink } from 'react-router-dom'
import ChatItemsStyle from './ChatItems.css'
import ChatItem from './ChatItem';
import SearchIcon from '../../../../images/icons used/SearchIcon.png'
const ChatItems = (props) => {
    return (
        <div className="chatItems-wrapper">
            <div className="search_person-input">
                <input className="search_person" placeholder="Search person" type="text" /> <img src={SearchIcon}></img>
            </div>
            { props.chat.map((item=>{
              console.log(item);
              return <ChatItem item={item}/>
            }))}
        </div>
    )
}

export default ChatItems;