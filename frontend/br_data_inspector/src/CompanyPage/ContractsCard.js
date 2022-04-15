import React from "react";
import { withRouter } from "react-router-dom";
import AllContractsDetailsModal from "../CompanyPage/AllContractsDetailsModal.js";
import "../CompanyPage/ContractsCard.css";

class ContractsCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: undefined,
            all_cards_rendered: false,
            summary_values: undefined,
            summary_card: undefined,
            show_details: false,
        };
    }

    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount() {
        this.requestDataFromAPI(this.props.cnpj);
    }
    
    showHideModal = () => {
       this.setState({show_details: !this.state.show_details}) 
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
                            resolve(this.setState({loading: false, data: data["data"]}));
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
    
    buildCards(){
        let summary_values = {
            "total recebido": 0,
            "quantidade": 0
        }
        
        this.state.data.forEach((item) => {
            summary_values = this.updateTotalValues(item, summary_values);
        });

        let buyers_summary = this.calculateBiggestBuyers();
        let summary_card = this.buildSummaryCard(summary_values, buyers_summary);
        return summary_card;    
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

        return(
            <div className="contractsNumbersCard">
                <h3 className="summaryTitle">CONTRATOS</h3>
                <p>Período considerado: Jan/2020 - Dez/2021 </p>
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

        let all_contracts_details = null;

        if(this.state.loading){
            return (<h1> Loading... </h1>);
        }
        
        else{
            
            if(this.state.data.length === 0){
                return (<h1> A empresa buscada não possui Contratos. </h1>)
            }
            
            else{

                if(this.state.show_details){
                    all_contracts_details = <AllContractsDetailsModal
                        data={this.state.data}
                        callBackCloseModal={this.showHideModal}
                    />
                }

                else {
                    all_contracts_details = null;
                }
                
                let summary_card = this.buildCards();
                
                return(
                    <div className="contractsCard">
                        <h1 className="companyName"> {this.state.data[0]["Nome Contratado"]} </h1>
                        {summary_card}
                        <button id="showContractsInfo" onClick={this.showHideModal}> Mostrar detalhes </button>
                        {all_contracts_details}
                    </div>
                )
            }
        }
    }
}

export default ContractsCard;
