import React from "react";
import { withRouter } from "react-router-dom";
import "../CompanyPage/CompanyData.css";

class CompanyData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount() {
        this.requestDataFromAPI(this.props.cnpj);
    }

    //Call Backend API and retrieve data about Entities
    requestDataFromAPI(company_cnpj) {
        var base_url = this.api_url + ":" + this.api_port;
        var request_url = base_url + "/contracts/cnpj/" + company_cnpj;

        return new Promise((resolve, reject) => {
            return fetch(request_url)
                .then((response) => response.json())
                .then(
                    (data) => {
                        if (data) {
                            resolve(this.setState({data: data["data"]}));
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

    renderCard(contract_item){
        return(
            <div className="contractCard">
                <p> CNPJ: {contract_item["CNPJ Contratado"]}</p>
                <p> Nome: {contract_item["Nome Contratado"]}</p>
                <p> Modalidade da Licitação: {contract_item["Modalidade Compra Licitação"]}</p>
                <p> Modalidade da Compra: {contract_item["Modalidade Compra"]}</p>
                <p> Nome UG: {contract_item["Nome UG"]}</p>
                <p> Nome do Órgão: {contract_item["Nome Órgão"]}</p>
                <p> Nome do Órgão Superior: {contract_item["Nome Órgão Superior"]}</p>
                <p> Número Licitação: {contract_item["Número Licitação"]}</p>
                <p> Número do Contrato: {contract_item["Número do Contrato"]}</p>
                <p> {contract_item["Objeto"]}</p>
                <p> Situação Contrato: {contract_item["Situação Contrato"]}</p>
                <p> Data da Assinatura: {contract_item["Data Assinatura Contrato"]}</p>
                <p> Início da vigência: {contract_item["Data Início Vigência"]}</p>
                <p> Fim da vigência: {contract_item["Data Fim Vigência"]}</p>
                <p> Valor Inicial Compra: {contract_item["Valor Inicial Compra"]}</p>
                <p> Valor Final Compra: {contract_item["Valor Final Compra"]}</p>
            </div>
        )
    }

    buildCards(){
        if (this.state.data === undefined) {
            return [];
        }
        
        let all_cards = [];
        
        this.state.data.forEach((item) => {
            const singleCard = this.renderCard(item);
            all_cards = all_cards.concat(singleCard);
        });
        
        return all_cards;
    }
    
    render(){
        const all_cards = this.buildCards();

        if(this.state.data === undefined){
            return (<h1> Loading... </h1>);
        }
        else{
            return(
                <div className="allContractsData">
                    <h1> {this.state.data[0]["Nome Contratado"]} </h1>
                    {all_cards}
                </div>
            )
        }
    }
}

export default withRouter(CompanyData);
