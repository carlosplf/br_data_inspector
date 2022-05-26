import React from "react";
import {CSVLink} from 'react-csv';
import "../CompanyPage/AllContractsDetailsModal.css";


class AllContractsDetailsModal extends React.Component{
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

    buildCSV(){

        let csv_items = [
            [
                "CNPJ", "Nome", "Modalidade Licitação", "Modalidade Compra",
                "Nome UG", "Nome Órgão", "Nome Órgão Superior",
                "Número Licitação", "Número do Contrato", "Objeto",
                "Situação do Contrato", "Data da Assinatura",
                "Início da Vigência", "Fim da Vigência",
                "Valor Inicial da Compra", "Valor Final da Compra"
            ]
        ]

        let csv_item = [];

        this.props.data.forEach((item) =>{

            csv_item = [[
                item["Código Contratado"],
                item["Nome Contratado"],
                item["Modalidade Compra Licitação"],
                item["Modalidade Compra"],
                item["Nome UG"],
                item["Nome Órgão"],
                item["Nome Órgão Superior"],
                item["Número Licitação"],
                item["Número do Contrato"],
                item["Objeto"],
                item["Situação Contrato"],
                item["Data Assinatura Contrato"],
                item["Data Início Vigência"],
                item["Data Fim Vigência"],
                this.formatNumber(item["Valor Inicial Compra"]),
                this.formatNumber(item["Valor Final Compra"])
            ]];

            csv_items = csv_items.concat(csv_item);
            csv_item = [];
        });
        return csv_items;
    }
    
    renderCard(contract_item){
        return(
            <div key={Math.random().toString(16)} className="singleContractInfo">
                <p style={{fontWeight: "bold"}}> CNPJ: {contract_item["Código Contratado"]}</p>
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

    renderAllCards(){
        let all_cards = [];
        
        this.props.data.forEach((item) => {
            all_cards = all_cards.concat(this.renderCard(item));
        });

        return all_cards;
    }

    render(){

        let contracts_info = this.renderAllCards();
        let csv_data = this.buildCSV();

        return(
            <div onClick={this.props.callBackCloseModal} className="allContractsDetailsModal">
                <div onClick={e => e.stopPropagation()} className="contractsModalBody">
                    <h1> Detalhes dos Contratos: </h1>
                    <button onClick={this.props.callBackCloseModal} id="closeButton"> Fechar </button>
                    <CSVLink className="downloadButton" data={csv_data} >Download CSV</CSVLink>
                    {contracts_info}
                </div>
            </div>
        );
    }
}

export default AllContractsDetailsModal;
