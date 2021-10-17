import React from 'react';
import SearchEntity from './SearchEntity';
import MonthPicker from './MonthPicker';
import Header from './Header';
import CompareButton from './CompareButton';
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './Home.css'



class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            'data': '',
            'search_id': '',
            'search_id_2': '',
            'loading': true,
            'first_load': true,
            'show_results': false,
            'show_results_type': '',
        };
    }

    //Should be a state.
    items = [];
    selected_dates = [];
    dates_url_param = "";
    api_url = process.env.REACT_APP_API_URL;
    api_port = process.env.REACT_APP_API_PORT;

    //Simple method to remove an item from array.
    removeDateFromList(date) {
        return this.selected_dates.filter(function(ele){
            return ele !== date;
        });
    }

    handleOnSelect = (item) => {
        this.setState({search_id: item["id"]});
    }

    //If COMPARE is enabled, set the second Entity to be compared with.
    handleOnSelectSecond = (item) => {
        this.setState({search_id_2: item["id"]});
    }

    handleCompareButton = () => {
        this.setState(prevState => ({
            compare: !prevState.compare
        }));
    }

    // Callback when a Entity is selected from Autocomplete search field.
    handleSearch = (item) => {
        if (this.selected_dates.length === 0){
            console.log("Alert, no date selected!");
            NotificationManager.warning('Selecione um Mês', '', 2000);
            return;
        }
        if (this.state.search_id === ''){
            console.log("Alert, no entity selected!");
            NotificationManager.warning('Selecione uma entidade para busca', '', 2000);
            return;
        }
        if (this.state.compare && this.state.search_id_2 === ''){
            console.log("Alert, no second entity selected!");
            NotificationManager.warning('Selecione uma entidade para comparação', '', 2000);
            return;
        }
        this.setState({
            show_results: true
        });
    }

    //Get all Subordinados and Superior Órgãos from backend API.
    getNamesList(entity_type){
        var base_url = this.api_url + ":" + this.api_port;
        var final_url = base_url + "/" + entity_type.toLowerCase() + "/202001";
        fetch(final_url)
            .then(response => response.json())
            .then(data => this.setState({ data: data["data"], loading: false}));
    }

    //Parse Entities list so they can be used in autocomplete search.
    prepareItems(entity_type){
        var items = [];
        for (let [key, value] of Object.entries(this.state.data)) {
            items.push({
                'id':  value["Código Órgão " + entity_type],
                'name': value["Nome Órgão " + entity_type]
            })
        }
        this.items = items;
    }

    buildTableDateParam(){
        this.selected_dates.map( single_date => {
            var new_param = single_date + "-";
            this.dates_url_param += new_param;
        });
        this.dates_url_param = this.dates_url_param.slice(0, -1);
    }

    //Callback funtion from MonthPicker Component.
    dateSelected = (cbs) => {
        this.selected_dates = [];
        cbs.forEach(item =>{
            if(item["checked"]){
                this.selected_dates.push(item["value"]);
            }
        })
    }

    render(){
        if (this.state.show_results){
            this.buildTableDateParam();
            if(!this.state.compare){
                var url_string = "/details?id=" + this.state.search_id + "&dates=" + this.dates_url_param;
            }
            else{
                var url_string = "/compare?id1=" + this.state.search_id + "&id2=" + this.state.search_id_2 + "&dates=" + this.dates_url_param;
            }
            return (
                <Redirect to={url_string}/>
            );
        }

        if (this.state.first_load){
            this.getNamesList("Subordinado");
            this.setState({first_load: false});
        }

        if (this.state.loading){
            return(
                <p>Loading...</p>
            )
        }

        if(!this.first_load && !this.state.loading && !this.show_results){
            if (this.items.length == 0){
                this.prepareItems("Subordinado");
            }
            return(
                <div className="govdata-home">
                    <NotificationContainer/>
                    <Header header_text="BR Data Collector - 0.0.1" handle_modal={this.handleOpenDataModal}/>
                    <h2>Pesquisar por Órgão Recebedor:</h2>
                    <SearchEntity
                        search_id="search_1"
                        show={true}
                        items={this.items}
                        handleOnSelect={this.handleOnSelect}
                    />
                    <SearchEntity
                        search_id="search_2"
                        show={this.state.compare}
                        items={this.items}
                        handleOnSelect={this.handleOnSelectSecond}
                    />
                    <CompareButton handleCompareButton={this.handleCompareButton}/>
                    <MonthPicker dateSelected={this.dateSelected}/>
                    <button id="search-btn" onClick={this.handleSearch}>Pesquisar</button>
                </div>
            )
        }
    }
}

export default withRouter(Home);
