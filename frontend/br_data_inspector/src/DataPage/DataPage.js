import React from "react";
import DataSummary from "../DataSummary/DataSummary.js";
import { withRouter } from "react-router-dom";
import DataBarChart from "../DataChart/DataBarChart";
import queryString from "query-string";
import Header from "../Header/Header";
import Loading from "../Utils/Loading";
import "../DataPage/DataPage.css";
import CreateCustomLink from "../CustomLink/CreateCustomLink.js";
import ExpensesTable from "../Expenses/ExpensesTable.js";
import LoadingBar from "react-top-loading-bar";
import ContractsData from "../ContractsData/ContractsData";
import BiddingsData from "../BiddingsData/BiddingsData";

//Component responsible of showing info about a single Entity searched.
class DataPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: undefined,
            show_modal: false,
            show_custom_link_modal: false,
            values_summary: {},
            all_requests: 0,
            data_keys: [
                "Valor Empenhado (R$)",
                "Valor Liquidado (R$)",
                "Valor Pago (R$)",
                "Valor Restos a Pagar Cancelado (R$)",
                "Valor Restos a Pagar Inscritos (R$)",
                "Valor Restos a Pagar Pagos (R$)",
            ],
        };
    }

    entity_id = 0;
    dates_to_search = [];
    batch_request_size = 4;
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    handleOpenDataModal = () => {
        this.setState({ show_modal: true });
    };

    handleCloseDataModal = () => {
        this.setState({ show_modal: false });
    };

    handleShareButton = () => {
        this.setState({ show_custom_link_modal: true });
    };

    //If Component did mount, request data from API for each date selected
    //received as URL param.
    componentDidMount() {
        this.getURLParams();
        if (!this.state.data && this.entity_id !== "") {
            this.setState({ loading: true });
            this.doBatchRequests();
        }
    }

    async doBatchRequests() {
        var all_promises = [];
        var month_date = "";

        for (var i=0; i<this.dates_to_search.length;) {
            all_promises = [];

            for (var j=0; j<this.batch_request_size; j++) {
                
                if (!this.dates_to_search[i]) break

                month_date = this.dates_to_search[i];

                //For each month_date iteration step, request data for Entity 1 and 2.
                all_promises.push(this.requestDataFromAPI(month_date));

                i++;
            }

            //Wait a batch of requests to finish.
            await Promise.all(all_promises);
        }
    }

    // This route URL receives the Entity ID and the Dates for query as arguments.
    // Example: "http://localhost:3000/table?id=26236&dates=202001-202003-202002"
    getURLParams() {
        const value = queryString.parse(this.props.location.search);
        const entity_id = value.id;
        this.entity_id = entity_id;
        this.dates_to_search = value.dates.split("-");
    }

    //Sum data from table lines, building a data summary dict.
    sumData(data) {
        this.setState({
            data: this.processData(data),
            loading: false,
            all_requests: this.state.all_requests + 1,
        });
        var all_sums = {};
        this.state.data.forEach((single_line) => {
            this.state.data_keys.forEach((key) => {
                if (!all_sums[key]) {
                    all_sums[key] = 0;
                }
                all_sums[key] += parseFloat(single_line[key]);
            });
        });
        this.setState({ values_summary: all_sums });
    }

    //For each API response data, concatenate with already collected data in state.
    processData(api_response) {
        if (api_response["data"].length !== 0 && !this.state.data) {
            return api_response["data"];
        }
        return this.state.data.concat(api_response["data"]);
    }

    //Call Backend API and retrieve data about Entities
    requestDataFromAPI(month_date) {
        var base_url = this.api_url + ":" + this.api_port;
        var request_url =
            base_url +
            "/" +
            this.props.entity_type.toLowerCase() +
            "/" +
            month_date +
            "/" +
            this.entity_id;

        return new Promise((resolve, reject) => {
            return fetch(request_url)
                .then((response) => response.json())
                .then(
                    (data) => {
                        if (data) {
                            resolve(this.sumData(data));
                        } else {
                            reject(
                                new Error("Request failed. Empty Data return.")
                            );
                        }
                    },
                    (error) => {
                        reject(new Error("Request failed."));
                    }
                );
        });
    }

    selectedDates() {
        return this.dates_to_search.map((d) => {
            return <spam> {d} </spam>;
        });
    }

    handleCloseCLModal = () => {
        this.setState({
            show_custom_link_modal: false,
        });
    };

    render() {
        const heavy_search = this.dates_to_search.length >= 6 ? true : false;

        if (this.state.loading) {
            return <Loading heavy_search={heavy_search} />;
        } else if (this.state.data.length === 0) {
            return (
                <div className="search-results">
                    <Header
                        handleShareButton={this.handleShareButton}
                        show_share_button={true}
                        show_table_data={false}
                        header_text="Resumo de Despesas"
                        handle_modal={this.handleOpenDataModal}
                    />
                    <h1> Ops, sem dados para o período :( </h1>
                </div>
            );
        } else {
            const progress =
                100 * (this.state.all_requests / this.dates_to_search.length);

            return (
                <div className="search-results">
                    <Header
                        handleShareButton={this.handleShareButton}
                        show_share_button={false}
                        show_table_data={false}
                        header_text="Resumo de Despesas"
                        handle_modal={this.handleOpenDataModal}
                    />

                    <CreateCustomLink
                        show={this.state.show_custom_link_modal}
                        handleClose={this.handleCloseCLModal}
                    />

                    <LoadingBar
                        color="#009C3B"
                        progress={progress}
                        height={8}
                        onLoaderFinished={() => {
                            console.log("Finished loading.");
                        }}
                    />

                    <div className="summaryContainer">
                        <DataSummary
                            dates={this.dates_to_search}
                            name={this.state.data[0]["Nome Órgão Subordinado"]}
                            entity_id={this.entity_id}
                            data={this.state.data}
                            values_summary={this.state.values_summary}
                            data_keys={this.state.data_keys}
                        />
                    </div>

                    <DataBarChart
                        data_keys={this.state.data_keys}
                        all_transactions_data={this.state.data}
                        selected_dates={this.dates_to_search}
                    />

                    <ExpensesTable
                        entity_name={
                            this.state.data[0]["Nome Órgão Subordinado"]
                        }
                        entity_id={this.entity_id}
                        data={this.state.data}
                    />

                    <ContractsData
                        dates={this.dates_to_search}
                        entity_id={
                            this.state.data[0]["Código Órgão Subordinado"]
                        }
                    />
                    
                    <BiddingsData
                        dates={this.dates_to_search}
                        entity_id={
                            this.state.data[0]["Código Órgão Subordinado"]
                        }
                    />
                </div>
            );
        }
    }
}

export default withRouter(DataPage);
