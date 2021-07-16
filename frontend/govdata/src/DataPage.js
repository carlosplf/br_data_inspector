import React from 'react';
import DataSummary from "./DataSummary.js";
import { withRouter } from 'react-router-dom'
import Button from './Button';
import ReactModal from 'react-modal';
import ModalContent from './ModalContent';
import DataBarChart from './DataBarChart';

import queryString from 'query-string';
import "./DataPage.css";


class DataPage extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			loading: true, 
			data: undefined,
			show_modal: false,
			values_summary: {},
			data_keys: [
				"Valor Empenhado (R$)",
				"Valor Liquidado (R$)",
				"Valor Pago (R$)",
				"Valor Restos a Pagar Cancelado (R$)",
				"Valor Restos a Pagar Inscritos (R$)",
				"Valor Restos a Pagar Pagos (R$)"
			]
		};
	}

	//Should be a state.
	entity_id = 0;
	dates_to_search = [];

	handleOpenDataModal = () => {
		this.setState({ show_modal: true });
	}

	handleCloseDataModal = () => {
		this.setState({ show_modal: false });
	}

	componentDidMount(){
		this.getURLParams();
		if (!this.state.data && this.entity_id !== ''){
			this.setState({loading: true});
			//TODO: Need a better logic to collect from multiple dates.
			console.log("Dates: " + this.dates_to_search);
			this.dates_to_search.forEach(single_date =>{
				this.requestDataFromAPI(single_date);
			})
		}
	}

	getURLParams(){
		// This route URL receives the Entity ID and the Dates for query as arguments.
		// Example: "http://localhost:3000/table?id=26236&dates=202001-202003-202002"
		const value = queryString.parse(this.props.location.search);
		const entity_id = value.id;
		this.entity_id = entity_id;
		this.dates_to_search = value.dates.split("-");
		console.log("Dates got from URL params: " + this.dates_to_search);
	}

	sumData(){
		//Sum data from table lines, building a data summary dict.
		var all_sums = {};
		this.state.data.forEach(single_line => {
			this.state.data_keys.forEach(key => {
				if (!all_sums[key]) { all_sums[key] = 0; }
				all_sums[key] += parseFloat(single_line[key]);
			})
		});
		this.setState({values_summary: all_sums});
	}

	processData(api_response){
		//For each API response data, concatenate with already collected data in state.
		if (!this.state.data){
			return api_response["data"];
		}
		return this.state.data.concat(api_response["data"]);
	}

	requestDataFromAPI(month_date){
		// Call Backend API and retrieve data about Entities
		console.log("requesting data...");
		//TODO: need a better logic to store backend URL.
		var base_url = "http://localhost:8080/";
		var request_url = base_url + this.props.entity_type.toLowerCase() + "/" + month_date + "/" + this.entity_id;
		console.log(request_url);
		fetch(request_url)
			.then(response => response.json())
			.then(data => {
				this.setState({ data: this.processData(data), loading: false})
				this.sumData();
			});
	}

	selectedDates(){
		return this.dates_to_search.map(d => {
			return <spam> {d} </spam>
		});
	}

	render(){
		if (this.state.loading){
			return (<p>Loading...</p>);
		}

		else{
			return (
				<div className="Search-Results">

				<h1>RECEBEDOR: {this.state.data[0]["Nome Órgão Subordinado"]}</h1>
				<br></br>

				<Button/>

				<button id="all-data-btn" className="btn" onClick={this.handleOpenDataModal}>All Data</button>

				<DataSummary key={this.entity_id} data={this.state.data} values_summary={this.state.values_summary} data_keys={this.state.data_keys}/>

				<DataBarChart
				data_keys={this.state.data_keys}
				all_transactions_data={this.state.data}
				selected_dates={this.dates_to_search}
				/>

				<ReactModal isOpen={this.state.show_modal} contentLabel="All transactions modal">
				<button id="close-modal-btn" className="modal-btn" onClick={this.handleCloseDataModal}>Close Modal</button>
				<ModalContent all_transactions_data={this.state.data}/>
				</ReactModal>

				</div>
			)
		}
	}
}

export default withRouter(DataPage);
