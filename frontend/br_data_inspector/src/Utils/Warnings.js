import React from 'react';
import "../Utils/Warnings.css";


class Warnings extends React.Component {

    render(){
        return(
            <div className="Warnings">
                <h3>Avisos:</h3>
                <p>Os dados aqui apresentados podem divergir dos dados reais apresentados pelo Governo. O software se encontra em uma versão não terminada, e alguns números e contas precisam ser verificados.</p>
            </div>
        )
    }
};


export default Warnings;
