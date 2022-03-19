import React from "react";
import "../DataSummary/DataSummary.css";


class DataSummary extends React.Component{

    /* This Component show the sums of values for the rendered Transactions Table. */

    constructor(props){
        super(props);
    }

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
        "202112": "Dezembro/21"
    }

    formatNumbers(x) {
      if (!x) {return 0}
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //Creates a HTML list of elements for the Dates slecteds.
    processDates(){
        var dates_list = this.props.dates.map( (d) => {
            return(
                <spam key={d} className="monthSelected"> {this.date_map[d]} </spam>
            )
        })
        return dates_list;
    }

    render(){
        const dates_list = this.processDates();
        console.log(this.props.entity_id)
        return(
            <div className="data-summary">
                <h2>{this.props.name}</h2>
                <div className="monthsListLabel">
                    <p id="monthsSelectedLabel">Meses selecionados:</p>
                    <div className="listMonthsSelected">
                        {dates_list}
                    </div>
                    <br></br>
                    <div className="dataLinks">
                        <p> Informações coletadas:</p> 
                        <a className="sectionlink" href={"#expensesData" + this.props.entity_id}>Despesas</a>
                        <a className="sectionlink" href={"#contractsData" + this.props.entity_id}>Contratos</a>
                        <a className="sectionlink" href={"#biddingsData" + this.props.entity_id}>Licitações</a>
                    </div>
                </div>
                <h3>Soma de valores para o período:</h3>
                {this.props.data_keys.map(key => (
                    <p key={key}>{key}: { this.formatNumbers(this.props.values_summary[key])}</p>
                    ))}
            </div>
        )
    }

}

export default DataSummary;
