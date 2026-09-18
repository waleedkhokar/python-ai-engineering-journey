import requests

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    support_questions = [
        "What products do you offer in the Security category?",
        "Can you tell me the features and stock level of the Neural Network Monitor?",
        "What is the most expensive product you have in stock?"
    ]

    analytics_questions = [
        "What is our total revenue from completed orders?",
        "List all products whose price is greater than $150.",
        "Which product has the lowest stock quantity?"
    ]

    print("=== TESTING SUPPORT RAG AGENT ===")
    for q in support_questions:
        print(f"\nQ: {q}")
        try:
            res = requests.post(f"{BASE_URL}/support/chat", json={"message": q})
            print("Response:", res.json().get("reply", res.json()))
        except Exception as e:
            print("Error:", e)
        print("-" * 40)

    print("\n=== TESTING ADMIN ANALYTICS AGENT ===")
    for q in analytics_questions:
        print(f"\nQ: {q}")
        try:
            res = requests.post(f"{BASE_URL}/analytics/query", json={"message": q})
            print("Response:", res.json().get("reply", res.json()))
        except Exception as e:
            print("Error:", e)
        print("-" * 40)

if __name__ == "__main__":
    try:
        run_tests()
    except requests.exceptions.ConnectionError:
        print("Error: Make sure your FastAPI server is running with uvicorn!")