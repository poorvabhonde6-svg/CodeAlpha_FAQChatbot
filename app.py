from flask import Flask, render_template, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

faq = pd.read_csv("faq.csv")

questions = faq["question"].astype(str).tolist()
answers = faq["answer"].astype(str).tolist()

vectorizer = TfidfVectorizer()
q_vectors = vectorizer.fit_transform(questions)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json["message"].lower()

    vec = vectorizer.transform([msg])
    score = cosine_similarity(vec, q_vectors)

    idx = score.argmax()
    confidence = score[0][idx]

    if confidence < 0.18:
        reply = "I’m not fully sure. Can you rephrase?"
    else:
        reply = answers[idx]

    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(debug=True)