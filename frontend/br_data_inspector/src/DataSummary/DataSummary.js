import React from "react";
import "../DataSummary/DataSummary.css";


class DataSummary extends React.Component{

    /* This Component show the sums of values for the rendered Transactions Table. */

    date_map = {
        "202001": "Janeiro/20",
        "202002": "Fevereiro/20",
        "202003": "Março/20",
        "202004": "Abril/20",
        "202005": "Maio/20",
        "202006": "Junho/20",
        "202007": "Julho/20",
        "202008": "Agosto/20",
        "202009": "Setembro/20",
        "202010": "Outubro/20",
        "202011": "Novembro/20",
        "202012": "Dezembro/20",
        "202101": "Janeiro/21",
        "202102": "Fevereiro/21",
        "202103": "Março/21",
        "202104": "Abril/21",
        "202105": "Maio/21",
        "202106": "Junho/21",
        "202107": "Julho/21",
        "202108": "Agosto/21",
        "202109": "Setembro/21",
        "202110": "Outubro/21",
        "202111": "Novembro/21",
        "202112": "Dezembro/21",
        "202201": "Janeiro/22",
        "202202": "Fevereiro/22",
        "202203": "Março/22",
        "202204": "Abril/22",
        "202205": "Maio/22",
        "202206": "Junho/22",
        "202207": "Julho/22",
        "202208": "Agosto/22",
        "202209": "Setembro/22",
        "202210": "Outubro/22",
        "202211": "Novembro/22",
        "202212": "Dezembro/22",
    }

    formatNumbers(x) {
      if (!x) {return 0}
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //Creates a HTML list of elements for the Dates slecteds.
    processDates(){
        var dates_list = this.props.dates.map( (d) => {
            return(
                <p key={d} className="monthSelected"> {this.date_map[d]} </p>
            )
        })
        return dates_list;
    }

    render(){
        const dates_list = this.processDates();
        return(
            <div className="data-summary">
                <div className="dsNavBar">
                    <a className="sectionlink" href={"#expensesData" + this.props.entity_id}>Despesas</a>
                    <a className="sectionlink" href={"#contractsData" + this.props.entity_id}>Contratos</a>
                    <a className="sectionlink" href={"#biddingsData" + this.props.entity_id}>Licitações</a>
                </div>
                <div className="dsData">
                    <h2>{this.props.name}</h2>
                    <div className="monthsListLabel">
                        <p id="monthsSelectedLabel">Meses selecionados:</p>
                        <div className="listMonthsSelected">
                            {dates_list}
                        </div>
                    </div>
                    <h3>Soma de valores para o período:</h3>
                    {this.props.data_keys.map(key => (
                        <p key={key}>{key}: { this.formatNumbers(this.props.values_summary[key])}</p>
                        ))}
                </div>
            </div>
        )
    }

}

export default DataSummary;
