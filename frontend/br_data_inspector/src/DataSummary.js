import React from "react";
import "./DataSummary.css";


class DataSummary extends React.Component{

    /* This Component show the sums of values for the rendered Transactions Table. */

    constructor(props){
        super(props);
    }

    //TODO: Check if the numbers are being formated in a proper way for decimals.
    formatNumbers(x) {
      if (!x) {return 0}
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    processDates(){
        var date_spam = this.props.dates.map( (d) => {
            return(
                <spam key={d.slice(-2)} > {d.slice(-2)} </spam>
            )
        })
        return date_spam;
    }

    render(){
        const date_spam = this.processDates();
        return(
            <div className="data-summary">
                <h2>{this.props.name}</h2>
                <spam className="monthsList">Meses selecionados: {date_spam}</spam>
                <h3>Valores recebidos no período:</h3>
                {this.props.data_keys.map(key => (
                    <p key={key}>{key}: { this.formatNumbers(this.props.values_summary[key])}</p>
                    ))}
            </div>
        )
    }

}

export default DataSummary;
