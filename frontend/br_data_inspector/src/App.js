import React from 'react';
import DataPage from './DataPage/DataPage';
import Home from './Home/Home';
import DataCompare from './DataComparePage/DataCompare';
import RankPage from './RankPage/RankPage';
import About from './About/About';
import CustomLinkRouter from './CustomLink/CustomLinkRouter';
import ContractsPage from './ContractsPage/ContractsPage';
import CompanyPage from './CompanyPage/CompanyPage';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

class App extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      'search_id': ''
    };
  }

  render(){
    return(
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/details" element={<DataPage key={this.state.search_id} entity_type="Subordinado" entity_id={this.state.search_id}/>}/>
          <Route path="/compare" element={<DataCompare entity_type="Subordinado"/>}/>
          <Route path="/rank" element={<RankPage/>}/>
          <Route path="/contracts" element={<ContractsPage/>}/>
          <Route path="/company" element={<CompanyPage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/custom_link" element={<CustomLinkRouter/>}/>
        </Routes>
      </Router>
    );
  }
}

export default App;