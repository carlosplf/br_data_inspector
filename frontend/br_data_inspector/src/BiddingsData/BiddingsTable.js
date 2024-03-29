import React from "react";
import { FaAngleRight } from "react-icons/fa";
import '../BiddingsData/BiddingsTable.css';
import CompaniesInfo from '../BiddingsData/CompaniesInfo.js';


class BiddingsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ids_created: false,
            expandedRows: [],
            all_biddings: [],
            previous_length: 0
        };
    }

    componentDidMount(){
        this.createUniqueID();
    }
    
    componentDidUpdate(){
        //IF enter this conditional, we have new data to define IDs and sort.
        if(this.state.previous_length !== this.props.biddings_data.length){
            this.createUniqueID();
        }
    }

    formatNumbers(x) {
        x = x.slice(0, -2);
        if (!x) {
            return 0;
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //For all Biddings, create a unique ID for each one.
    createUniqueID() {
        
        this.setState({previous_length: this.props.biddings_data.length});
        
        var new_all_biddings = [];
        this.props.biddings_data.forEach((item) => {
            item["ID"] =
                item["Número Licitação"] + Math.random().toString(16).slice(4);
            new_all_biddings.push(item);
        });

        //Sort the biddings data.
        var sorted_biddings_array = new_all_biddings.sort((a, b) => {
            return (
                parseFloat(b["Valor Licitação"]) -
                parseFloat(a["Valor Licitação"])
            );
        });
        
        this.setState({
            all_biddings: sorted_biddings_array
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
                className="biddingsNormalTR"
                onClick={clickCallback}
                key={"row-data-" + item["ID"]}
            >
                <td className="columnLicitacao">
                    {<FaAngleRight />}
                    {item["Número Licitação"]}
                </td>
                <td className="columnAbertura">{item["Objeto"].substring(8,68)}...</td>
                <td className="columnStatus">{item["Situação Licitação"]}</td>
                <td className="columnValor">
                    R$ {this.formatNumbers(item["Valor Licitação"])}
                </td>
            </tr>,
        ];

        if (this.state.expandedRows.includes(item["ID"])) {
            itemRows.push(
                <tr className="expandedTR" key={"row-expanded-" + item["ID"]}>
                    <td colSpan="5" className="expandedRow">
                        <div className="moreInfo">
                            <h3> Detalhes: </h3>
                            <p>{item["Objeto"]}</p>
                            <p>Modalidade: {item["Modalidade Compra"]}</p>
                            <p>Situação: {item["Situação Licitação"]}</p>
                            <p>N. Processo: {item["Número Processo"]}</p>
                            <p>Data da Abertura: {item["Data Abertura"]}</p>
                            <p>Data do Resultado: {item["Data Resultado Compra"]}</p>
                            <CompaniesInfo
                                entity_id={this.props.entity_id}
                                bidding_id={item["Número Licitação"]}
                                process_id={item["Número Processo"]}
                            />
                        </div>
                    </td>
                </tr>
            );
        }

        return itemRows;
    }

    buildTable(table_rows) {
        return (
            <div className="biddingsTable">
                <table>
                    <tbody>
                        <tr>
                            <th className="columnIdHeader"> Licitação </th>
                            <th className="columnObjectHeader"> Objeto </th>
                            <th className="columnStatusHeader"> Status </th>
                            <th className="columnValueHeader"> Valor Final da Compra </th>
                        </tr>
                        {table_rows}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        let allItemRows = [];

        this.state.all_biddings.forEach((item) => {
            const perItemRows = this.renderItem(item);
            allItemRows = allItemRows.concat(perItemRows);
        });

        const full_table = this.buildTable(allItemRows);

        return <div className="biddingsTableContainer">{full_table}</div>;
    }
}
export default BiddingsTable;
