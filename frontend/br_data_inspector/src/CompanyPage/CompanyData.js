import React from "react";
import { withRouter } from "react-router-dom";
import "../CompanyPage/CompanyData.css";

class CompanyData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined,
            all_cards_rendered: false,
            all_cards: undefined,
            summary_values: undefined,
            summary_card: undefined
        };
    }

    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount() {
        this.requestDataFromAPI(this.props.cnpj);
    }
    
    formatNumber(x) {
        x = parseFloat(x).toFixed(2).toString()
        let splited_number = x.split(".");
        let y = splited_number[0];
        if (!y) {
            return 0;
        }
        return (
            y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
            "," +
            splited_number[1]
        );
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
            <div key={Math.random().toString(16)} className="contractCard">
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
                <p> Valor Inicial Compra: R$ {this.formatNumber(contract_item["Valor Inicial Compra"])}</p>
                <p> Valor Final Compra: R$ {this.formatNumber(contract_item["Valor Final Compra"])}</p>
            </div>
        )
    }

    buildCards(){
        let all_cards = [];
        let summary_values = {
            "total recebido": 0,
            "quantidade": 0
        }
        
        this.state.data.forEach((item) => {
            const singleCard = this.renderCard(item);
            all_cards = all_cards.concat(singleCard);
            summary_values = this.updateTotalValues(item, summary_values);
        });

        let buyers_summary = this.calculateBiggestBuyers();
        
        let summary_card = this.buildSummaryCard(summary_values, buyers_summary);
        
        this.setState({all_cards_rendered: true, all_cards: all_cards, summary_values: summary_values, summary_card: summary_card});
    }

    //Based on Contracts data, see who bought most from the Company.
    calculateBiggestBuyers(){
        let buyers_dict = {};
        let previous_value = 0;
        let previous_quantity = 0;

        this.state.data.forEach((item) => {
            previous_value = 0;
            previous_quantity = 0;
            if(item["Nome UG"] in buyers_dict){
                previous_value = buyers_dict[item["Nome UG"]]["valor total"];
                previous_quantity = buyers_dict[item["Nome UG"]]["quantidade"];
            }
            buyers_dict[item["Nome UG"]] = {
                "nome": item["Nome UG"],
                "valor total": previous_value + parseFloat(item["Valor Final Compra"]),
                "quantidade": previous_quantity + 1
            }
        });
        return buyers_dict;
    }

    //After building a single Card for a single Contract, call this method
    //to update the total values and earns for the Company.
    updateTotalValues(contract_item, cards_summary){
        cards_summary["total recebido"] = cards_summary["total recebido"] + parseFloat(contract_item["Valor Final Compra"]);
        cards_summary["quantidade"] += 1;
        return cards_summary;
    }

    //Using the data stored at state.summary_values, build a Card to show
    //the summary and big numbers.
    buildSummaryCard(summary_values, buyers_summary){

        let buyers_info = [];
        Object.keys(buyers_summary).forEach((key) => {
            buyers_info = buyers_info.concat(
                <tr>
                    <td className="buyerName">{buyers_summary[key]["nome"]}</td>
                    <td className="buyerTotal">R$ {this.formatNumber(buyers_summary[key]["valor total"])}</td>
                    <td className="buyerQtd">{buyers_summary[key]["quantidade"]}</td>
                </tr>
            )
        });

        console.log(buyers_info);

        return(
            <div className="summaryCard">
                <h3 className="summaryTitle">Resumo dos contratos</h3>
                <p>Valor total fechado em contratos: R$ {this.formatNumber(summary_values["total recebido"])}</p>
                <p>Valor total de contratos fechados: {summary_values["quantidade"]}</p>
                <div className="buyersTable">
                    <table>
                        <tr>
                            <th className="nameHeader">Nome</th>
                            <th className="totalHeader">Total pago</th>
                            <th className="qtdHeader">Qtde de Contratos</th>
                        </tr>
                        {buyers_info}
                    </table>
                </div>
            </div>
        )
    }
    
    render(){
        if(this.state.data !== undefined && !this.state.all_cards_rendered){
            this.buildCards();
        }
        
        if(this.state.data === undefined){
            return (<h1> Loading... </h1>);
        }

        else{

            if(!this.state.all_cards_rendered){
                return (
                    <h1> Rendering cards... </h1>
                )
            }
            
            else{
                return(
                    <div className="allContractsData">
                        <h1 className="companyName"> {this.state.data[0]["Nome Contratado"]} </h1>
                        {this.state.summary_card}
                        {this.state.all_cards}
                    </div>
                )
            }
        }
    }
}

export default withRouter(CompanyData);
