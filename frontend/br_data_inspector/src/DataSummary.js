import React from "react";
import "./DataSummary.css";


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
        "202106": "Junho/21"
    }

    //TODO: Check if the numbers are being formated in a proper way for decimals.
    formatNumbers(x) {
      if (!x) {return 0}
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    processDates(){
        var dates_list = this.props.dates.map( (d) => {
            return(
                <spam key={d.slice(-2)} style={{fontWeight:'normal', fontSize:'16px'}}> {this.date_map[d]} </spam>
            )
        })
        return dates_list;
    }

    render(){
        const dates_list = this.processDates();
        return(
            <div className="data-summary">
                <h2>{this.props.name}</h2>
                <spam className="monthsList" style={{fontWeight:'bold'}}>Meses selecionados: {dates_list}</spam>
                <h3>Valores recebidos no período:</h3>
                {this.props.data_keys.map(key => (
                    <p key={key}>{key}: { this.formatNumbers(this.props.values_summary[key])}</p>
                    ))}
            </div>
        )
    }

}

export default DataSummary;
