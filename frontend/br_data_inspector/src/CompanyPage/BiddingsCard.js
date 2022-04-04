import React from "react";
import "../CompanyPage/BiddingsCard.css";
import BiddingDetails from "../CompanyPage/BiddingDetails.js";
import AllBiddingsDetailsModal from "../CompanyPage/AllBiddingsDetailsModal";


class BiddingsCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            show_details: false
        }
    }
    
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    componentDidMount() {
        // CNPJ = Brazil Company ID.
        this.requestDataFromAPI(this.props.cnpj);
    }

    showHideModal = () => {
       this.setState({show_details: !this.state.show_details}) 
    }
    
    requestDataFromAPI(company_cnpj) {
        var base_url = this.api_url + ":" + this.api_port;
        var request_url = base_url + "/companies/biddings/" + company_cnpj;

        return new Promise((resolve, reject) => {
            return fetch(request_url)
                .then((response) => response.json())
                .then(
                    (data) => {
                        if (data) {
                            resolve(this.setState({data: data["data"], loading: false}));
                        } else {
                            reject(
                                console.log(
                                    "Biddings for the CNPJ request returned empty."
                                )
                            );
                        }
                    },
                    (error) => {
                        reject(new Error("Request failed."));
                    }
                );
        });
    }

    calculateBiddings(){
        /* 
         * This Bidding and processes and structures can be confusing.
         * Biddings can be duplicated, since the Bidding itself can contain
         * more than 1 item.
         * 
         * A Company can Win a item inside the Bidding, but lose others.
         * The bidding_summary stores the basic info for each item disputed
         * by a company. So we can have repeated Process Numbers, but not the
         * same Item ID in the same Process Number.
         */

        let biddings_summary = {
            "total": this.state.data.length,
            "wins": 0,
            "win_rate": 0,
            "processes_info": {},
        };
        
        if(this.state.data.length === 0){
            return biddings_summary;
        }
        
        let wins = 0;
        let all_processes_info = {};
        
        this.state.data.forEach((item)=> {

            if(item["Flag Vencedor"] === "SIM") wins++;

            let process_key = item["Número Processo"] + item["Código Item Compra"];

            all_processes_info[process_key] = {
                "process_id": item["Número Processo"],
                "flag": item["Flag Vencedor"],
                "cod_item": item["Código Item Compra"],
                "item": item["Descrição Item Compra"]
            };
        });

        biddings_summary["wins"] = wins;
        biddings_summary["win_rate"] = (100*(wins/this.state.data.length)).toFixed(2) + "%";
        biddings_summary["processes_info"] = all_processes_info;

        return biddings_summary;
    }

    buildBiddingsCard(biddings_summary){
        return(
            <div className="biddingsNumbersCard">
                <p>Período considerado: Jan/2020 - Dez/2021 </p>
                <p>Participações em Licitações: {biddings_summary["total"]}</p>
                <p>Licitações ganhas: {biddings_summary["wins"]}</p>
                <p>Taxa de ganho: {biddings_summary["win_rate"]}</p>
            </div>
        );
    }

    buildAllBiddingDetails(biddings_summary){
        let all_bidding_details = [];
        biddings_summary["processes_ids"].forEach((item) => {
            all_bidding_details = all_bidding_details.concat(
                <BiddingDetails process_id={item}/>
            )
        });
        return all_bidding_details;
    }
    
    render(){

        let biddings_card = null;
        let biddings_summary = null;
        let all_bidding_details = null;

        if(this.state.loading){
            return (
                <div className="biddingsCard">
                    <h2 className="loadingBiddingsTitle"> Buscando dados de Licitações... </h2>
                </div>
            )
        }

        else{

            biddings_summary = this.calculateBiddings();
            
            if(this.state.show_details){
                all_bidding_details = <AllBiddingsDetailsModal 
                    processes_info={biddings_summary["processes_info"]}
                    callBackCloseModal={this.showHideModal}
                />
            }

            else{
                all_bidding_details = null;
            }
            
            biddings_card = this.buildBiddingsCard(biddings_summary);
            
            return(
                <div className="biddingsCard">
                    
                    <h2 className="summaryTitle"> Resumo das licitações </h2>
                    
                    {biddings_card}

                    <button id="showInfo" onClick={this.showHideModal}> Mostrar detalhes </button>

                    {all_bidding_details}
                        
                </div>
            )
        }
    };

}

export default BiddingsCard;
