import React from 'react';
import Header from './Header.js';
import './About.css';
import { FaTwitter } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';



class About extends React.Component{
    constructor(props){
        super(props)    
    }

    render(){
        return(
            <div className="aboutPage">
                <Header header_text="Sobre"/>
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
                    <p><a href="#"><FaTwitter/></a><a href="https://github.com/carlosplf/br_data_inspector"><FaGithub/></a></p>
                    <br></br>
                    <h3>O Projeto</h3>
                    <p>
                        Arquitetura:
                    </p>
                    <img src="schema.png"/>
                </div>
            </div>
        )
    }
}

export default About;