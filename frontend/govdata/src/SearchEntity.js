import React from 'react'
import './App.css'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

class SearchEntity extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        //console.log(string, results)
    }

    handleOnHover = (result) => {
        // the item hovered
        //console.log(result)
    }
    /*
    handleOnSelect = (item) => {
        // the item selected
        console.log(item)
        console.log("selected")
    }
    */

    handleOnFocus = () => {
        //console.log('Focused')
    }
  
    render(){
        return (
            <div className="App">
            <header className="App-header">
                <div style={{ width: 400 }}>
                <ReactSearchAutocomplete
                    items={this.props.items}
                    onSearch={this.handleOnSearch}
                    onHover={this.handleOnHover}
                    onSelect={this.props.handleOnSelect}
                    onFocus={this.handleOnFocus}
                    autoFocus
                />
                </div>
            </header>
            </div>
        )
    }
}

export default SearchEntity;
