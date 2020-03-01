from utils import preprocessing

def jaccard_similarity(queryS, documentS):
    query = queryS.split()
    document = documentS.split()

    intersection = set(query).intersection(set(document))
    union = set(query).union(set(document))
    return len(intersection)/len(union)

if(__name__=="__main__"):
    corpus = preprocessing()
    s1 = corpus[0]
    s2 = corpus[1]   
    print(jaccard_similarity(s1, s2))