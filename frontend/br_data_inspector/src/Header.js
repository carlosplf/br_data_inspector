import React from "react";
import './Header.css';
import HomeButton from './HomeButton';

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        if (this.props.show_table_data){
            return(
                <div class="header">
                    <h1>{this.props.header_text}</h1>
                    <div class="header-btns">
                        <button id="all-data-btn" className="btn" onClick={this.props.handle_modal}>Mostrar tabela</button>
                        <HomeButton/>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div class="header">
                    <h1>{this.props.header_text}</h1>
                    <div class="header-btns">
                        <HomeButton/>
                    </div>
                </div>
            )
        }
    }
}

export default Header;