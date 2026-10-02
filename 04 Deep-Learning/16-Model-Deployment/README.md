# 16 — Model Deployment

**Date: 16 June 2026**

## 1. What Is Model Deployment?

Training a model is only part of an AI system.

**Model deployment** means making a trained model available so an application or user can send data and receive predictions.

```text
Training
   ↓
Save Model
   ↓
Package Model
   ↓
Serve Model
   ↓
API / Application
   ↓
Prediction
```

Example:

```text
User uploads image
       ↓
Frontend
       ↓
FastAPI
       ↓
PyTorch Model
       ↓
Prediction
       ↓
JSON Response
```

---

## 2. Save a PyTorch Model

The recommended approach is usually saving the model's `state_dict`.

```python
torch.save(model.state_dict(), "model.pth")
```

Load it later:

```python
model = MyModel()

model.load_state_dict(
    torch.load("model.pth", map_location="cpu")
)

model.eval()
```

The model architecture must be available when loading the weights.

For deployment, also keep track of:

* Model version
* Input shape
* Preprocessing
* Class names
* Framework/version
* Required dependencies

---

## 3. Inference Mode

Training and inference behave differently.

During inference:

```python
model.eval()

with torch.no_grad():
    prediction = model(x)
```

`model.eval()` switches layers such as Dropout and BatchNorm into evaluation behavior.

`torch.no_grad()` prevents unnecessary gradient computation.

This reduces memory usage and improves inference efficiency.

---

## 4. Preprocessing Must Match

One of the most common deployment mistakes is using different preprocessing during training and production.

Training:

```text id="p7q0kf"
Resize
 ↓
Normalize
 ↓
Tensor
 ↓
Model
```

Production must use the same expected process:

```text id="u9d1jh"
User Input
 ↓
Same Resize
 ↓
Same Normalize
 ↓
Tensor
 ↓
Model
```

If preprocessing changes, predictions can become unreliable even when the model itself is correct.

---

## 5. Serving a Model with FastAPI

FastAPI can expose the model through an HTTP API.

Example:

```python
from fastapi import FastAPI
import torch

app = FastAPI()

model = MyModel()
model.load_state_dict(
    torch.load("model.pth", map_location="cpu")
)
model.eval()


@app.post("/predict")
def predict(data: InputData):
    x = preprocess(data)

    with torch.no_grad():
        output = model(x)

    prediction = output.argmax(dim=1).item()

    return {
        "prediction": prediction
    }
```

The basic architecture becomes:

```text
Frontend
   ↓ HTTP
FastAPI
   ↓
Preprocessing
   ↓
PyTorch
   ↓
Prediction
   ↓
JSON
```

---

## 6. Request and Response Schemas

A production API should clearly define its input and output.

For example:

```json
{
  "text": "This product is excellent"
}
```

Response:

```json
{
  "label": "positive",
  "confidence": 0.94
}
```

Use validation so invalid requests do not reach the model.

For image models, the endpoint may receive an uploaded file instead of JSON.

---

## 7. Dockerizing the Model

Docker packages the application and its dependencies into a reproducible environment.

Example structure:

```text id="jj3k0u"
project/
├── app/
│   ├── main.py
│   ├── model.py
│   └── preprocessing.py
├── model.pth
├── requirements.txt
└── Dockerfile
```

Basic Dockerfile:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app",
     "--host", "0.0.0.0",
     "--port", "8000"]
```

Now the same application can run consistently across development and deployment environments.

---

## 8. CPU vs GPU Inference

Small models can often run effectively on CPU.

Large deep-learning models may benefit significantly from GPUs.

Typical device logic:

```python
device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "cpu"
)

model.to(device)
```

For inference:

```python
x = x.to(device)

with torch.no_grad():
    output = model(x)
```

For production, the choice depends on:

* Model size
* Request volume
* Latency requirements
* Cost
* GPU availability

---

## 9. Real-Time vs Batch Inference

### Real-Time

Prediction happens immediately after a request.

```text
Request → Model → Response
```

Useful for:

* Chat applications
* Image classification APIs
* Fraud checks
* Recommendation requests

### Batch

Process many samples together.

```text
1000 inputs
    ↓
Batch processing
    ↓
Predictions
```

Useful for:

* Daily reports
* Large datasets
* Offline document processing

Batching can improve hardware utilization.

---

## 10. Health Checks and Error Handling

A production API should provide a health endpoint:

```python
@app.get("/health")
def health():
    return {"status": "ok"}
```

Also handle:

* Invalid input
* Missing files
* Model-loading errors
* Unexpected exceptions
* Excessively large requests
* Timeouts

Do not expose internal stack traces or sensitive information to users.

---

## 11. Basic Production Structure

A cleaner deployment architecture:

```text id="qz1r0j"
Client
  ↓
API
  ↓
Validation
  ↓
Preprocessing
  ↓
Model
  ↓
Postprocessing
  ↓
Response

Supporting:
├── Logging
├── Health checks
├── Error handling
└── Monitoring
```

Logging should record useful operational information such as request timing, errors, and model version without exposing sensitive user data.

---

## 12. ONNX and Other Export Options

For some production workloads, models can be exported to formats such as **ONNX**.

Potential benefits include:

* Cross-framework/runtime compatibility
* Optimized inference
* Deployment flexibility

However, exporting is not automatically better than running native PyTorch. Test accuracy and performance before switching runtimes.

---

## 13. Cloud Deployment

A basic cloud deployment can look like:

```text
GitHub
   ↓
Docker Image
   ↓
Cloud Server
   ↓
FastAPI
   ↓
PyTorch Model
```

Possible infrastructure includes:

* CPU server for smaller models
* GPU server for heavy models
* Object storage for model files
* Managed databases for application data
* Reverse proxy/load balancer

At this stage, understand the deployment architecture rather than trying to master every cloud service.

---

## 14. Common Mistakes

* Forgetting `model.eval()`
* Forgetting `torch.no_grad()`
* Loading the model for every request
* Using different preprocessing in production
* Hardcoding secrets
* Not validating inputs
* Not having a health endpoint
* Shipping unnecessary dependencies
* Ignoring CPU/GPU device mismatches
* Returning raw internal errors
* Having no model version information

---

## 15. Practical Project

Deploy one of your trained models as:

```text id="3qrxjv"
PyTorch Model
      ↓
FastAPI
      ↓
Docker
      ↓
REST API
```

Implement:

1. `/health`
2. `/predict`
3. Input validation
4. Model loading at startup
5. `model.eval()`
6. `torch.no_grad()`
7. Consistent preprocessing
8. Error handling
9. Logging
10. Docker deployment

Then connect a simple frontend to the API.

---

## 16. Deployment Checklist

Before deployment:

* [ ] Model weights saved
* [ ] Model architecture available
* [ ] Preprocessing reproduced
* [ ] `model.eval()` enabled
* [ ] `torch.no_grad()` used
* [ ] Input validation implemented
* [ ] `/health` endpoint available
* [ ] Errors handled
* [ ] Model version tracked
* [ ] Docker image tested
* [ ] CPU/GPU tested
* [ ] Logs available
* [ ] Sensitive information protected

---

## 17. Interview Questions

1. How do you deploy a PyTorch model?
2. Why use `model.eval()`?
3. Why use `torch.no_grad()`?
4. What is `state_dict`?
5. How would you expose a model through FastAPI?
6. Why use Docker for model deployment?
7. CPU vs GPU inference?
8. Batch vs real-time inference?
9. Why must preprocessing remain consistent?
10. How would you monitor a deployed model?

---

## 18. Key Takeaways

* Deployment turns a trained model into a usable service.
* Save and version your model properly.
* Keep preprocessing consistent between training and production.
* FastAPI is useful for creating model APIs.
* Docker makes deployment reproducible.
* `model.eval()` and `torch.no_grad()` are essential for inference.
* Production systems need validation, logging, health checks, error handling, and basic monitoring.
* Deployment is the bridge between **Deep Learning** and **real AI applications**.

### Next → **17 — Deep Learning Projects**
