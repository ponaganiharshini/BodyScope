import json, random
from flask import Flask, request, jsonify
from flask_cors import CORS
import anthropic

app = Flask(__name__)
CORS(app)
client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from your environment
MODEL = "claude-haiku-5-5"
LANGS = {"en": "English", "te": "Telugu", "hi": "Hindi"}

SYSTEM = (
    "You are BodyScope's friendly anatomy tutor for school and college students in India. "
    "Answer in 3 to 5 short, simple sentences. Teach general human-body education only. "
    "Do not diagnose, prescribe medicine or give personal medical advice; if asked, say to consult a doctor. "
    "If the question is not about the human body or health, politely say you only help with those topics."
)

def call(system, messages, max_tokens=400):
    msg = client.messages.create(model=MODEL, max_tokens=max_tokens, system=system, messages=messages)
    return msg.content[0].text.strip()

@app.get("/")
def home():
    return "BodyScope AI server is running."

@app.post("/ask")
def ask():
    d = request.get_json(silent=True) or {}
    q = (d.get("question") or "").strip()[:500]
    if not q:
        return jsonify(error="Empty question"), 400
    lang = LANGS.get(d.get("lang"), "English")
    hist = [m for m in d.get("history", []) if m.get("role") in ("user", "assistant") and isinstance(m.get("content"), str)][-6:]
    while hist and hist[0]["role"] != "user":
        hist.pop(0)
    msgs = [{"role": m["role"], "content": m["content"][:1000]} for m in hist]
    msgs.append({"role": "user", "content": f"The student is viewing the {d.get('organ', '')} model. Question: {q}"})
    try:
        return jsonify(answer=call(SYSTEM + f" Reply in {lang}.", msgs))
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.post("/translate")
def translate():
    d = request.get_json(silent=True) or {}
    text = (d.get("text") or "").strip()[:2000]
    lang = LANGS.get(d.get("lang"), "English")
    if not text:
        return jsonify(error="Empty text"), 400
    try:
        out = call(f"Translate the user's text into simple {lang}. Keep body-part names accurate. Output only the translation.",
                   [{"role": "user", "content": text}], 800)
        return jsonify(text=out)
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.post("/quiz")
def quiz():
    d = request.get_json(silent=True) or {}
    topic = (d.get("topic") or "the human body")[:60]
    lang = LANGS.get(d.get("lang"), "English")
    prompt = (f"Create 5 multiple-choice questions for school students about {topic}, written in {lang}. "
              'Return ONLY a JSON list like [{"q":"...","options":["a","b","c","d"],"answer":0}] '
              "where answer is the index (0-3) of the correct option. No other text.")
    try:
        raw = call("You write accurate, simple science quizzes. Output valid JSON only.", [{"role": "user", "content": prompt}], 1500)
        raw = raw.replace("```json", "").replace("```", "").strip()
        items, out = json.loads(raw), []
        for it in items:
            opts = it["options"]
            if len(opts) != 4 or not 0 <= int(it["answer"]) <= 3:
                continue
            right = opts[int(it["answer"])]
            random.shuffle(opts)
            out.append({"q": it["q"], "options": opts, "answer": opts.index(right)})
        if not out:
            raise ValueError("No valid questions")
        return jsonify(questions=out)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == "__main__":
    app.run(port=5000)
