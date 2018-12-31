import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      addNewGoals: [{ title: '',description: '' },],
    };
  }

  handleOnChange = (idx,inputType) => (evt) => {
    const newaddNewGoals = this.state.addNewGoals.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;          
      return  inputType === 'goal' ? { ...shareholder, title: evt.target.value } : { ...shareholder, description: evt.target.value };
    });   
    this.setState({ addNewGoals: newaddNewGoals });
  }
  
  componentDidMount(){    
    fetch('http://localhost:8080/goals').then(response =>response.json())
    .then(data=>{ this.setState({ addNewGoals: data.data });
    }).catch();
  }
    
  handleService = (evt) => {
    const { addNewGoals } = this.state;          
      return fetch('http://localhost:8080/goals', {
              method: 'post',  
              mode: 'no-cors',
              redirect: 'follow',      
              body: JSON.stringify(addNewGoals),
              headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
              })})
      .then(res => {return res;})
      .catch(err =>{console.log(err);});
  }

  handleRequiredCases = addNewGoals =>{
    for(var i of addNewGoals){
      if(Object.keys(i).length === 0){
        return false;
      } else {
       return true;
      }
    }
  }
  

  handleAddGoals = () => {    
    this.setState({ addNewGoals: this.state.addNewGoals.concat([{}]) });
  }

  handleRemoveGoals = (idx) => () => {
    this.setState({ addNewGoals: this.state.addNewGoals.filter((s, sidx) => idx !== sidx) });
    let deleteAndUpdatedGoals = { addNewGoals: this.state.addNewGoals.filter((s, sidx) => idx !== sidx) };
    fetch('http://localhost:8080/goals', {
              method: 'post',  
              mode: 'no-cors',
              redirect: 'follow',      
              body: JSON.stringify(deleteAndUpdatedGoals),
              headers: new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json',
              })})
      .then(res => { return res; })
      .catch(err => { console.log(err); });    
  }
  

  render() {
    return (      
        <form onSubmit={this.handleService} align="center" className="form-container">  
          <h1>Add a New Goal</h1>      
          {this.state.addNewGoals.map((shareholder, idx) => (
          <div className="form-inner-container" key={idx}>
            <div className="form-text-input">
                <button type="button" onClick={this.handleRemoveGoals(idx)} className="small-close">X</button>
                <input
                  type="text"
                  placeholder='Type a goal title here'
                  value={shareholder.title}
                  onChange={this.handleOnChange(idx,'goal')}
                /> 
            </div>
            <div className="text-area">
                <textarea rows="4" cols="70"
                  placeholder='Type a goal description here'
                  value={shareholder.description}
                  onChange={this.handleOnChange(idx,'goaldescription')}
                />            
            </div>
          </div>
          ))}
          <div className="form-footer">
            <button type="button" onClick={this.handleAddGoals} className="add-goal"><span>+</span>Add a New Goal</button>
            <button type="button" onClick={this.handleService}  className="save-goal">Save</button>
          </div>
      </form>      
    );
  }
}

export default App;
