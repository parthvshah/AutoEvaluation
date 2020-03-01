from utils import preprocessing
import numpy as np
from scipy import spatial

gloveFile = './data/glove.6B.50d.txt'

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

def cosine_distance_wordembedding_method(s1, s2):

    vector_1 = np.mean([model[word] for word in s1],axis=0)
    vector_2 = np.mean([model[word] for word in s2],axis=0)

    cosine = spatial.distance.cosine(vector_1, vector_2)
    return (1-cosine)

if(__name__=="__main__"):
    corpus = preprocessing()
    s1 = corpus[0]
    s2 = corpus[1]
    print(cosine_distance_wordembedding_method(list(s1.split()), list(s2.split())))