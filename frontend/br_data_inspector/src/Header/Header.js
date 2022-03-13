import React from "react";
import '../Header/Header.css';
import { FaShareAlt } from 'react-icons/fa';
import { Link } from "react-router-dom";

class Header extends React.Component{
    constructor(props){
        super(props);
    }

    showShareButton(){
        if(this.props.show_share_button){
            return <button id="shareBtn" className="page-btn" onClick={this.props.handleShareButton}><FaShareAlt/></button>
        }
        else{
            <spam/>
        }
    }

    showTableData(){
        if(this.props.show_table_data){
            return <button id="all-data-btn" className="page-btn" onClick={this.props.handle_modal}>Mostrar dados</button>
        }
        else{
            return <spam/>
        }
    }

    render(){
        
        var background_class = "header_light_mode";

        if(this.props.dark_background){
            background_class = "header_dark_mode";
        }

        const table_data_button = this.showTableData();
        const share_button = this.showShareButton();
        return(
            <div className={background_class}>
                <div className="header-title-box">
                    <h1> <a href="/home"> BR Data Collector </a> </h1>
                    <div className="header-title-underscore">
                        <div id="color1"><p/></div>
                        <div id="color2"><p/></div>
                        <div id="color3"><p/></div>
                    </div>
                </div>
                <div className="header-btns">
                    {table_data_button}
                    {share_button}
                    <div className="page-btn">
                        <a href="/about"> Sobre </a>
                    </div>
                    <div className="page-btn">
                        <a href="/rank"> Ranking </a>
                    </div>
                    <div className="page-btn">
                        <a href="/contracts"> Contratos </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;
