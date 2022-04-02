import React from "react";
import BiddingDetails from "../CompanyPage/BiddingDetails.js";
import "../CompanyPage/AllBiddingsDetailsModal.css";


class AllBiddingsDetailsModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
			requests_done: 0,
            data: []
        }
    }
    
	batch_request_size = 4;
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;
    
    componentDidMount() {
        this.doBatchRequests();
    }
	
    async doBatchRequests(){
		var all_promises = [];
		var process_id = "";

		for(var i=0; i<this.props.processes_info.length; i++){
			all_promises = [];

			for (var j=0; j<this.batch_request_size; j++){

				if(!this.props.processes_info[j+i]) break;

				process_id = this.props.processes_info[j+i]["process_id"];

				all_promises.push(this.requestDataFromAPI(process_id));

				i += j;
			};

			//Wait a batch of requests to finish.
			await Promise.all(all_promises);
		}
	}
	
    //Call Backend API and retrieve data about Contracts
	requestDataFromAPI(process_id){
		var base_url = this.api_url + ":" + this.api_port;
		var request_url = base_url + "/biddings/process_id/" + process_id;

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

    appendData(data_received){
        var new_data = this.state.data.concat(data_received);
		var requests_done = this.state.requests_done + 1;
        let loading_state = (requests_done === this.props.processes_info.length) ? false : true;
        this.setState({data: new_data, loading: loading_state, requests_done: requests_done});
    }

    buildDetailsInfo(){
        let all_cards = [];
        let idx = 0;
        let background_color = "#ff9d9d";
        this.state.data.forEach((item) => {
            background_color = "ff9d9d";
            try{
                if(this.props.processes_info[idx]["flag"] === 'SIM'){
                    background_color = "9ED88A";
                }

                all_cards = all_cards.concat(
                    <div className="singleBiddingInfo" style={{backgroundColor: background_color}}>
                        {Object.keys(item).map((k, index) => (
                            <p>{k}: {item[k]}</p>
                        ))}
                    </div>
                );
                idx++;
            }
            catch(e){
                console.error(e);
                console.log("Skipping Bidding details...");
            }
        });
        return all_cards;
    }

    render(){

        let completed_perc = ((100*this.state.requests_done)/(this.props.processes_info.length)).toFixed(2);

        if(this.state.loading){
            return(
                <div className="allBiddingsDetailsModal">
                    <div className="modalBody">
                        <h1> Detalhes das Licitações: </h1>
                        <button onClick={this.props.callBackCloseModal} id="closeButton"> Fechar </button>
                        <p>Loading...</p>
                        <p>{completed_perc}%</p>
                    </div>
                </div>
            );
        }
        else{
            
            let biddings_info = this.buildDetailsInfo();

            return(
                <div className="allBiddingsDetailsModal">
                    <div className="modalBody">
                        <h1> Detalhes das Licitações: </h1>
                        <button onClick={this.props.callBackCloseModal} id="closeButton"> Fechar </button>
                        {biddings_info}
                    </div>
                </div>
            );
        }
    }
}

export default AllBiddingsDetailsModal;
