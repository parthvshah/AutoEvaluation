from cosine import cosine_distance_method
from encoding import universal_sentence_encoder
from jaccard import jaccard_similarity

from utils import preprocessing

if(__name__=="__main__"):
    corpus = preprocessing()
    s1 = corpus[0]
    s2 = corpus[1]

    print("Cosine: ", round(cosine_distance_method(s1, s2), 4))
    print("Encoding: ", round(universal_sentence_encoder(s1, s2), 4))
    print("Jaccard: ", round(jaccard_similarity(s1, s2), 4))
