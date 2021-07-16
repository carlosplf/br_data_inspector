import React from 'react';
import { Link } from "react-router-dom";

//Shouldn't be a Component
class Button extends React.Component{

    render(){
        return(
            <span id="back-btn" className="btn">
                <button><Link to="/home"> Back </Link></button>
            </span>
        );
    }
}

export default Button;
