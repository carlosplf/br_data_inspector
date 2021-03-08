import React from 'react';


class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'value': ''
        }
    }

    handleChange(event){
        this.setState({value: event.target.value});
    }

    render(){
        return(
            <div>
                <form onSubmit={(event) => this.props.handleSubmit(event, this.state.value)}>
                    <label>
                        Entity ID :
                        <input type="text" value={this.state.value} onChange={(event) => this.handleChange(event)} />
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        );
    }
}

export default Search;