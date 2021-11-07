import React from 'react';
import Header from './Header';
import RankTable from './RankTable';
import './RankPage.css';


class RankPage extends React.Component{
    
    render(){
        return(
            <div class="rankPage">
                <Header header_text="Maiores pagadores"/>
                <div className="pageTitle">
                    <p style={{fontWeight: 'bold'}}>2021: dados até Junho.</p>
                </div>
                <RankTable date_year="2020"/>    
                <RankTable date_year="2021"/>    
            </div>
        )
    }
}

export default RankPage;
