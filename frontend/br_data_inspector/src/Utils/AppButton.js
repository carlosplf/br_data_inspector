import React from 'react';
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { FaMedal } from 'react-icons/fa';

class AppButton extends React.Component{
    render(){
        if(this.props.btn_type === "home-btn"){
            return(
                <button id="home-btn" className="page-btn"><Link to="/home"> <FaHome/> </Link></button>
            );
        }
        else if(this.props.btn_type === "rank-btn"){
            return(
                <button id="rank-btn" className="page-btn"><Link to="/rank"> <FaMedal/> </Link></button>
            );
        }
        else if(this.props.btn_type === "about-btn"){
            return(
                <button id="about-btn" className="page-btn"><Link to="/about"> Sobre </Link></button>
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
