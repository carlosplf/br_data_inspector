import React from 'react';
import {
    RadialChart,
    Hint
} from 'react-vis';
import "../Expenses/ExpensesChart.css";


class ExpensesChart extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show_hint: false,
        }
    }

    buildChartData(){
        // Based on the Expenses data received as props, build
        // the Pie Chart data.
        let expenses_shares = [];
        let chart_label = "";
        let share = 0.0;

        Object.keys(this.props.expenses).forEach((k) => {

            let single_entry = this.props.expenses[k];
            
            share = (parseFloat(single_entry["Valor Pago"])/parseFloat(this.props.total_in_expenses))*100;
            share = share.toFixed(2);
            
            chart_label = single_entry["Nome"] + " (" + share.toString() + "%)";

            expenses_shares = expenses_shares.concat(
                {
                    angle: share,
                    label: chart_label,
                }
            );
        });
        return expenses_shares;
    }

    showHint() {
        // Buid Hints for RadialChart. The Component state defines when to
        // render the Hint or not.
        if(!this.state.show_hint) return null;

        let hint_values = {
            Categoria: this.state.show_hint.label
        }

        return(
           <Hint value={this.state.show_hint}>
                <div className="expensesChartHint">
                    <p>{this.state.show_hint.label} </p>
                </div>
           </Hint>
        );
    }

    render(){
        let expenses_shares = this.buildChartData();
        const show_hint = this.state.show_hint;
        let hint = this.showHint();

        return(
            <div className="expensesChart">
                <div className="chartContainer">
                    <RadialChart
                        data={expenses_shares}
                        getAngle={d => d.angle}
                        padAngle={0.04}
                        width={300}
                        height={300}
                        innerRadius={100}
                        radius={150}
                        onValueMouseOver={v => {
                            this.setState({show_hint: v});
                        }}
                        onSeriesMouseOut={v => this.setState({show_hint: false})}
                    >
                        {hint}
                    </RadialChart>
                </div>
            </div>
        );
    }
}

export default ExpensesChart;
