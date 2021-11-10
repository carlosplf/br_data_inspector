import React from 'react';
import Header from './Header';
import './RankTable.css';


class RankTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: null
        }
    }
    
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT; 
    frontend_url = process.env.REACT_APP_FRONTEND_URL; 
    frontend_port = process.env.REACT_APP_FRONTEND_PORT; 

    url_dates_2020 = "&dates=202001-202002-202003-202004-202005-202006-202007-202008-202009-202010-202011-202012";
    url_dates_2021 = "&dates=202101-202102-202103-202104-202105-202106";

    componentDidMount(){
        this.requestDataFromAPI();
    }

    buildTable(){
        if(this.state.loading || !this.state.data){
            return <spam></spam>
        }
        console.log("Data: ", this.state.data);

        var dates_param = this.url_dates_2020;

        if(this.props.date_year == 2021){
            dates_param = this.url_dates_2021;
        }

        if (this.frontend_port == 80){
            var table_row_base_url = this.frontend_url + "/details?id=";
        }
        else{
            var table_row_base_url = this.frontend_url + ":" + this.frontend_port + "/details?id=";
        }

        var data_table = this.state.data["data"].map((row, i)=> {
            return(
                <tr>
                    <td><a href={
                           table_row_base_url + row["Código Órgão Subordinado"] + dates_param
                        }>{row["Código Órgão Subordinado"]}</a></td>
                    <td>{row["Nome Órgão Subordinado"]}</td>
                    <td className="value-column">R$ {this.formatNumbers(row["Total Recebido"].toFixed(0))},00</td>
                </tr>
            )
        })
        
        return (
            <div className="rankTable">
                <table>
                <tbody>
                    <tr>
                        <th> ID </th>
                        <th> Nome </th>
                        <th> Valor PAGO </th>
                    </tr>
                    {data_table}
                </tbody>
                </table>
            </div>
        )
    }

    requestDataFromAPI(){
        this.setState({loading: true});
		// Call Backend API and retrieve data
		console.log("Requesting data...");
        var api_request = "rank/" + this.props.date_year;
        var request_url = this.api_url + ":" + this.api_port + "/" + api_request;
		console.log(request_url);
		fetch(request_url)
			.then(response => response.json())
			.then(data => {
				this.setState({ data: data, loading: false})
			});
	}
    
    //TODO: Check if the numbers are being formated in a proper way for decimals.
    formatNumbers(x) {
        if (!x) {return 0}
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    render(){
        if(this.state.loading){
            return(
                <div className="tableDiv">
                    <h1>Rank Page Loading...</h1>
                </div>
            )
        }
        else{
            const data_table = this.buildTable();
            return(
                <div className="tableDiv">
                    <p>
                        Tabela com entidades classificadas como Subordinadas, ordenadas
                        por valores recebidos (Valor PAGO) somados em {this.props.date_year}.
                    </p>
                    {data_table}
                </div>
            )
        }
    }
}

export default RankTable;
