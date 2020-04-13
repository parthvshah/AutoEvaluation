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
      // section:"",
      // subject:"", 
      ans:"",
      //Teacher section
      sampleAns:"",
      assignmentID:"",
      assignmentName:"",
      course:"",
      question:"",
      maxMarks:"",
      //student marks view
      myAssignment:"",
      myMarks:""
    };
    // this.updateSection = this.updateSection.bind(this);
    // this.updateSubject = this.updateSubject.bind(this);
    // this.updateAssignment = this.updateAssignment.bind(this);
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
                usn: data.user.usn,
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
  // console.log("section:" + this.state.section);
  // console.log("subject:" + this.state.subject);
  console.log("assignment:" + this.state.ans);
  var token = localStorage.getItem('token');
  var userID = localStorage.getItem('user_id');
  
  event.preventDefault();

  const body = {
    usn: this.state.usn,
    // section: this.state.section,
    // subject:this.state.subject,
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
  const body = {
  };

  var apiPath = '/service/autoevaluation/start';
  axios.post(
    apiPath,
    body,
  ).then(function (response) {
        if (response.data.success) {
          console.log(response);
          ToastStore.success('Autoevaluation complete!');
        }
    }).catch(function (error) {
        // TODO: Try again after sometime? 
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
//       sampleAns:"",
//       assignmentID:"",
//       assignmentName:"",
//       course:"",
//       question:"",
//       maxMarks:""
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







//student marks view
showStudentMarks(event){
  console.log("assignmentID:"+this.state.assignmentIDStud);
  console.log(this.state.usn);
  event.preventDefault();
  var usn=this.state.usn;
  var assignmentID=this.state.assignmentIDStud;
  var body = {usn:usn, assignmentID:assignmentID};
  // var apiPaths = '/api/evaluation/' + usn + '/stud/' + assignmentID
  var apiPaths = '/api/evaluation/studMarks';
  // /api/evaluation/studMarks
  //'/api/evaluation/' + usn + '/stud/' + assignmentID
  //'/api/evaluations/studentMarks'+ usn + assignmentID;
  var token = localStorage.getItem('token');
  var userID = localStorage.getItem('user_id');
  // _API_CALL(apiPaths, "GET", body, token)
  //     .then(response => {
  //         var data = response.data;
  //         // self.setState({ isLoading: false });
  //         // self.setState({
  //         //     usn: data.user.usn,
  //         //     name: data.user.name.firstName + " " + data.user.name.lastName,
  //         //     basicInfo: data.user.basicInfo
  //         // });
  //     })
  //     .catch(error => {
  //         console.log(error);
  //     })

//db.evaluations.find({$and:[{"submission.usn":"1261"}, {"creator.assignmentID":"123"}]}).pretty()
// db.evaluations.find({$and:[{"creator.assignmentID":"123"},{"submission.usn":"1261"}]}).pretty()

  axios.post(
    apiPaths,
    body,
    {
        headers: {
            'x-access-token': token,
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        if (response.data.success) {
          console.log(response);
          ToastStore.success('Successfully retrieved!');
        }
        var docNumber;
        var data = response.data;
        // console.log(data.marks[0].submission[0])
        for(var i=0;i<data.marks[0].submission.length; i++){
          if(usn.localeCompare(data.marks[0].submission[i].usn)==0){
            console.log(data.marks[0].submission[i].ans);
            docNumber=i;
            console.log(docNumber);
            // document.getElementById("mydemo").innerHTML = data.marks[0].submission[i].ans;
            // document.getElementById("marksID").innerHTML = "Marks Obtained: "+ data.marks[0].submission[i].marksObtained;
            var para = document.createElement("p");
            var node = document.createTextNode("This is new.");
            para.appendChild(node);
            var x1 = document.createElement("BR");
            // var mytextarea = document.createElement("TEXTAREA");
            var node1 = document.createTextNode("Your Answer: " + data.marks[0].submission[i].ans);
            var para1 = document.createElement("p");
            para1.appendChild(node1)
            var x2 = document.createElement("BR");
            var node2 = document.createTextNode("Marks Obtained: " + data.marks[0].submission[i].marksObtained);
            var para2 = document.createElement("p");
            para2.appendChild(node2)
            // var node2 = document.createTextNode(data.marks[0].submission[i].marksObtained);

            var element = document.getElementById("myform");
            // element.appendChild(para);
            document.getElementById("myform").innerHTML = "Details of your assingment:\n\n";
            element.appendChild(x1);
            // element.app
            element.appendChild(x2);
            element.appendChild(para1);
            element.appendChild(x2);
            element.appendChild(para2);

            // element.appendChild(mytextarea);
            // element.appendChild(para1)
          }
        }
      //   self.setState({
      //     myAssignment: data.marks.submission[0].ans,
      //     myMarks: data.marks.submission[0].marksObtained,
      //     // basicInfo: data.user.basicInfo
      // });
        // console.log(data);
        // alert(data.marks);
    }).catch(function (error) {
        // TODO: Try again after sometime? 
        ToastStore.error('Oopsies!');
        console.log('Error: ', error);
    });
    }



    //Prof marks function
    showProfMarks(event){
      console.log("AssingmentID: "+ this.state.assignmentID);
      event.preventDefault();
      var assignmentID=this.state.assignmentID;
      var body = {assignmentID:assignmentID};
      var myapiPath = '/api/evaluation/teacherMarks';
      var token = localStorage.getItem('token');
    var userID = localStorage.getItem('user_id');
    axios.post(
      myapiPath,
      body,
      {
          headers: {
              'x-access-token': token,
              'Content-Type': 'application/json'
          }
      }).then(function (response) {
          var data = response.data;
          console.log(response.data.marks[0].submission);
          if (response.data.success) {
            // console.log(response);
            ToastStore.success('Success!');
          }
          

          for(var i=0; i<response.data.marks[0].submission.length;i++){
            var table = document.getElementById("mytable");
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.innerHTML = response.data.marks[0].submission[i].usn;
            cell2.innerHTML = response.data.marks[0].submission[i].ans;
            cell3.innerHTML = response.data.marks[0].submission[i].marksObtained;
            // console.log(response.data.marks[0].submission[i].ans);
            // console.log(response.data.marks[0].submission[i].marksObtained);
          }
          var table1 = document.getElementById("mytable");
          var header = table1.createTHead ();
          var row1 = header.insertRow (0);
          var cell1 = row1.insertCell (0);
          // var row2 = header.insertRow (1);
          var cell2 = row1.insertCell (1);
          var cell3 = row1.insertCell(2)
          cell1.innerHTML = "<b>USN</b>";
          cell2.innerHTML = "<b>Answer</b>";
          cell2.innerHTML = "<b>Marks Obtained</b>";
      }).catch(function (error) {
          // TODO: Try again after sometime? 
          ToastStore.error('An issue sadly');
          console.log('Error: ', error);
      });
  

    }







  render() {
    let content;

    const studContent = (
      <div className="App">
        <div className="page-header">
          <h1>Hey {this.state.name}</h1>      
        </div>
        <form onSubmit={this.showStudentMarks.bind(this)} id="myform">
          {/* <div className="md-form">
            <input type="text" id="inputMDEx" className="form-control" value={this.state.usn} onChange={this.handleUSNChange.bind(this)}/>
            <label>Enter your USN</label>
          </div> */}
          <div className="md-form input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">USN: </span>
            </div>
            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="usn" value={this.state.usn} onChange={this.handleUSNChange.bind(this)} />
          </div>

          {/* Getting assignmentID */}
          <div className="md-form input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Assignment ID: </span>
            </div>
            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="assignmentIDStud" value={this.state.assignmentIDStud} onChange={this.handleAssignmentIDStudChange.bind(this)} />
          </div>
          <br/>

        {/* <div className="form-group purple-border">
          <label> Submit your assignment here</label>
          <textarea className="form-control" id="exampleFormControlTextarea4" rows="3" name="ans" value={this.state.ans} onChange={this.handleAssignmentChange.bind(this)}></textarea>
        </div> */}
        <input type="submit" className="btn btn-info" value="Submit"/>
          {/* <Button variant="success" onClick = {this.handleSubmit.bind(this)}>Success</Button>{' '} */}
          {/* <div class="form-group green-border-focus">
    <label for="exampleFormControlTextarea5">Your Answer is:</label>
    <textarea class="form-control" id="mydemo" rows="3"></textarea>
    </div> */}
    {/* <div class="boxed" id="mydemo">
  This text is enclosed in a box.
  </div> */}
    {/* <h3>Marks Obtained: <small id="marksID">secondary text</small></h3> */}
    {/* <p id="marksID">Marks Obtained:</p> */}
      </form>
      <br></br>
      {/* <p id="mydemo"></p> */}
      
      <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} />
  </div>
    );

    const profContent = (
      <div className="App">
      <div className="page-header">
        <h1>Hey {this.state.name}</h1> 
        {/* <p>Create the assignment here</p>      */}
      </div>
      
      {/* Form starts here */}

      <form onSubmit={this.showProfMarks.bind(this)}>

      {/* Getting assignment ID */}


      <div className="md-form input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text md-addon" id="inputGroupMaterial-sizing-default">Assignment ID: </span>
        </div>
        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroupMaterial-sizing-default" name="assignmentID" value={this.state.assignmentID} onChange={this.handleAssignmentIDChange.bind(this)} />
      </div>

      
      {/* The create button and the auto evaluate button */}


      <div className="container">
        <div className="row">
          <div className="col-6 col-sm-6 col-md-6">
            <button className="btn btn-success btn-lg" type="submit">Submit </button>
          </div>
          
        </div>
      </div>
    </form>
    <table className="table table-striped" id="mytable">
    {/* <thead>
      <tr>
        <th>Firstname</th>
        <th>Lastname</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>John</td>
        <td>Doe</td>
        <td>john@example.com</td>
      </tr>
      <tr>
        <td>Mary</td>
        <td>Moe</td>
        <td>mary@example.com</td>
      </tr>
      <tr>
        <td>July</td>
        <td>Dooley</td>
        <td>july@example.com</td>
      </tr>
    </tbody> */}
  </table>
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
