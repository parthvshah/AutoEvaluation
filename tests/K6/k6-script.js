// Auto-generated by the Load Impact converter

import "./libs/shim/core.js";
import "./libs/shim/urijs.js";

export let options = {
  maxRedirects: 4,
  vus: 100,
  duration: "1m"
};

const Request = Symbol.for("request");
postman[Symbol.for("initial")]({
  options,
  environment: {
    base_url: "http://localhost:8080",
    stud_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWU4OWM5YzNlZjE5ODY3MDlkZmQ2YTZmIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE1OTAzODY4MjAsImV4cCI6MTU5MDU1OTYyMH0.s_qmyFCQbU6Jn57RUz31hyVYLOyKI0kj6TE4re67Z4Y",
    prof_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWU4OWM5NmFlZjE5ODY3MDlkZmQ2YTZlIiwicm9sZSI6InByb2YiLCJpYXQiOjE1OTAzODc0OTYsImV4cCI6MTU5MDU2MDI5Nn0.QtFskqH2jC5Ybaf3h1FAXjfcnoSJsKb3dU_yAQeR1zY"
  }
});

export default function() {
  postman[Request]({
    name: "getHomePage",
    id: "f823bd86-4a70-44fa-9bbb-f9d2580b6107",
    method: "GET",
    address: "{{base_url}}/api/account/signin"
  });

  postman[Request]({
    name: "logIn",
    id: "672ef8a9-4ae2-4f21-b452-c514850987c0",
    method: "POST",
    address: "{{base_url}}/api/account/signin",
    data: '{\n\t"usn": "PES1201700134",\n\t"password": "ADMIN"\n}'
  });

  postman[Request]({
    name: "getAllDetails",
    id: "0e6646b5-c2ae-49a0-99c9-b42edf48a643",
    method: "POST",
    address: "{{base_url}}/api/evaluation/teacherMarks/all",
    headers: {
      "x-access-token": "{{prof_token}}"
    }
  });

  postman[Request]({
    name: "getMarksForAssigment",
    id: "132ae300-07d2-4d56-adb4-efeebd72c653",
    method: "POST",
    address: "{{base_url}}/api/evaluation/teacherMarks",
    data: '{\n\t"assignmentID": "AS01"\n}',
    headers: {
      "x-access-token": "{{prof_token}}"
    }
  });

  postman[Request]({
    name: "getStudentMarks",
    id: "69728647-d840-4d5c-a0bf-ca76ba01a8dc",
    method: "POST",
    address: "{{base_url}}/api/evaluation/studMarks",
    data: '{\n\t"usn": "PES1201700134",\n\t"assignmentID": "AS01"\n}'
  });

  postman[Request]({
    name: "getAllActiveAssignments",
    id: "61b69ad1-d5e1-4708-97c7-14d303668caa",
    method: "POST",
    address: "{{base_url}}/api/evaluation/activeAssignments"
  });

  postman[Request]({
    name: "createAssignment",
    id: "a5452c1c-449d-4c53-9d1e-90ead03ed2f2",
    method: "POST",
    address: "{{base_url}}/api/evaluation/teacher",
    data:
      '{\n\t"sampleAns": "This is a Postman generated test answer. We are performing load testing.",\n\t"assignmentID": "AS667",\n\t"name": "Load Testing Test Assignment",\n\t"course": "CC",\n\t"question": "What kind of testing is this?",\n\t"maxMarks": "10"\n}',
    headers: {
      "x-access-token": "{{prof_token}}"
    }
  });

  postman[Request]({
    name: "submitAssignment",
    id: "96d94ff1-5a38-4605-9a46-35d64d7ecad0",
    method: "POST",
    address: "{{base_url}}/api/evaluation",
    data:
      '{\n\t"usn": "PES1201700134",\n\t"assignmentIDStud": "AS666",\n\t"ans": "As you can guess, we are using Postman and K6 for performance load testing. Hope there are no problems in porting this collection."\n}',
    headers: {
      "x-access-token": "{{stud_token}}"
    }
  });
}
