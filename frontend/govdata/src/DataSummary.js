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

    render(){
        return(
            <div className="data-summary">
                <h2> Resumo de valores para o período: </h2>
                <h4>{this.props.name}</h4>
                {this.props.data_keys.map(key => (
                    <p>{key}: { this.formatNumbers(this.props.values_summary[key])}</p>
                    ))}
            </div>
        )
    }

}

export default DataSummary;
