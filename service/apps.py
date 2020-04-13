#!flask/bin/python
from flask import Flask, jsonify, request
from pymongo import MongoClient
import pprint as pp
from driver import allSubsEval
from flask_cors import CORS, cross_origin

# f = open('key.pem', 'r')
# masterKey = str(f.readline())
# f.close()

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

client = MongoClient("mongodb://127.0.0.1:27017")
db = client.WT2_db_dev
evaluation = db.evaluations 

@app.route('/service/autoevaluation/start', methods=['POST'])
@cross_origin()
def startAutoEval():

    print("Getting assignments.")
    assignments = evaluation.find({})

    for assignment in assignments:
       
        documentID = assignment['_id']
        sampleAns = assignment['creator']['sampleAns']
        maxMarks = assignment['creator']['maxMarks']

        allSubs = []

        for sub in assignment['submission']:
            usn = sub['usn']
            ans = sub['ans']
            marksObtained = sub['marksObtained']
            print(marksObtained)
            if(marksObtained < 0):
                allSubs.append([usn, ans])
        
        print("Auto evaluating assignment ", documentID)
        marks = allSubsEval(sampleAns, maxMarks, allSubs)
        
        print(marks)
        print("Updating marks for assignment ", documentID)    
        for mark in marks:
            evaluation.update_one({ "_id": documentID, "submission.usn": mark[0] }, { "$set": { "submission.$.marksObtained": mark[1] } })

    
    print("Completed.")
    successResponse = {"success": True, "message": "Auto evaluation completed."}
    return jsonify(successResponse)


if __name__ == '__main__':
    app.run(debug=True)