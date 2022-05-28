import React from "react";
import {CSVLink} from 'react-csv';
import "../CompanyPage/AllBiddingsDetailsModal.css";


class AllBiddingsDetailsModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
			requests_done: 0,
            data: {},
            //the data_formated state control when to call
            //the adjustBiddingsValues() function.
            //It should be called with all data loaded, and once.
            data_formated: false
        }
    }
    
	batch_request_size = 6;
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;
    
    componentDidMount() {
        this.doBatchRequests();
    }
	
    async doBatchRequests(){
		let all_promises = [];
		let process_id = "";

        let processes_info_keys = Object.keys(this.props.processes_info);

		for(var i=0; i< processes_info_keys.length;){
			all_promises = [];

			for (var j=0; j<this.batch_request_size; j++){

				if(!this.props.processes_info[processes_info_keys[i]]) break;

				process_id = this.props.processes_info[processes_info_keys[i]]["process_id"];

				all_promises.push(this.requestDataFromAPI(process_id));

				i++;
			};

			//Wait a batch of requests to finish.
			await Promise.all(all_promises);
		}
	}
	
    //Call Backend API and retrieve data about Contracts
	requestDataFromAPI(process_id){

        //Some process IDs have a '/' character.
        process_id = process_id.replace("/", "_");

		var base_url = this.api_url + ":" + this.api_port;
		var request_url = base_url + "/biddings/process_id/" + process_id;

		return new Promise((resolve, reject) => {
			return fetch(request_url).then(response => response.json()).then(data => {
				if (data) {
					resolve(this.appendData(data["data"]));
				} else {
					reject(new Error('Request failed. Empty Data return.'))
				}
			}).catch((message) => { 
                throw "Error collecting more info about Bidding.";
            });
		})
	}

    appendData(data_received){
        let new_data = this.state.data;

        try{
            //TODO: Understand why in some cases we don't have data about the Bidding,
            //even with an Process ID.

            //Use the process_id as key to store data.
            new_data[data_received[0]["Número Processo"]] = data_received[0];
        }catch(e){
            console.error(e);
            console.log("Could not set process_id. Empty return?");
        }
		
        let requests_done = this.state.requests_done + 1;
        
        let loading_state = (requests_done === Object.keys(this.props.processes_info).length) ? false : true;
        
        this.setState({data: new_data, loading: loading_state, requests_done: requests_done});
    }

    buildCSV(){

        let csv_items = [];
        let csv_header = [];
        let new_csv_entry = [];
        let build_hearders = true;

        Object.keys(this.props.processes_info).forEach((key) => {
            //For each item disputed, get the corresponding Bidding information
            //stored in the this.state.data.
            let bidding_details = this.state.data[this.props.processes_info[key]["process_id"]];

            new_csv_entry = [];

            Object.keys(bidding_details).forEach((inner_key) => {
                if(build_hearders){ csv_header = csv_header.concat(inner_key); }
                new_csv_entry = new_csv_entry.concat(bidding_details[inner_key]);
            });

            if(csv_header.length !== 0 && build_hearders){
                csv_items = csv_items.concat([csv_header]);
                build_hearders = false;
            }

            csv_items = csv_items.concat([new_csv_entry]);
        });
        
        return csv_items;
    }

    buildDetailsInfo(){
        /*
         * To build the card for each Bidding that the Company disputed, we
         * consider the basic info received as props as the key for all the
         * items.
         * A Company can dispute more than 1 item in the same Bidding process.
         * So the process ID can be duplicated, but we can't have the same
         * Item ID in the same Process ID.
         *
         * For each Item disputed, we collect the Bidding process information
         * and use it to build the card.
         *
         * We can have 5 items in the props.processes_info, and 2 items in the
         * state.data, for example. This ir normal considering the a Bidding can
         * have more then 1 item.
         */
        let all_cards = [];
        let background_color = "#ff9d9d";

        if(!this.state.data_formated) this.adjustBiddingsValues();

        //For each item disputes... received as props.
        Object.keys(this.props.processes_info).forEach((key) => {
            background_color = "ff9d9d";
            try{
                if(this.props.processes_info[key]["flag"] === 'SIM'){
                    background_color = "9ED88A";
                }

                //For each item disputed, get the corresponding Bidding information
                //stored in the this.state.data.
                let bidding_details = this.state.data[this.props.processes_info[key]["process_id"]];

                //For each item, build the summary card, using data from props and state.
                all_cards = all_cards.concat(
                    <div className="singleBiddingInfo" style={{backgroundColor: background_color}}>

                        <p>Item da Compra: {this.props.processes_info[key]["item"]}</p>
                        <p>Código do Item: {this.props.processes_info[key]["cod_item"]}</p>
                        <p>Ganhou: {this.props.processes_info[key]["flag"]}</p>
                        {Object.keys(bidding_details).map((k, index) => (
                            <p>{k}: {bidding_details[k]}</p>
                        ))}
                    </div>
                );
            }
            catch(e){
                console.error(e);
                console.log("Skipping Bidding details...");
            }
        });
        return all_cards;
    }

    adjustBiddingsValues() {
        /*
         * Format some values inside Biggind data.
         * => Price value ('Valor Licitação') is formated to BRL.
         * => Object value if formated and the word 'Objeto' is
         * removed from value.
         */

        if(this.state.data_formated) return;

        let original_value = "";
        let new_value = "";

        let all_biddings = this.state.data;

        Object.keys(all_biddings).forEach((k) => {
            
            original_value = all_biddings[k]["Valor Licitação"];
            new_value = original_value.slice(0, -2);
            new_value = new_value.replace("R$", "");
            
            if(!new_value){
                all_biddings[k]["Valos Licitação"] = 0;
            }
            
            all_biddings[k]["Valor Total Formatado"] = "R$" + new_value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            //remove the word 'Objeto' from field value.
            all_biddings[k]["Objeto"] = all_biddings[k]["Objeto"].slice(4,10000);
                
        });

        this.setState({data: all_biddings, data_formated: true});
    }

    render(){

        let completed_perc = ((100*this.state.requests_done)/(Object.keys(this.props.processes_info).length)).toFixed(2);
        let completed_perc_str = "" + parseInt(completed_perc) + "%";
        
        if(this.state.loading){
            return(
                <div className="allBiddingsDetailsModal">
                    <div className="biddingsModalBody">
                        <h1> Detalhes das Licitações: </h1>
                        <button onClick={this.props.callBackCloseModal} id="closeButton"> Fechar </button>
                        <div className="loadingBlock">
                            <p id="loadingMsg">Buscando mais informações...</p>
                                <div className="loadingBar">
                                    <div style={{width: completed_perc_str}} className="loadingBarProgress"/>
                                </div>
                        </div>
                    </div>
                </div>
            );
        }
        else{
            
            let biddings_info = this.buildDetailsInfo();
            let csv_data = this.buildCSV();

            return(
                <div onClick={this.props.callBackCloseModal} className="allBiddingsDetailsModal">
                    <div onClick={e => e.stopPropagation()} className="biddingsModalBody">
                        <h1> Detalhes das Licitações: </h1>
                        <button onClick={this.props.callBackCloseModal} id="closeButton"> Fechar </button>
                        <CSVLink className="downloadButton" filename="biddings_data.csv" data={csv_data} >Download CSV</CSVLink>
                        {biddings_info}
                    </div>
                </div>
            );
        }
    }
}

export default AllBiddingsDetailsModal;
