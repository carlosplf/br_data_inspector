import React from 'react';
import DataSummary from "./DataSummary.js";
import { withRouter } from 'react-router-dom'
import DataBarChartComparison from './DataBarChartComparison.js';
import Header from './Header';
import Loading from './Loading';
import './DataCompare.css';
import CreateCustomLink from './CreateCustomLink.js';
import ExpensesTable from './ExpensesTable.js';
import queryString from 'query-string';
import LoadingBar from 'react-top-loading-bar'


class DataCompare extends React.Component{
    //Component responsible for showing two Entities data as a comparison.
	constructor(props) {
		super(props);
		this.state = {
			loading: true, 
			data1: undefined,
            data2: undefined,
			values_summary1: {},
            values_summary2: {},
            all_requests: 0,
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

	entity_id1 = 0;
    entity_id2 = 0;
	dates_to_search = [];
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT; 

	componentDidMount(){
		this.getURLParams();
		if ((!this.state.data1) && (!this.state.data2) && (this.entity_id1 !== '') && (this.entity_id2 !== '')){
			this.setState({loading: true});
			//TODO: Need a better logic to collect from multiple dates.
			this.requestDataFromAPI();
		}
	}

	getURLParams(){
		// This route URL receives the Entity ID and the Dates for query as arguments.
		// Example: "http://localhost:3000/table?id=26236&dates=202001-202003-202002"
		const value = queryString.parse(this.props.location.search);
		const entity_id1 = value.id1;
        const entity_id2 = value.id2;
		this.entity_id1 = entity_id1;
        this.entity_id2 = entity_id2;
        console.log("ID 1: ", this.entity_id1);
        console.log("ID 2: ", this.entity_id2);
		this.dates_to_search = value.dates.split("-");
		console.log("Dates got from URL params: " + this.dates_to_search);
	}

	sumData(data_slot){
		//Sum data from table lines, building a data summary dict.
        //Now, for this Component, two data summary are created, one for each Entity searched.

        //data_slot refers to 1st or 2nd Entity beeing compare.

        var all_sums = {};
		var data_state = [];
		
        if(data_slot === 1){
			data_state = this.state.data1;
		}
		else if(data_slot === 2){
			data_state = this.state.data2;
		}
		else{
			return;
		}
		
        data_state.forEach(single_line => {
			this.state.data_keys.forEach(key => {
				if (!all_sums[key]) { all_sums[key] = 0; }
				all_sums[key] += parseFloat(single_line[key]);
			})
		});

		if(data_slot === 1){
			this.setState({values_summary1: all_sums});
		}
		else{
			this.setState({values_summary2: all_sums});
		}

        this.setState({all_requests: this.state.all_requests + 1});

	}

	processData(api_response, data_slot){
		//For each API response, concatenate with already collected data in state.
		if(data_slot === 1){
			if (!this.state.data1){
				// There is no data yet collected for this Entity. Returning the request payload as first data.
				return api_response["data"];
			}
			return this.state.data1.concat(api_response["data"]);
		}
		else{
			if (!this.state.data2){
				return api_response["data"];
			}
			return this.state.data2.concat(api_response["data"]);
		}
	}

	requestDataFromAPI(){
		//Call Backend API and retrieve data about Entities
        this.dates_to_search.forEach(month_date =>{
            this.doAPIRequest(this.entity_id1, 1, month_date);
            this.doAPIRequest(this.entity_id2, 2, month_date);
        });
	}

    doAPIRequest(entity_id, data_slot, month_date){
		/* 
			Call the backend API to collect data from Database.
			The payload response is processed and added to the State Data variable.

			DATA_SLOT: this is the argument to tell the component if we are collecting
			data for the Entity 1 ou 2, since it is a Comparison component.
		*/
        var base_url = this.api_url + ":" + this.api_port;
		var request_url = base_url + "/" + this.props.entity_type.toLowerCase() + "/" + month_date + "/" + entity_id;
		fetch(request_url)
			.then(response => response.json())
			.then(data => {
				this.saveData(data_slot, data);
			});
    }

    saveData(data_slot, data){
		/*  
			Process data from API request and save to the right Data state.
			Entity 1 is state.data1;
			Entity 2 is state.data2;
		*/
        if (data_slot === 1){
            this.setState({ data1: this.processData(data, 1)});
			this.sumData(1);
        }
        else{
            this.setState({ data2: this.processData(data, 2)});
			this.sumData(2);
        }

        //Loading is set to False when both dataset are collected and not empty
        if (this.state.data1 && this.state.data2){
            this.setState({loading: false});
        }
        return;
    }

	selectedDates(){
		return this.dates_to_search.map(d => {
			return <spam> {d} </spam>
		});
	}

	handleCloseCLModal = () => {
		this.setState({
			show_custom_link_modal: false
		})
	}

	handleShareButton = () => {
		this.setState({show_custom_link_modal: true});
	}

	render(){

        if (this.state.loading){
			return (<Loading/>);
		}
        
        else if (this.state.data1.length === 0 || this.state.data2.length === 0){
			return(
				<div className="search-results">
					<Header
						handleShareButton={this.handleShareButton}
						show_share_button={true}
						header_text="Comparação de Despesas"
						handle_modal={this.handleOpenDataModal}
						dark_background={true}
					/>
                    <h1> Ops, sem dados para o período :( </h1>
                </div>
            )
        }

		else{
            //Define progress for ProgressBar. <number_of_requests>/<total_requests_to_do>
            const progress = 100*(this.state.all_requests/(this.dates_to_search.length*2));
			
            return (
				<div className="Search-Results">

					<Header
						handleShareButton={this.handleShareButton}
						show_share_button={false}
						header_text="Comparação entre Instituições"
						handle_modal={this.handleOpenDataModal}
						dark_background={true}
					/>

                    <CreateCustomLink show={this.state.show_custom_link_modal} handleClose={this.handleCloseCLModal}/>
                    
                    <LoadingBar
                        color='#009C3B'
                        progress={progress}
                        height={8}
                        onLoaderFinished={() => {console.log("Finished loading.")}}
                    />

					<div className="summary-container">
						<DataSummary dates={this.dates_to_search} name={this.state.data1[0]["Nome Órgão Subordinado"]} key={this.entity_id1} data={this.state.data1} values_summary={this.state.values_summary1} data_keys={this.state.data_keys}/>
                        <div className="summary-separator"></div>
                        <DataSummary dates={this.dates_to_search} name={this.state.data2[0]["Nome Órgão Subordinado"]} key={this.entity_id2} data={this.state.data2} values_summary={this.state.values_summary2} data_keys={this.state.data_keys}/>
					</div>

					<DataBarChartComparison
						data_keys={this.state.data_keys}
						all_transactions_data_1={this.state.data1}
						all_transactions_data_2={this.state.data2}
						selected_dates={this.dates_to_search}
                    />

                    <div className="expensesContainer"> 
                        <ExpensesTable entity_name={this.state.data1[0]["Nome Órgão Subordinado"]} data={this.state.data1}/>
                        <ExpensesTable entity_name={this.state.data2[0]["Nome Órgão Subordinado"]} data={this.state.data2}/>
                    </div>
				</div>
			)
		}
    }
}

export default withRouter(DataCompare);
