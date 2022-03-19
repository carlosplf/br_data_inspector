import React from "react";
import { withRouter } from "react-router-dom";
import "../ContractsData/ContractsTable.css";
import { FaAngleRight } from "react-icons/fa";

class ContractsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ids_created: false,
            expandedRows: [],
            all_contracts: [],
        };
    }

    componentDidMount(){
        this.createUniqueID(); 
    }

    formatNumbers(x) {
        x = x.slice(0, -2);
        if (!x) {
            return 0;
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //For all contracts, create a unique ID for each one.
    //TODO: Calling createUniqueID in every render. Should call only
    //when have all the Data collected.
    createUniqueID() {
        if(this.state.ids_created){
            return;
        }
        var new_all_contracts = [];
        this.props.contracts_data.forEach((item) => {
            item["ID"] =
                item["Número Licitação"] + Math.random().toString(16).slice(4);
            new_all_contracts.push(item);
        });

        //Sort the contracts data.
        var sorted_contracts_array = new_all_contracts.sort((a, b) => {
            return (
                parseFloat(b["Valor Final Compra"]) -
                parseFloat(a["Valor Final Compra"])
            );
        });

        this.setState({
            ids_created: true,
            all_contracts: sorted_contracts_array
        });
    }

    handleRowClick(rowId) {
        const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

        const newExpandedRows = isRowCurrentlyExpanded
            ? currentExpandedRows.filter((id) => id !== rowId)
            : currentExpandedRows.concat(rowId);

        this.setState({ expandedRows: newExpandedRows });
    }

    renderItem(item) {
        const clickCallback = () => this.handleRowClick(item["ID"]);
        const itemRows = [
            <tr
                className="normalTR"
                onClick={clickCallback}
                key={"row-data-" + item["ID"]}
            >
                <td className="columnLicitacao">
                    {<FaAngleRight />}
                    {item["Número Licitação"]}
                </td>
                <td className="columnContratado">{item["Nome Contratado"]}</td>
                <td className="columnValor">
                    R$ {this.formatNumbers(item["Valor Final Compra"])}
                </td>
            </tr>,
        ];

        if (this.state.expandedRows.includes(item["ID"])) {
            itemRows.push(
                <tr className="expandedTR" key={"row-expanded-" + item["ID"]}>
                    <td colSpan="5" className="expandedRow">
                        <div className="moreInfo">
                            <h3> Detalhes: </h3>
                            <p>CNPJ: {item["CNPJ Contratado"]}</p>
                            <p>Modalidade: {item["Modalidade Compra"]}</p>
                            <p>
                                Assinatura: {item["Data Assinatura Contrato"]}
                            </p>
                            <p>
                                Válido a partir de :{" "}
                                {item["Data Início Vigência"]}
                            </p>
                            <p>Válido até: {item["Data Fim Vigência"]}</p>
                            <p>Situação: {item["Situação Contrato"]}</p>
                            <p>
                                Valor Inicial: R${" "}
                                {this.formatNumbers(
                                    item["Valor Inicial Compra"]
                                )}
                            </p>
                            <p>
                                Valor Final: R${" "}
                                {this.formatNumbers(item["Valor Final Compra"])}
                            </p>
                            <p>{item["Objeto"]}</p>
                        </div>
                    </td>
                </tr>
            );
        }

        return itemRows;
    }

    buildTable(table_rows) {
        return (
            <div className="contractsTable">
                <table>
                    <tbody>
                        <tr>
                            <th> Licitação </th>
                            <th> Nome Contratado</th>
                            <th> Valor Final da Compra </th>
                        </tr>
                        {table_rows}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        let allItemRows = [];
       
        this.state.all_contracts.forEach((item) => {
            const perItemRows = this.renderItem(item);
            allItemRows = allItemRows.concat(perItemRows);
        });

        const full_table = this.buildTable(allItemRows);

        return <div className="contractsTableContainer">{full_table}</div>;
    }
}
export default withRouter(ContractsTable);
