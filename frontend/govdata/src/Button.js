import React from 'react';
import { Link } from "react-router-dom";
import "./Button.css"

//Shouldn't be a Component
class Button extends React.Component{

    render(){
        return(
            <span className="Back-Button">
                <button><Link to="/home"> Back </Link></button>
            </span>
        );
    }
}

export default Button;
