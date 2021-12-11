import React from 'react';
import { withRouter } from 'react-router-dom';
import ContractsTable from './ContractsTable';


class ContractsData extends React.Component{
	constructor(props) {

        //Should receive as props the Entity ID and Date (Year (?))
		super(props);
		this.state = {
			loading: true, 
			data: [],
			data_keys: []
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

	//For each API response data, concatenate with already collected data in state.
	processData(api_response){
        if(api_response["data"].length === 0){
            console.log("Empty!");
        }
		if (!this.state.data){
			return api_response["data"];
		}
		return this.state.data.concat(api_response["data"]);
	}

    //For each Contracts search (one search per month), append data.
    appendData(data_received){
        var new_data = this.state.data.concat(data_received);
        this.setState({data: new_data});
        console.log(this.state.data);
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
        return (<ContractsTable contracts_data={this.state.data}/>);
	}
}

export default withRouter(ContractsData);
