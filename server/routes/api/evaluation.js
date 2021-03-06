// const User = require('./server/models/User');
// const Evaluation = require('./server/models/Evaluation');
const User = require('../../models/User');
const express = require('express');
const Evaluation = require('../../models/Evaluation');
var requireRole = require('../../middleware/Token').requireRole;
var verifyUser = require('../../middleware/Token').verifyUser;
// var app=express();
module.exports = (app) => {
  // API01 - Submits an assignment
  app.post('/api/evaluation', (req, res) => {
    var usn = req.body.usn;
    var ans = req.body.ans;
    var assignmentIDStud = req.body.assignmentIDStud;

    //Verify that userID is present as a parameter
    if (!usn) {
      return res.status(400).send({
        success: false,
        message: 'Error: usn parameter cannot be blank'
      });
    }
    if (!assignmentIDStud) {
      return res.status(400).send({
        success: false,
        message: 'Error: assignmentID parameter cannot be blank'
      });
    }
    if (!ans) {
      return res.status(400).send({
        success: false,
        message: 'Error: answer parameter cannot be blank'
      });
    }

  Evaluation.findOneAndUpdate({
      'creator.assignmentID': assignmentIDStud
    },
    {
      $push:{
        submission:{
            usn: usn,
            ans: ans
        }
            
      }
    },
    //use resp
    (err, resp)=>{
      if (err) {
            return res.status(500).send({
              success: false,
              message: 'Error: Server Error.'
            });
          } else {
            return res.status(200).send({
              success: true,
              message: 'success'
            });
          }
    }
  );
  

  });

  // API02 - Creates an assignment
  app.post('/api/evaluation/teacher', requireRole("prof"), (req, res) => {
    var sampleAns = req.body.sampleAns;
    var assignmentID = req.body.assignmentID;
    var name = req.body.name;
    var course = req.body.course;
    var question = req.body.question;
    var maxMarks = req.body.maxMarks;

    if (!sampleAns) {
      return res.status(400).send({
        success: false,
        message: 'Error: sampleAns parameter cannot be blank'
      });
    }
    if (!assignmentID) {
      return res.status(400).send({
        success: false,
        message: 'Error: assignmentID parameter cannot be blank'
      });
    }
    // Evaluation.createIndex({"creator.assignmentID":1}, {unique:true});
    const newEval = new Evaluation();
    newEval.creator.sampleAns = sampleAns;
    newEval.creator.assignmentID = assignmentID;
    newEval.creator.name = name;
    newEval.creator.course = course;
    newEval.creator.question = question;
    newEval.creator.maxMarks = maxMarks;
    newEval.save((err, evalObj) => {
      if (err) {
        console.log("Error: "+err);
        return res.status(500).send({
          success: false,
          message: "Save failed.",
          error: err.message
        });
      }
      else {
        console.log("New eval saved.");
        return res.status(200).send({
          success: true,
          message: "New eval saved."
        });
      }
      
    });

  });


  // API03 - Gets all active assignments
  app.post('/api/evaluation/activeAssignments', (req, res) =>{
    Evaluation.find(
      {},
      // {"submission"}
      (err, assignment) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        var studAssignment = assignment;
        // alert(studMarks)
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          assignment: studAssignment
        });

      }
    )
  });

  // API04 - Gets student marks given a usn and assignmentID
  app.post('/api/evaluation/studMarks', (req, res)=>{
    var usn = req.body.usn;
    var assignmentID = req.body.assignmentID;

    Evaluation.find(
      {$and:[{"submission.usn":usn}, {"creator.assignmentID":assignmentID}]},
      // {"submission"}
      (err, marks) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        var studMarks = marks;
        // alert(studMarks)
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          marks: studMarks
        });

      }
    )
  });

  // API05 - Finds all marks of all student given an assignmentID
  app.post('/api/evaluation/teacherMarks', requireRole("prof"), (req, res)=>{
    var assignmentID = req.body.assignmentID;
    Evaluation.find(
      {"creator.assignmentID": assignmentID},
      (err, teachMarks) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        var teacherMarks = teachMarks;
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          marks: teachMarks
        });
      }
    )

  });

  // API06 - Return all details
  app.post('/api/evaluation/teacherMarks/all', requireRole("prof"), (req, res)=>{
    Evaluation.find(
      {},
      (err, teachMarks) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          marks: teachMarks
        });
      }
    )

  });

  app.post('/api/evaluation/cleardb', (req, res)=>{
    Evaluation.remove({}, (err) => { 
      if(err){
        throw err;
      };
      return res.status(200).send({
        success: true,
        message: "DB successfully cleared"
      });          
   });
  });


};
// module.exports = {app};
// module.exports = server
// export default app;
