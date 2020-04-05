from main import evaluateTriple

def allSubsEval(sampleAns, maxMarks, allSubs, method="weighted"):
    evalArr = []

    for sub in allSubs:
        triple = evaluateTriple(sampleAns, sub[1])
        marks = 0.0

        if(method=="uniform"):
            marks = sum(triple)/2*maxMarks
        if(method=="weighted"):
            marks = ((triple[0]*1)+(triple[1]*3))/4*maxMarks

        evalArr.append([sub[0], round(marks, 1)])

    # Return an array with USN and marks subarrays
    return evalArr