'use strict';
const chai = require("chai");
const chaiHttp = require("chai-http");
var request = require('supertest');
const User = require('../server/models/Evaluation.js');
const Evaluation = require('../server/models/Evaluation.js');
let mongoose = require("mongoose");
let server = require('../server/server.js');
//assertion style
let should = chai.should();
let app;
chai.use(chaiHttp);

// before(done => {
//   app = server.listen(8080, done);
// });


describe('Clearing DB for testing', () => {
  it("Testing the DB clear api and simultaneously clearing DB for testing", (done) => {
    chai.request(server)
        .post("/api/evaluation/cleardb")
        .end((err, response) => {
          response.should.have.status(200);
          if(err){
            throw err;
          };
          done();
        });
  });

  
});

describe("POST /api/evaluation/teacher", () => {
  it("Should add a new created assignement by the teacher into the DB", (done) => {
    const mybody={
       sampleAns:"It is a design pattern that describes the process of checking for new server information in specific intervals",
       assignmentID:"11",
       name:"WT-II assignment 1",
       course:"WT-II",
       question:"What is Periodic Refresh",
       maxMarks:5
    };
    chai.request(server)
        .post("/api/evaluation/teacher")
        .send(mybody)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            Evaluation.find(
              {$and:[{"creator.course":mybody['course']}, {"creator.assignmentID":mybody['assignmentID']}, {"creator.name":mybody['name']}, {"creator.sampleAns":mybody['sampleAns']}, {"creator.question":mybody['question']}, {"creator.maxMarks":mybody['maxMarks']}]},
              // {"submission"
              (err, assignment) => {
                if (err) {
                  throw err;
                }
                // console.log(marks[0].submission[0].usn);
                assignment[0].creator.course.should.equal(mybody['course']);
                assignment[0].creator.name.should.equal(mybody['name']);
                assignment[0].creator.assignmentID.should.equal(mybody['assignmentID']);
                assignment[0].creator.sampleAns.should.equal(mybody['sampleAns']);
                assignment[0].creator.maxMarks.should.equal(mybody['maxMarks']);
                assignment[0].creator.question.should.equal(mybody['question']);
        
              }
            )
            done();
        });
  });
  it("Should check for the mandatory fields of Sample Answer and Assignment ID", (done) => {
    const mybody={
      sampleAns:"",
      assignmentID:"11",
      name:"WT-II assignment 1",
      course:"WT-II",
      question:"What is Periodic Refresh",
      maxMarks:5
   };
   chai.request(server)
        .post("/api/evaluation/teacher")
        .send(mybody)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.success.should.equal(false);
          response.body.message.should.equal("Error: sampleAns parameter cannot be blank");
          done();
        });
  });

  it("Ensuring that multiple assignments with the same ID are not accepted", (done) => {
    const mybody={
      sampleAns:"Ajax is a set of web development techniques using many web technologies on the client side to create asynchronous web applications.",
      assignmentID:"11",
      name:"WT-II assignment 2",
      course:"WT-II",
      question:"What is AJAX",
      maxMarks:5
   };
   chai.request(server)
        .post("/api/evaluation/teacher")
        .send(mybody)
        .end((err, response) => {
          response.should.have.status(500);
          response.body.success.should.equal(false);
          response.body.message.should.equal("Save failed.");
          done();
        });

  });
});


describe("POST /api/evaluation", () => {
  it("Should add to the DB submission details of a student", (done) => {
    const mybody={
             usn:"241",
             ans:"First answer to assignment",
             assignmentIDStud:"11"
          };
    chai.request(server)
        .post("/api/evaluation")
        .send(mybody)
        .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            Evaluation.find(
              {$and:[{"submission.usn":mybody['usn']}, {"creator.assignmentID":mybody['assignmentIDStud']}]},
              // {"submission"
              (err, marks) => {
                if (err) {
                  throw err;
                }
                // console.log(marks[0].submission[0].usn);
                marks[0].submission[0].usn.should.equal(mybody['usn']);
                marks[0].submission[0].ans.should.equal(mybody['ans']);
                marks[0].creator.assignmentID.should.equal(mybody['assignmentIDStud']);
        
              }
            )
        done();
        }); 
  });

  //FAILING TESTCASE : We should have more restrictions on the number of times a submission can be made by a student
  it("Should not allow multiple submissions with the same USN", (done) => {
    const mybody={
      usn:"241",
      ans:"another answer to the same question",
      assignmentIDStud:"11"
    };
    chai.request(server)
        .post("/api/evaluation")
        .send(mybody)
        .end((err, response) => {
          response.should.have.status(500);
          response.body.should.be.a('object');
          response.body.success.should.equal(false);
          response.body.message.should.equal("Error: Server Error.");
          done();
        });
  });


  it("Should not POST a submission with no submissionID", (done) => {
    const mybody={
      usn:"241",
      ans:"First answer to assignment",
      assignmentIDStud:""
   };
   chai.request(server)
        .post("/api/evaluation")
        .send(mybody)
        .end((err, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.success.should.equal(false);
          response.body.message.should.equal("Error: assignmentID parameter cannot be blank");
          done();
        });

  });

  
});



describe("POST /api/evaluation/studMarks", () => {
  it("Ensures that the api querying the database for the marks of a student works", (done) => {
    const mybody = {
       usn:"241",
       assignmentID:"11"
    };
    var student241Ans="First answer to assignment";
    chai.request(server)
        .post("/api/evaluation/studMarks")
        .send(mybody)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          Evaluation.find(
            {$and:[{"submission.usn":mybody['usn']}, {"creator.assignmentID":mybody['assignmentID']}]},
            (err, dbans) => {
              if (err) {
                throw err;
              }
              dbans[0].submission[0].ans.should.equal(student241Ans);
  
            }
          )
          done();
        });

  });
});

describe("POST /api/evaluation/teacherMarks", () => {
  it("Ensures that api to retreive the marks of an assignment works", (done) => {
    const mybody={
      assignmentID:"11"
    };
    chai.request(server)
        .post("/api/evaluation/teacherMarks")
        .send(mybody)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          Evaluation.find(
            {"creator.assignmentID": mybody['assignmentID']},
            (err, teachMarks) => {
              if (err) {
                throw err;
              }
              teachMarks[0].submission[0].ans.should.equal("First answer to assignment");
              teachMarks[0].submission[0].usn.should.equal("241");
            }
          )
          done();
        });

  });
});

describe("POST /api/evaluation/activeAssignments", () => {
  it("Testing working of the api : /api/evaluation/activeAssignments", (done) => {
    chai.request(server)
        .post("/api/evaluation/activeAssignments")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.equal(true);
          response.body.message.should.equal("Details successfully retrieved");
          done();
        });
  });
});

describe("POST /api/evaluation/teacherMarks/all", () => {
  it("Testing working of the api : /api/evaluation/teacherMarks/all", (done) => {
    chai.request(server)
        .post("/api/evaluation/teacherMarks/all")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('object');
          response.body.success.should.equal(true);
          response.body.message.should.equal("Details successfully retrieved");
          done();
        });
  });
});

// after(done => {
//   app.close(done);
// });



