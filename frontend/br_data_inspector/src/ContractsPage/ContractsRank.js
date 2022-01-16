import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "../ContractsPage/ContractsRank.css";

class ContractsRank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount() {
        this.requestDataFromAPI(this.props.year);
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
    requestDataFromAPI(year_to_search) {
        var base_url = this.api_url + ":" + this.api_port;
        var request_url = base_url + "/contracts/rank/" + year_to_search;

        return new Promise((resolve, reject) => {
            return fetch(request_url)
                .then((response) => response.json())
                .then(
                    (data) => {
                        if (data) {
                            resolve(this.saveDataAsState(data));
                        } else {
                            reject(
                                console.log(
                                    "Contracts Rank request returned empty."
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

    saveDataAsState(contracts_data) {
        if (this.state.data === undefined) {
            this.setState({ data: contracts_data["data"], loading: false});
        }
    }

    buildTable(table_rows) {
        return (
            <div className="contractsRankTable">
                <table>
                    <thead>
                        <tr>
                            <th className="headerCNPJ"> CNPJ </th>
                            <th className="headerName"> Nome </th>
                            <th className="headerTotal"> Total Recebido </th>
                            <th className="headerContracts">
                                {" "}
                                Qtde de Contratos{" "}
                            </th>
                        </tr>
                    </thead>
                    <tbody>{table_rows}</tbody>
                </table>
            </div>
        );
    }

    renderItem(item) {
        let link_to = "/company?cnpj=" + item["CNPJ"];
        return (
            <tr>
                <td className="valueCNPJ">
                    {" "}
                    <Link to={link_to}> {item["CNPJ"]} </Link>
                </td>
                <td className="valueName">{item["Nome"]}</td>
                <td className="valueTotal">
                    R$ {this.formatNumber(item["Total recebido"])}
                </td>
                <td className="valueContracts">
                    {item["Quantidade de contratos"]}
                </td>
            </tr>
        );
    }

    buildTableRows() {
        if (this.state.data === undefined) {
            return [];
        }
        let all_rows = [];
        this.state.data.forEach((item) => {
            const singleItemRow = this.renderItem(item);
            all_rows = all_rows.concat(singleItemRow);
        });
        return all_rows;
    }

    render() {
        if (this.state.loading){
            return (<h3 className="loadingMessage"> Buscando Rank para {this.props.year}... </h3>)
        }

        const all_rows = this.buildTableRows();
        const table = this.buildTable(all_rows);
        return (
            <div className="contractsRankCard">
                <p className="cardTitle">
                    Empresas que mais receberam considerando contratos publicados
                    em {this.props.year}:
                </p>
                {table}
            </div>
        );
    }
}

export default withRouter(ContractsRank);