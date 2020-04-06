from cosine import cosine_distance_method
from encoding import universal_sentence_encoder
from jaccard import jaccard_similarity

from utils import preprocessing

def evaluateTriple(sampleAns, query):
    cosine = round(cosine_distance_method(sampleAns, query), 4)
    # encoding = round(universal_sentence_encoder(sampleAns, query), 4)
    jaccard = round(jaccard_similarity(sampleAns, query), 4)

    return [cosine, jaccard]

if(__name__=="__main__"):
    corpus = preprocessing()
    sample = corpus[0]
    queries = [corpus[1], corpus[2], corpus[3]]
    
    for i in range(len(queries)):
        cosine = round(cosine_distance_method(sample, queries[i]), 2)
        # encoding = round(universal_sentence_encoder(sample, queries[i]), 2)
        jaccard = round(jaccard_similarity(sample, queries[i]), 2)

        print("Cosine: ", cosine)
        # print("Encoding: ", encoding)
        print("Jaccard: ", jaccard)

        print("Uniform: ", round(((cosine*1)+(jaccard*3))/4*5, 1))
        print()
