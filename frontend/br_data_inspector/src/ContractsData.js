import React from 'react';
import { withRouter } from 'react-router-dom';
import ContractsTable from './ContractsTable';
import ContractDetails from './ContractDetails';
import './ContractsData.css';


class ContractsData extends React.Component{
	constructor(props) {

        //Should receive as props the Entity ID and Date (Year (?))
		super(props);
		this.state = {
			loading: true, 
			data: [],
			data_keys: [],
			requests_done: 0
		};
	}

    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT; 

	componentDidMount(){
		if (this.state.data.length === 0 && this.props.entity_id !== ''){
			this.setState({loading: true});
			this.props.dates.forEach(single_date =>{
				this.requestDataFromAPI(single_date);
			})
		}
	}

    //For each Contracts search (one search per month), append data.
    appendData(data_received){
        var new_data = this.state.data.concat(data_received);
		var requests_done = this.state.requests_done + 1;
        this.setState({data: new_data, loading: false, requests_done: requests_done});
    }

	//Call Backend API and retrieve data about Entities
	requestDataFromAPI(month_date){
		var base_url = this.api_url + ":" + this.api_port;
		var request_url = base_url + "/contracts/" + this.props.entity_id + "/" + month_date;

		fetch(request_url)
			.then(response => response.json())
			.then(data => {
				this.appendData(data["data"]);
			});
	}

	render(){
        
		if(this.state.loading || (this.state.requests_done < (this.props.dates.length - 1))){
			return <h1> Buscando dados de Contratos... </h1>
        }

        if(this.state.data.length == 0){
            return <h1> Sem contratos para o período. </h1>
        }

        else{
            return (
                <div className="contracts">
                    <ContractsTable contracts_data={this.state.data}/>
                </div>
            );
        }
	}
}

export default withRouter(ContractsData);
