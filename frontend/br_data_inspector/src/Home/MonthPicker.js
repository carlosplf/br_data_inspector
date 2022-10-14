import React from 'react';
import { withRouter } from 'react-router-dom';
import '../Home/MonthPicker.css';


class MonthPicker extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            date_1: null,
            date_2: null
        };
    }

    possible_dates = [
        {
            'array_position': -1,
            'month': 'Selecionar',
            'year': '',
            'year_month': '0'
        },
        {
            'array_position': 1,
            'month': 'Janeiro',
            'year': '2020',
            'year_month': '202001'
        },
        {
            'array_position': 2,
            'month': 'Fevereiro',
            'year': '2020',
            'year_month': '202002'
        },
        {
            'array_position': 3,
            'month': 'Março',
            'year': '2020',
            'year_month': '202003'
        },
        {
            'array_position': 4,
            'month': 'Abril',
            'year': '2020',
            'year_month': '202004'
        },
        {
            'array_position': 5,
            'month': 'Maio',
            'year': '2020',
            'year_month': '202005'
        },
        {
            'array_position': 6,
            'month': 'Junho',
            'year': '2020',
            'year_month': '202006'
        },
        {
            'array_position': 7,
            'month': 'Julho',
            'year': '2020',
            'year_month': '202007'
        },
        {
            'array_position': 8,
            'month': 'Agosto',
            'year': '2020',
            'year_month': '202008'
        },
        {
            'array_position': 9,
            'month': 'Setembro',
            'year': '2020',
            'year_month': '202009'
        },
        {
            'array_position': 10,
            'month': 'Outubro',
            'year': '2020',
            'year_month': '202010'
        },
        {
            'array_position': 11,
            'month': 'Novembro',
            'year': '2020',
            'year_month': '202011'
        },
        {
            'array_position': 12,
            'month': 'Dezembro',
            'year': '2020',
            'year_month': '202012'
        },
        {
            'array_position': 13,
            'month': 'Janeiro',
            'year': '2021',
            'year_month': '202101'
        },
        {
            'array_position': 14,
            'month': 'Fevereiro',
            'year': '2021',
            'year_month': '202102'
        },
        {
            'array_position': 15,
            'month': 'Março',
            'year': '2021',
            'year_month': '202103'
        },
        {
            'array_position': 16,
            'month': 'Abril',
            'year': '2021',
            'year_month': '202104'
        },
        {
            'array_position': 17,
            'month': 'Maio',
            'year': '2021',
            'year_month': '202105'
        },
        {
            'array_position': 18,
            'month': 'Junho',
            'year': '2021',
            'year_month': '202106'
        },
        {
            'array_position': 19,
            'month': 'Julho',
            'year': '2021',
            'year_month': '202107'
        },
        {
            'array_position': 20,
            'month': 'Agosto',
            'year': '2021',
            'year_month': '202108'
        },
        {
            'array_position': 21,
            'month': 'Setembro',
            'year': '2021',
            'year_month': '202109'
        },
        {
            'array_position': 22,
            'month': 'Outubro',
            'year': '2021',
            'year_month': '202110'
        },
        {
            'array_position': 23,
            'month': 'Novembro',
            'year': '2021',
            'year_month': '202111'
        },
        {
            'array_position': 24,
            'month': 'Dezembro',
            'year': '2021',
            'year_month': '202112'
        },
        {
            'array_position': 25,
            'month': 'Janeiro',
            'year': '2022',
            'year_month': '202201'
        },
        {
            'array_position': 26,
            'month': 'Fevereiro',
            'year': '2022',
            'year_month': '202202'
        },
        {
            'array_position': 27,
            'month': 'Março',
            'year': '2022',
            'year_month': '202203'
        },
        {
            'array_position': 28,
            'month': 'Abril',
            'year': '2022',
            'year_month': '202204'
        },
        {
            'array_position': 29,
            'month': 'Maio',
            'year': '2022',
            'year_month': '202205'
        },
        {
            'array_position': 30,
            'month': 'Junho',
            'year': '2022',
            'year_month': '202206'
        },
        {
            'array_position': 31,
            'month': 'Julho',
            'year': '2022',
            'year_month': '202207'
        },
        {
            'array_position': 32,
            'month': 'Agosto',
            'year': '2022',
            'year_month': '202208'
        },
        {
            'array_position': 33,
            'month': 'Setembro',
            'year': '2022',
            'year_month': '202209'
        },
        {
            'array_position': 34,
            'month': 'Outubro',
            'year': '2022',
            'year_month': '202210'
        },
        {
            'array_position': 35,
            'month': 'Novembro',
            'year': '2022',
            'year_month': '202211'
        },
        {
            'array_position': 36,
            'month': 'Dezembro',
            'year': '2022',
            'year_month': '202212'
        },
    ]

    firstMonthSelected = (event) => {
        this.setState({date_1: parseInt(event.target.value)});
    }

    secondMonthSelected = (event) => {
        this.setState({date_2: parseInt(event.target.value)});
    }

    checkDates(){
        if(this.state.date_1 && this.state.date_2){
            if(this.state.date_1 < 0 || this.state.date_2 < 0){
                console.log("Mês não selecionado");
                return;
            }
            if(this.state.date_1 < this.state.date_2){
                this.buildDatesArray();
            }
            else{
                console.log("Invalid date range!");
            }
        }
    }

    buildDatesArray(){
        var dates_array = [];
        for(var i=this.state.date_1; i<=this.state.date_2; i++){
            dates_array.push(this.possible_dates[i]["year_month"]);
        }
        this.props.receiveDatesList(dates_array);
    }

    buildMonthList(){

        var month_list = this.possible_dates.map(item => {
            return(
                <option value={item["array_position"]}>{item["month"]} {item["year"]}</option>
            );
        });

        return month_list;
    }

    render(){

        const month_list = this.buildMonthList();

        this.checkDates();

        return (
            <div className="monthSelector">
                <div className="firstMonthDiv">
                    <p className="monthPickerLabel">De:</p>
                    <form className="monthPicker1">
                        <select onChange={this.firstMonthSelected} id="firstMonth" name="firstMonth">
                            {month_list}
                        </select>
                    </form>
                </div>
                <div className="secondMonthDiv">
                    <p className="monthPickerLabel">Até:</p>
                    <form className="monthPicker2">
                        <select onChange={this.secondMonthSelected} id="firstMonth" name="firstMonth">
                            {month_list}
                        </select>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(MonthPicker);
