import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactLoading from '../../common/Loading';
import { ToastContainer, ToastStore } from 'react-toasts';
import { _API_CALL } from './../../../Utils/api';

class Evaluation extends Component {
  constructor() {
    super();
    this.state = {
      globalRankList: [],
      isLoading: true,
      name:"", 
      usn:"",
      assignmentIDStud:"",
      role: '',
      ans:"",
      //Teacher section
      sampleAns:"",
      assignmentID:"",
      assignmentName:"",
      course:"",
      question:"",
      maxMarks:""
    };
  }

  
  componentDidMount() {
    var self = this;
    var token = localStorage.getItem('token')
    var userID = localStorage.getItem('user_id')

    var apiPath = '/api/account/' + userID + '/details'
    axios.get(apiPath, {
      headers: {
        'x-access-token': token,
      }
    })
      .then(function (response) {
        if (!response.data.success) {
          // TODO: throw appropriate error and redirect
          console.log("Error1: " + response.data);
          return;
        }
        var data = response.data;
        self.setState({
          role: data.user.role
        });
      })
      .catch(function (error) {
        console.log(error);
        if (error.response) {
          if (error.response.status) {
            alert("Session timed out.");
            window.location.href = '/';
          }
        }
      });

    var apiPath = '/api/account/' + userID + '/details';
    _API_CALL(apiPath, "GET", {}, token)
        .then(response => {
            var data = response.data;
            self.setState({ isLoading: false });
            self.setState({
                name: data.user.name.firstName + " " + data.user.name.lastName,
                basicInfo: data.user.basicInfo
            });
        })
        .catch(error => {
            console.log(error);
        })
}

handleAssignmentChange(event) {
  this.setState({ans: event.target.value});
}

handleUSNChange(event) {
  this.setState({usn: event.target.value});
}

handleAssignmentIDStudChange(event){
  this.setState({assignmentIDStud: event.target.value});
}
handleSubmit(event){
  console.log("usn:" + this.state.usn);
  console.log("assignmentIDStud:" + this.state.assignmentIDStud);
  console.log("assignment:" + this.state.ans);
  var token = localStorage.getItem('token');
  var userID = localStorage.getItem('user_id');
  
  event.preventDefault();

  const body = {
    usn: this.state.usn,
    ans:this.state.ans,
    assignmentIDStud: this.state.assignmentIDStud
  };
  //' + userID + '
  var apiPath = '/api/evaluation';
  axios.post(
    apiPath,
    body,
    {
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.data.success) {
          console.log(response);
          ToastStore.success('Successfully added!');
        }
    }).catch(function (error) {
        // TODO: Try again after sometime? 
        ToastStore.error("Information incomplete!");
        console.log('Error: ', error);
    });
}

handleSampleAnsChange(event){
  this.setState({sampleAns: event.target.value});
}

handleAssignmentIDChange(event){
  this.setState({assignmentID: event.target.value});
}

handleAssignmentNameChange(event){
  this.setState({assignmentName: event.target.value});
}

handleCourseChange(event){
  this.setState({course: event.target.value});
}

handleQuestionChange(event){
  this.setState({question: event.target.value});
  // alert(event.target.value);
}

handleMaxMarksChange(event){
  this.setState({maxMarks: event.target.value});
}

handleAutoEvaluate(event){

  var apiPath = 'http://localhost:5000/service/autoevaluation/start';
  axios.post(
    apiPath,
    {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  }).then(function (response) {
        if (response.data.success) {
          console.log(response);
          ToastStore.success('Autoevaluation complete!');
        }
    }).catch(function (error) {
        ToastStore.error('Error!');
        console.log('Error: ', error);
    });

}

handleSubmitTeacher(event){  
  console.log(this.state.sampleAns);
  console.log(this.state.assignmentID);
  console.log(this.state.assignmentName);
  console.log(this.state.course);
  console.log(this.state.question);
  console.log(this.state.maxMarks);
  event.preventDefault();
  
  var token = localStorage.getItem('token');
  var userID = localStorage.getItem('user_id');
  
  const body = {
    sampleAns:this.state.sampleAns,
    assignmentID:this.state.assignmentID,
    name:this.state.assignmentName,
    course:this.state.course,
    question:this.state.question,
    maxMarks:this.state.maxMarks

  };
  var apiPath = '/api/evaluation/teacher';
  axios.post(
    apiPath,
    body,
    {
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.data.success) {
          console.log(response);
          ToastStore.success('Successfully added!');
        }
    }).catch(function (error) {
        // TODO: Try again after sometime? 
        ToastStore.error('Information incomplete!');
        console.log('Error: ', error);
    });


}

displayActiveAssignments(event){
  var myapiPath = '/api/evaluation/activeAssignments';
  var token = localStorage.getItem('token');
  var userID = localStorage.getItem('user_id');
  axios.post(
    myapiPath,
    {},
    {
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        var data = response.data;
        console.log(response.data.assignment[0].creator.question);
        console.log(response.data.assignment[0].creator.assignmentID);
        if (response.data.success) {
          // console.log(response);
          ToastStore.success('Success!');
        }
        

        for(var i=0; i<response.data.assignment.length;i++){
          var table = document.getElementById("mytable");
          var row = table.insertRow(0);
          var cell0 = row.insertCell(0);
          var cell1 = row.insertCell(1);
          // var cell2 = row.insertCell(2);
          // var cell3 = row.insertCell(3);
          cell0.innerHTML = response.data.assignment[i].creator.assignmentID;
          cell1.innerHTML = response.data.assignment[i].creator.question;
          // cell2.innerHTML = response.data.marks[0].submission[i].ans;
          // cell3.innerHTML = response.data.marks[0].submission[i].marksObtained;
        }
        var table1 = document.getElementById("mytable");
        var header = table1.createTHead ();
        var row1 = header.insertRow(0);
        var cell0 = row1.insertCell(0);
        var cell1 = row1.insertCell(1);
        // var cell2 = row1.insertCell(2);
        // var cell3 = row1.insertCell(3)
        cell0.innerHTML = "<b>Assignment ID</b>";
        cell1.innerHTML = "<b>Question</b>";
        // cell2.innerHTML = "<b>Answer</b>";
        // cell3.innerHTML = "<b>Marks Obtained</b>";
    }).catch(function (error) {
        // TODO: Try again after sometime? 
        ToastStore.error(error.message);
        console.log('Error: ', error);
    });

}

  render() {
    let content;

    const studContent = (
      <div className="App">
        <div className="page-header">
          <h1 id="displayName">Hey {this.state.name}</h1>      
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
  
          <div className="md-form input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">USN: </span>
            </div>
            <input id="usn" type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="usn" value={this.state.usn} onChange={this.handleUSNChange.bind(this)} />
          </div>

          {/* Getting assignmentID */}
          <div className="md-form input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Assignment ID: </span>
            </div>
            <input id="assignmentID" type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="assignmentIDStud" value={this.state.assignmentIDStud} onChange={this.handleAssignmentIDStudChange.bind(this)} />
          </div>
          <br/>

        <div className="form-group purple-border">
          <label> Submit your assignment here:</label>
          <textarea className="form-control" id="exampleFormControlTextarea4" rows="3" name="ans" value={this.state.ans} onChange={this.handleAssignmentChange.bind(this)}></textarea>
        </div>
        <input type="submit" className="btn btn-info" value="Submit"/>
        <br></br>
      </form>
      <h2> Most Recent Assignments </h2>
      <br></br>
      <img style={{ display: 'none' }} src={require('./index.js')} onError={this.displayActiveAssignments.bind(this)}></img>
      <table className="table table-striped" id="mytable"></table>

      <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} />
  </div>
    );

    const profContent = (
      <div className="App">
      <div className="page-header">
        <h1 id="displayName">Hey {this.state.name}</h1> 
        <p>Create the assignment here</p>     
      </div>
      
      {/* Form starts here */}

      <form onSubmit={this.handleSubmitTeacher.bind(this)}>

      {/* Getting assignment ID */}


      <div className="md-form input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Assignment ID: </span>
        </div>
        <input id="assignmentID" type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="assignmentID" value={this.state.assignmentID} onChange={this.handleAssignmentIDChange.bind(this)} />
      </div>

      {/* Getting assignment name */}

      <div className="md-form input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Assignment Name: </span>
        </div>
        <input id="assignmentName" type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="assignmentName" value={this.state.assignmentName} onChange={this.handleAssignmentNameChange.bind(this)}/>
      </div>

      {/* Getting maximum marks */}

      <div className="md-form input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Maximum Marks: </span>
        </div>
        <input id="maxMarks" type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="maxMarks" value={this.state.maxMarks} onChange={this.handleMaxMarksChange.bind(this)}/>
      </div>

      {/* Getting course  */}

      <div className="form-group">
        <label>Course</label>
        {/* <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Course</span> */}
        <select className="form-control" id="sel1" name="course" value={this.state.course} onChange={this.handleCourseChange.bind(this)}>
          <option value="CC">CC</option>
          <option value="WT-2">WT-2</option>
          <option value="CD">CD</option>
          <option value="TDL">TDL</option>
        </select>
      </div>

  
      {/* Getting the question */}
      <div className="form-group green-border-focus">
        <label>Question</label>
        <textarea id="question" className="form-control" id="exampleFormControlTextarea5" rows="3" name="question" value={this.state.question} onChange={this.handleQuestionChange.bind(this)}></textarea>
      </div>
      
      {/* Getting the sample answer */}

      <div className="form-group purple-border">
        <label>Sample Answer</label>
        <textarea id="sampleAnswer" className="form-control" id="exampleFormControlTextarea4" rows="3" name="sampleAns" value={this.state.sampleAns} onInput={this.handleSampleAnsChange.bind(this)}></textarea>
      </div>


      {/* The create button and the auto evaluate button */}


      <div className="container">
        <div className="row">
          <div className="col-6 col-sm-6 col-md-6">
            <button id="create" className="btn btn-success btn-lg" type="submit">Create </button>
          </div>
          <div className="col-6 col-sm-6 col-md-6">
            {/* Auto evaluate button */}
          <input className="btn btn-info btn-lg" type="button" value="Auto Evaluate" onClick={this.handleAutoEvaluate.bind(this)}/>
          </div>
        </div>
      </div>
    </form>
    <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} />
    </div>
    );

    if (this.state.role == "prof") {
      content = profContent;
    }
    else {
      content = studContent;
    }
    if (this.state.isLoading)
      return <ReactLoading/>;
    else
      return (<div>{content}</div>);
  }
}

export default Evaluation;
