import React from 'react';
import './Loading.css';


class Loading extends React.Component{
    render(){
        return(
            <div className="Loading">
                <svg viewBox="25 25 50 50">
                    <circle cx="50" cy="50" r="20"></circle>
                </svg>
                <p>Buscando Dados...</p>
            </div>
        )
    }
};

export default Loading;
