import React from 'react';
import { AllCheckerCheckbox, Checkbox, CheckboxGroup } from '@createnl/grouped-checkboxes';


class MonthPicker extends React.Component{
    constructor(props){
        super(props);
    }

    possible_dates = [
        {
            'month': 'Janeiro',
            'year': '2020',
            'year_month': '202001'
        },
        {
            'month': 'Fevereiro',
            'year': '2020',
            'year_month': '202002'
        },
        {
            'month': 'Março',
            'year': '2020',
            'year_month': '202003'
        },
        {
            'month': 'Abril',
            'year': '2020',
            'year_month': '202004'
        },
        {
            'month': 'Maio',
            'year': '2020',
            'year_month': '202005'
        },
        {
            'month': 'Junho',
            'year': '2020',
            'year_month': '202006'
        },
        {
            'month': 'Julho',
            'year': '2020',
            'year_month': '202007'
        },
        {
            'month': 'Agosto',
            'year': '2020',
            'year_month': '202008'
        },
        {
            'month': 'Setembro',
            'year': '2020',
            'year_month': '202009'
        },
        {
            'month': 'Outubro',
            'year': '2020',
            'year_month': '202010'
        },
        {
            'month': 'Novembro',
            'year': '2020',
            'year_month': '202011'
        },
        {
            'month': 'Dezembro',
            'year': '2020',
            'year_month': '202012'
        },
        {
            'month': 'Janeiro',
            'year': '2021',
            'year_month': '202101'
        },
        {
            'month': 'Fevereiro',
            'year': '2021',
            'year_month': '202102'
        },
        {
            'month': 'Março',
            'year': '2021',
            'year_month': '202103'
        },
        {
            'month': 'Abril',
            'year': '2021',
            'year_month': '202104'
        },
        {
            'month': 'Maio',
            'year': '2021',
            'year_month': '202105'
        },
        {
            'month': 'Junho',
            'year': '2021',
            'year_month': '202106'
        }
    ]

    render(){
        var table_lines = this.possible_dates.map(item => {
            var checkbox_identifier = item['year_month'];
            return(
                <tr>
                    <td>{item['month']}</td>
                    <td>{item['year']}</td>
                    <td><Checkbox value={checkbox_identifier}/></td>
                </tr>
            );
        });
        return(
            <div className="month-picker">
                <CheckboxGroup onChange={this.props.dateSelected}>
                <table>
                    <tbody>
                        <tr>
                            <td className="select-all">TODOS</td>
                            <td className="select-all">2020/01</td>
                            <td><AllCheckerCheckbox/></td>
                        </tr>
                        {table_lines}
                    </tbody>
                </table>
                </CheckboxGroup>
            </div>
        )
    }
}

export default MonthPicker;
