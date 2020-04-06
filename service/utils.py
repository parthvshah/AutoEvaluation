def preprocessing():
    f = open("./data/sample.txt", "r")
    lines = f.readlines()

    lines[1] = lines[1].lower()
    lines[2] = lines[2].lower()
    lines[3] = lines[3].lower()
    lines[4] = lines[4].lower()


    # TODO: Remove stop words and lem

    # expected, recieved 
    return (lines[1], lines[2], lines[3], lines[4])