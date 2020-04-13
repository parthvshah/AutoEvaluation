const User = require('../../models/User');
const Evaluation = require('../../models/Evaluation');
var requireRole = require('../../middleware/Token').requireRole;
var verifyUser = require('../../middleware/Token').verifyUser;

module.exports = (app) => {
  app.post('/api/evaluation', (req, res) => {
    var usn = req.body.usn;
    // var section = req.body.section;
    // var subject = req.body.subject;
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
    // if (!subject) {
    //   return res.status(400).send({
    //     success: false,
    //     message: 'Error: subject parameter cannot be blank'
    //   });
    // }
    if (!ans) {
      return res.status(400).send({
        success: false,
        message: 'Error: answer parameter cannot be blank'
      });
    }
    // var myquery = { assignmentID: assignmentIDStud };
    // var newvalues = { $set: {submission['usn']: usn, submission['ans']: ans } };
    // Evaluation.updateOne(myquery, newvalues, function(err, resp){
    //   if (err) {
    //         return res.status(500).send({
    //           success: false,
    //           message: 'Error: Server Error.'
    //         });
    //       } else {
    //         return res.status(200).send({
    //           success: true,
    //           message: 'Password succesfully changed.'
    //         });
    //       }

    // });
  //   Evaluation.findOneAndUpdate(
  //     { creator:{assignmentID : assignmentIDStud}},
  //     { $push:{ 
  //             submission:
  //             {
  //                 usn: usn,
  //                 ans:ans

  //             }
  //           }
  //     }
  // )
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
    
    // const newEval = new Evaluation();
    // newEval.submission['usn'] = usn;
    // // newEval.section = section;
    // // newEval.subject = subject;
    // newEval.submission['ans'] = ans;
    // newEval.save((err, evalObj) => {
    //   if (err) {
    //     console.log("Error: "+err);
    //     return res.status(500).send({
    //       success: false,
    //       message: "Save failed.",
    //       error: err.message
    //     });
    //   }
    //   else {
    //     console.log("New eval saved.");
    //     return res.status(200).send({
    //       success: true,
    //       message: "New eval saved."
    //     });
    //   }
      
    // });
    

  });




  //Second API to manage teacher submission


  app.post('/api/evaluation/teacher', (req, res) => {
    // sampleAns:this.state.sampleAns,
    // assignmentID:this.state.assignmentID,
    // name:this.state.assignmentName,
    // course:this.state.course,
    // question:this.state.question,
    // maxMarks:this.state.maxMarks
    var sampleAns = req.body.sampleAns;
    var assignmentID = req.body.assignmentID;
    var name = req.body.name;
    var course = req.body.course;
    var question = req.body.question;
    var maxMarks = req.body.maxMarks;

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

    //'/api/evaluation/:usn/stud/:assignmentID'
    
    // var myquery = {$and:[{section:sectionTeacher},{subject:subjectTeacher}]};
    // var newvalues = {$set: {sampleAns: sampleAns}};

    // Evaluation.updateMany(myquery, newvalues, function(err, resp){
    //   if (err) {
    //     return res.status(500).send({
    //       success: false,
    //       message: 'Error: Server Error.'
    //     });
    //   } else {
    //     return res.status(200).send({
    //       success: true,
    //       message: 'Password succesfully changed.'
    //     });
    //   }

    // });



  });

  app.post('/api/evaluation/studMarks', (req, res)=>{
    // var usn = req.params.userID;
    // var assignmentID = req.params.assignmentID;
    var usn = req.body.usn;
    var assignmentID = req.body.assignmentID;

    //db.student.find({$and:[{"sex":"Male"},{"grd_point":{ $gte: 31 }},{"class":"VI"}]}).pretty();
    //{submission:{usn:usn}}
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

  app.post('/api/evaluation/teacherMarks', (req, res)=>{
    var assignmentID = req.body.assignmentID;
    Evaluation.find(
      {"creator.assignmentID":assignmentID},
      (err, teachMarks) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        var teacherMarks = teachMarks;
        // alert(studMarks)
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          marks: teachMarks
        });
      }
    )

  });


  



};
