const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
  creator: {
    assignmentID: {
      type: String,
      required: true,
      unique:true
    },
    course: {
      type: String
    },
    name: {
      type: String
    },
    maxMarks: {
      type: Number,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    sampleAns: {
      type: String,
      required: true
    }
  },
  submission: [{
    usn: {
      type: String,
      unique:true
    },
    ans: {
      type: String,
    },
    marksObtained: {
      type: Number,
      default: -1
    }
  }]
});


module.exports = mongoose.model('Evaluation', EvaluationSchema);
