import React from "react";
import './Header.css';
import HomeButton from './HomeButton';

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div class="header">
                <h1>{this.props.header_text}</h1>
                <div class="header-btns">
                    <HomeButton/>
                </div>
            </div>
        )
    }
}

export default Header;