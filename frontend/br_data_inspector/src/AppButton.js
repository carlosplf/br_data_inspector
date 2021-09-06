import React from 'react';
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { FaMedal } from 'react-icons/fa';

class AppButton extends React.Component{
    render(){
        if(this.props.btn_type == "home-btn"){
            return(
                <span id="home-btn" className="page-btn">
                    <button><Link to="/home"> <FaHome/> </Link></button>
                </span>
            );
        }
        else if(this.props.btn_type == "rank-btn"){
            return(
                <span id="rank-btn" className="page-btn">
                    <button><Link to="/rank"> <FaMedal/> </Link></button>
                </span>
            );
        }
        else{
            return(
                <span></span>
            )
        }
    }
}

export default AppButton;
