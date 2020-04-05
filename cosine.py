from utils import preprocessing
import numpy as np
from scipy import spatial

gloveFile = './data/glove.6B.300d.txt'

def loadGloveModel(gloveFile):
    f = open(gloveFile, 'r')
    model = {}
    for line in f:
        splitLine = line.split()
        word = splitLine[0]
        embedding = np.array([float(val) for val in splitLine[1:]])
        model[word] = embedding
    print("Done.", len(model), " words loaded.")
    return model

model = loadGloveModel(gloveFile)

def cosine_distance_method(s1, s2):
    s1 = list(s1.split())
    s2 = list(s2.split())

    # s1Inner = [model[word] for word in s1]
    s1Inner = []
    for word in s1:
        try:
            s1Inner.append(model[word])
        except KeyError:
            continue

    # s2Inner = [model[word] for word in s2]
    s2Inner = []
    for word in s2:
        try:
            s2Inner.append(model[word])
        except KeyError:
            continue
   
    vector_1 = np.mean(s1Inner,axis=0)
    vector_2 = np.mean(s2Inner,axis=0)

    cosine = spatial.distance.cosine(vector_1, vector_2)
    return (1-cosine)

if(__name__=="__main__"):
    corpus = preprocessing()
    s1 = corpus[0]
    s2 = corpus[1]
    print(cosine_distance_method(s1,s2))