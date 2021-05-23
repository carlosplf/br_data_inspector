import React from "react";


class DataSummary extends React.Component{

    constructor(props){
        super(props);
        this.state = {values_summary: {}}
        this.data_keys = ["Valor Empenhado (R$)", "Valor Liquidado (R$)", "Valor Pago (R$)", "Valor Restos a Pagar Cancelado (R$)", "Valor Restos a Pagar Inscritos (R$)", "Valor Restos a Pagar Pagos (R$)"];
    }

    componentDidMount(){
        this.sumData();
    }

    sumData(){
        var value_keys = this.data_keys;
        var all_sums = {};
        this.props.data.forEach(single_line => {
            value_keys.forEach(key => {
            if (!all_sums[key]) { all_sums[key] = 0; }
            all_sums[key] += parseFloat(single_line[key]);
            })
        });
        this.setState({"values_summary": all_sums});
    }

    render(){
        return(
            <div className="Data-Summary">
                <h2> Resumo de valores: </h2>
                {this.data_keys.map(key => (
                    <p>{key}: {this.state.values_summary[key]}</p>
                    ))}
            </div>
        )
    }

}

export default DataSummary;