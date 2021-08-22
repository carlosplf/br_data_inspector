import React from 'react';
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';

class HomeButton extends React.Component{

    render(){
        return(
            <span id="back-btn" className="btn">
                <button><Link to="/home"> <FaHome/> </Link></button>
            </span>
        );
    }
}

export default HomeButton;
