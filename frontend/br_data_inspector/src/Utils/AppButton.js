import React from 'react';
import { Link } from "react-router-dom";
import { FaHome } from 'react-icons/fa';

class AppButton extends React.Component{
    render(){
        if(this.props.btn_type === "home-btn"){
            return(
                <button id="home-btn" className="page-btn"><Link to="/home"> <p> <FaHome/> </p> </Link></button>
            );
        }
        else if(this.props.btn_type === "rank-btn"){
            return(
                <button id="rank-btn" className="page-btn"><Link to="/rank"> Ranking </Link></button>
            );
        }
        else if(this.props.btn_type === "contracts-btn"){
            return(
                <button id="contracts-btn" className="page-btn"><Link to="/contracts"> Contratos </Link></button>
            );
        }
        else if(this.props.btn_type === "about-btn"){
            return(
                <button id="about-btn" className="page-btn"><Link to="/about"> Sobre </Link></button>
            ); 
        }
        else{
            return(
                <p></p>
            )
        }
    }
}

export default AppButton;
