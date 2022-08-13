import React from 'react';
import '../Utils/Loading.css';


class Loading extends React.Component{
    render(){
        let message = "Buscando Dados...";

        if(this.props.message) message = this.props.message

        if(this.props.heavy_search){
            return(
                <div className="Loading">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                    <p>{message}</p>
                    <p id="heavyLoadMessage">Vários meses selecionados. A pesquisa deve demorar um pouco.</p>
                </div>
            )
        }
        else{
            return(
                <div className="Loading">
                    <svg viewBox="25 25 50 50">
                        <circle cx="50" cy="50" r="20"></circle>
                    </svg>
                    <p>{message}</p>
                </div>
            )
        }
    }
};

export default Loading;
