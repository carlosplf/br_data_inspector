import React from 'react'
import './App.css'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import './SearchEntity.css';

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

    handleOnFocus = () => {
        //console.log('Focused')
    }
  
    render(){
        if (this.props.show){
            return (
                <div id={this.props.search_id} className="SearchEntity">
                    <ReactSearchAutocomplete
                        items={this.props.items}
                        onSearch={this.handleOnSearch}
                        onHover={this.handleOnHover}
                        onSelect={this.props.handleOnSelect}
                        onFocus={this.handleOnFocus}
                        autoFocus
                    />
                </div>
            )
        }
        else{
            return <spam/>;
        }
    }
}

export default SearchEntity;
