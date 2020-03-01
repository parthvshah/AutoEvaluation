import tensorflow as tf
import numpy as np
import tensorflow_hub as hub
from utils import preprocessing

module_url = "https://tfhub.dev/google/universal-sentence-encoder/1?tf-hub-format=compressed"

embed = hub.Module(module_url)

messages = list()

corpus = preprocessing()
messages.append(corpus[0])
messages.append(corpus[1])

similarity_input_placeholder = tf.compat.v1.placeholder(tf.string, shape=(None))
similarity_message_encodings = embed(similarity_input_placeholder)

with tf.compat.v1.Session() as session:
    session.run(tf.compat.v1.global_variables_initializer())
    session.run(tf.compat.v1.tables_initializer())
    message_embeddings_ = session.run(similarity_message_encodings, feed_dict={similarity_input_placeholder: messages})

    corr = np.inner(message_embeddings_, message_embeddings_)
    print(corr[0][1])