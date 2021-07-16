import React from 'react';
import SearchEntity from './SearchEntity';
import MonthPicker from './MonthPicker';
import { Redirect } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';



class Home extends React.Component{
    constructor(props) { 
        super(props);
        this.state = {
            'data': '',
            'search_id': '',
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

    //Simple method to remove an item from array.
    removeDateFromList(date) { 
        return this.selected_dates.filter(function(ele){ 
            return ele !== date; 
        });
    }

    // Callback when a Entity is selected from Autocomplete search field.
    handleSearch = (item) => {
        console.log("Searched: " + item["id"]);
        if (this.selected_dates.length === 0){
            //TODO: Implement real user alert.
            console.log("Alert, no date selected!");
            NotificationManager.warning('No Months selected!', '', 2000);
            return;
        }
        this.setState({
            search_id: item["id"],
            show_results: true
        });
    }

    //Get all Subordinados and Superior Órgãos from backend API.
    getNamesList(entity_type){
        var request_url = "http://localhost:8080/" + entity_type.toLowerCase() + "/202001";
        fetch(request_url)
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
            var url_string = "/table?id=" + this.state.search_id + "&dates=" + this.dates_url_param;
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
                <div className="App-Search">
                    <NotificationContainer/>
                    <p>Pesquisar por Órgão Recebedor:</p>
                    <SearchEntity
                        items={this.items}
                        handleOnSelect={this.handleSearch}
                    />
                    <MonthPicker dateSelected={this.dateSelected}/>
                </div>
            )
        }
    }
}

export default withRouter(Home);
