import React from 'react';
import Header from './Header';
import './Rank.css';


class Rank extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            data: null
        }
    }

    componentDidMount(){
        this.requestDataFromAPI();
    }

    buildTable(){
        if(this.state.loading || !this.state.data){
            return <spam></spam>
        }
        console.log("Data: ", this.state.data);
        var data_table = this.state.data["data"].map((row, i)=> {
            return(
                <tr>
                    <td>{row["Código Órgão Subordinado"]}</td>
                    <td>{row["Nome Órgão Subordinado"]}</td>
                    <td>{row["Total received"]}</td>
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
                        <th> Valor </th>
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
        var api_address = "http://localhost"
        var api_port = ":8080"
        var api_request = "/rank"
		var request_url = api_address + api_port + api_request;
		console.log(request_url);
		fetch(request_url)
			.then(response => response.json())
			.then(data => {
				this.setState({ data: data, loading: false})
			});
	}

    render(){
        if(this.state.loading){
            return(
                <div className="rankPage">
                    <Header header_text="BR Data Collector"/>
                    <h1>Rank Page Loading...</h1>
                </div>
            )
        }
        else{
            const data_table = this.buildTable();
            return(
                <div className="rankPage">
                    <Header header_text="BR Data Collector"/>
                    <h1>Rank Page Loaded!</h1>
                    {data_table}
                </div>
            )
        }
    }
}

export default Rank;