import React from 'react';
import './Search.css'


class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'value': '',
            'search_type': this.props.type,
        }
    }

    handleChange(event){
        this.setState({value: event.target.value});
    }

    render(){
        return(
            <div>
                <form class="Search" onSubmit={(event) => this.props.handleSubmit(event, this.state.value)}> 
                    <input placeholder="ID do Órgão..." type="text" value={this.state.value} onChange={(event) => this.handleChange(event)} />
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default Search;