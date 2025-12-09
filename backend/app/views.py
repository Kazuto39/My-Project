from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import csv 
import os

# --- CSVファイルを読み込んで辞書にする ---
def load_ngram_data():
    csv_path = os.path.join(os.path.dirname(__file__), 'BNC_baby_bigram_zscore.csv')
    ngram_data = {}

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            ngram = row["ngram"].lower().strip()
            try:
                z_score = float(row["z_score"])
                 
            except ValueError:
                z_score = 0.0
            ngram_data[ngram] = z_score
    return ngram_data

# --- テキストをbigramに分割し、z_scoreで自然さを評価 --- 
def evaluate_naturalness(text):
    ngram_data = load_ngram_data()
    words = text.lower().split()
    results = []
    z_scores = []

    for i in range(len(words) - 1):
        bigram = f"{words[i]} {words[i+1]}"
        z_score = ngram_data.get(bigram)

        if z_score is not None:
         # ★ここで4段階分類を行う
            if z_score >= 1.0:
             status = "Very Natural"
            elif z_score >= 0.0:
                 status = "Natural"
            elif z_score >= -1.0:
                 status = "Slightly Unnatural"
            else: status = "Unnatural"

            z_scores.append(z_score)
        
        else:
         # CSVに存在しないbigramは非常に低い頻度とみなす
            z_score = -1.0
            status = "Unnatural" 
            results.append({ "bigram": bigram, "z_score": round(z_score, 3), "status": status })

    # 文全体の平均zスコア
    avg_z = round(sum(z_scores) / len(z_scores), 3) if z_scores else 0.0

    return results, avg_z

# --- APIエンドポイント --- 
@api_view(["POST"])
def check_bigrams(request):
    text = request.data.get("text", "")
    if not text:
        return Response({"error": "No text provided."}, status=400)
         
    marked, avg_z = evaluate_naturalness(text) 
    return Response({ "marked": marked, "average_z_score": avg_z })
    
def frontpage(request):
    return render(request, "app/frontpage.html")