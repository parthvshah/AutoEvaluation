import tensorflow as tf
import numpy as np
import tensorflow_hub as hub
from utils import preprocessing
import os

# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '1'
os.environ['XLA_FLAGS'] = '--xla_hlo_profile'

def universal_sentence_encoder(s1, s2):
    module_url = "https://tfhub.dev/google/universal-sentence-encoder/1?tf-hub-format=compressed"

    embed = hub.Module(module_url)

    messages = list()

    messages.append(s1)
    messages.append(s2)

    similarity_input_placeholder = tf.compat.v1.placeholder(tf.string, shape=(None))
    similarity_message_encodings = embed(similarity_input_placeholder)

    with tf.compat.v1.Session() as session:
        session.run(tf.compat.v1.global_variables_initializer())
        session.run(tf.compat.v1.tables_initializer())
        message_embeddings_ = session.run(similarity_message_encodings, feed_dict={similarity_input_placeholder: messages})

        corr = np.inner(message_embeddings_, message_embeddings_)
        return(corr[0][1])