import React from 'react';
import { Link } from "react-router-dom";

class Button extends React.Component{

    render(){
        return(
            <span className="Back-button">
                <button><Link to="/home"> Voltar </Link></button>
            </span>
        );
    }
}

export default Button;