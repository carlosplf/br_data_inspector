import React from 'react';
import Header from '../Header/Header.js';
import '../About/About.css';
import { FaGithub } from 'react-icons/fa';



class About extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: undefined
        };
    }

    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentWillMount(){
        this.requestDataFromAPI();
    }
    
    //Call Backend API and retrieve Data about Downloaded Reports.
    requestDataFromAPI() {
        var base_url = this.api_url + ":" + this.api_port;
        var request_url = base_url + "/downloaded_reports";

        return new Promise((resolve, reject) => {
            return fetch(request_url)
                .then((response) => response.json())
                .then(
                    (data) => {
                        if (data) {
                            resolve(this.buildDownloadedReportsList(data));
                        } else {
                            reject(
                                console.log(
                                    "Contracts CNPJ request returned empty."
                                )
                            );
                        }
                    },
                    (error) => {
                        reject(new Error("Request failed."));
                    }
                );
        });
    }

    buildDownloadedReportsList(data){
        let all_reports = []
        
        data["downloaded_reports"].forEach((item) => {
            all_reports = all_reports.concat(
                <tr>
                    <td>
                        <a href={item["url"]}><p className="reportLink">{item["url"]}</p></a>
                    </td>
                    <td className="reportsDateColumn">
                        <p>{item["datetime"].slice(0,-7)}</p>
                    </td>
                </tr>
            )
        });
        this.setState({reports: this.buildDownloadedReportsTable(all_reports), loading: false});
    }

    buildDownloadedReportsTable(all_reports){
        return(
            <div className="reportsTable">
                <table>
                    <tbody>
                        <tr>
                            <th className="reportLinkColumn"> Link </th>
                            <th className="reportsDateColumn"> Data do download</th>
                        </tr>
                        {all_reports}
                    </tbody>
                </table>
            </div>
        )
    }

    render(){
        if(this.state.loading){
            return (<h1> Loading... </h1>);
        }

        else{
            return(
                <div className="aboutPage">
                    <Header header_text="Sobre"/>
                    <div className="container">
                        <div className="pureText">
                            <h1 align="justify" id="aboutTitle"> Sobre o projeto </h1>
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
                            <p id="what-to-search" align="justify">
                                O que posso pesquisar? 
                            </p>
                            <p align="justify">
                                O sistema possui dados de Despesas de Órgãos Federais, Contratos, Licitações e Empresas contratadas.
                            </p>
                            <p align="justify">
                                Ao pesquisar por qualquer órgão FEDERAL, o sistema irá retornar com dados de Despesas, Contratos e Licitações. O usuário deve selecionar um período para a busca.
                            </p>
                            <p align="justify">
                                O sistema também permite que o usuário pesquise por Empresas contratadas por instituições FEDERAIS. A busca deve retornar detalhes
                                dos Contratos e Licitações publicadas.
                            </p>
                            <br></br>
                            <p><a id="githubIcon" href="https://github.com/carlosplf/br_data_inspector"><FaGithub/></a></p>
                            <br></br>
                            <h3 class="reportsTitle">Últimos reports coletados:</h3>
                            {this.state.reports}
                            <br></br>
                            <p><a href="https://www.portaltransparencia.gov.br">Portal da Transparência </a></p>
                            <p><a href="https://www.portaltransparencia.gov.br/entenda-a-gestao-publica/licitacoes-e-contratacoes">LICITAÇÕES E CONTRATAÇÕES </a></p>
                            <p><a href="https://www.portaltransparencia.gov.br/entenda-a-gestao-publica/execucao-despesa-publica">EMPENHADO, PAGO E LIQUIDADO. </a></p>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default About;
