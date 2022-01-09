import React from 'react';
import { withRouter } from 'react-router-dom';
import ContractsTable from '../ContractsData/ContractsTable';
import '../ContractsData/ContractsData.css';


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

	batch_request_size = 2;
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

	componentDidMount(){
		if (this.state.data.length === 0 && this.props.entity_id !== ''){
			this.setState({loading: true});
			this.doBatchRequests();
		}
	}

	async doBatchRequests(){
		var all_promises = [];
		var month_date = "";

		for(var i=0; i<this.props.dates.length; i++){
			all_promises = [];

			for (var j=0; j<this.batch_request_size; j++){

				if(!this.props.dates[j+i]){
					break;
				}

				month_date = this.props.dates[j+i];

				//For each month_date iteration step, request data for Entity 1 and 2.
				all_promises.push(this.requestDataFromAPI(month_date));

				i += j;
			};

			//Wait a batch of requests to finish.
			await Promise.all(all_promises);
		}
	}

    //For each Contracts search (one search per month), append data.
    appendData(data_received){
        var new_data = this.state.data.concat(data_received);
		var requests_done = this.state.requests_done + 1;
        this.setState({data: new_data, loading: false, requests_done: requests_done});
    }

	//Call Backend API and retrieve data about Contracts
	requestDataFromAPI(month_date){
		var base_url = this.api_url + ":" + this.api_port;
		var request_url = base_url + "/contracts/" + this.props.entity_id + "/" + month_date;

		return new Promise((resolve, reject) => {
			return fetch(request_url).then(response => response.json()).then(data => {
				if (data) {
					resolve(this.appendData(data["data"]));
				} else {
					reject(new Error('Request failed. Empty Data return.'))
				}
			}, error => {
				reject(new Error('Request failed.'))
			})
		})
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
                <div className="contractsBlock">
					<h1> Contratos assinados no período: </h1>
                	<p id="clickToExpand">(clique na linha para expandir)</p>
					<h3 id="entityName">{this.props.entity_name}</h3>
                    <ContractsTable contracts_data={this.state.data}/>
                </div>
            );
        }
	}
}

export default withRouter(ContractsData);
