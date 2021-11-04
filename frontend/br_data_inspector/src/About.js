import React from 'react';
import Header from './Header.js';
import './About.css';
import { FaGithub } from 'react-icons/fa';



class About extends React.Component{
    
    render(){
        return(
            <div className="aboutPage">
                <Header header_text="Sobre"/>
                <div className="container">
                <div className="pureText">
                    <p align="justify">
                        O BR Data Collector coleta dados abertos do Governo Federal do Brasil, através
                        dos relatórios em formato CSV disponíveis no Portal da Transparência.
                    </p>
                    <p align="justify">
                        O sistema construído coleta os dados de alguns relatórios específicos periodicamente,
                        e disponibiliza através de suas páginas algumas informações para que os usuários possam
                        consultar e visualizar.
                    </p>
                    <p align="justify">
                        O BR Data Collector é um sistema de código aberto, criado por Carlos Pereira Lopes Filho,
                        e sem qualquer ligação com qualquer empresa ou negócio.
                    </p>
                    <br></br>
                    <p><a id="githubIcon" href="https://github.com/carlosplf/br_data_inspector"><FaGithub/></a></p>
                    <br></br>
                    <p><a href="https://www.portaltransparencia.gov.br">Portal da Transparência </a></p>
                    <p><a href="https://www.portaltransparencia.gov.br/entenda-a-gestao-publica/execucao-despesa-publica">EMPENHADO, PAGO E LIQUIDADO. </a></p>
                    <br></br>
                    <img src="schema.png" alt="Schema."/>
                </div>
                </div>
            </div>
        )
    }
}

export default About;
