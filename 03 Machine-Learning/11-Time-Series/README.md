# 📈 11 — Time Series

**Date:** 22 January 2026
**Folder:** `11-Time-Series`

---

## 🎯 Overview

**Time Series** is data collected or recorded over time.

Examples:

* Daily sales
* Stock prices
* Monthly revenue
* Website traffic
* Temperature
* Electricity consumption
* Number of orders per day

Unlike normal ML datasets, **the order of observations matters**.

Example:

```text
Date        Sales
Jan 01      120
Jan 02      135
Jan 03      128
Jan 04      150
...
```

The goal of **forecasting** is to use historical observations to predict future values.

---

# 1. Components of Time Series

A time series can contain several patterns.

### Trend

Long-term upward or downward movement.

```text
100 → 110 → 125 → 140 → 155
```

### Seasonality

A pattern that repeats at a known interval.

Example:

```text
Higher sales every December
Higher traffic every weekend
```

### Noise

Random variation that cannot be easily explained.

```text
Actual = Pattern + Random Variation
```

Understanding these components helps us choose an appropriate forecasting method.

---

# 2. Time Series vs Normal ML

For normal ML:

```text
Random Train/Test Split
```

can often be acceptable.

For time series, randomly mixing past and future observations can cause **data leakage**.

Incorrect:

```text
2024 ──┐
2025 ──┼── Random Split
2026 ──┘
```

Better:

```text
Training              Test
2024 ───────────────→ 2025
```

The model should learn from the **past** and predict the **future**.

---

# 3. ARIMA

**ARIMA = AutoRegressive Integrated Moving Average**

It is a classical statistical forecasting model.

ARIMA is represented as:

$$
ARIMA(p,d,q)
$$

Where:

| Parameter | Meaning              |
| --------- | -------------------- |
| `p`       | Autoregressive terms |
| `d`       | Differencing         |
| `q`       | Moving-average terms |

### Intuition

**AR — Autoregression**

Uses previous values.

```text
Today's value
← Yesterday
← Previous day
← Earlier values
```

**I — Integrated**

Uses differencing to make a non-stationary series more stationary.

Example:

```text
100, 110, 125, 140
```

First differences:

```text
+10, +15, +15
```

**MA — Moving Average**

Uses previous forecast errors.

---

# 4. SARIMA

**SARIMA = Seasonal ARIMA**

SARIMA extends ARIMA by handling **seasonality**.

It is commonly represented as:

$$
SARIMA(p,d,q)(P,D,Q,s)
$$

Where:

* `p,d,q` → regular components
* `P,D,Q` → seasonal components
* `s` → seasonal period

Example:

```text
Monthly sales
Seasonality = 12
```

because a yearly seasonal cycle contains 12 months.

---

# 5. Prophet

**Prophet** is a forecasting framework designed to make time-series forecasting relatively simple.

It works well for datasets with patterns such as:

* Trend
* Seasonality
* Holidays/events
* Missing observations
* Changes in trend

Basic workflow:

```python id="s1f2g3"
from prophet import Prophet

model = Prophet()

model.fit(train)

future = model.make_future_dataframe(
    periods=30
)

forecast = model.predict(future)
```

Prophet expects columns such as:

```text
ds → date/time
y  → value
```

Example:

```text
ds          y
2026-01-01  120
2026-01-02  135
2026-01-03  128
```

---

# 6. LSTM for Time Series

**LSTM (Long Short-Term Memory)** is a recurrent neural network architecture that can learn patterns from sequential data.

It can be useful for complex sequential patterns.

Example:

```text
Past 7 days
    ↓
LSTM
    ↓
Next day's prediction
```

Input:

```text
[100, 110, 120, 115, 130, 140, 150]
```

Output:

```text
155
```

### Important

LSTM belongs primarily to **Deep Learning**, so here we only need to understand its role in time-series forecasting.

The detailed architecture, gates, backpropagation, and implementation belong in the Deep Learning curriculum.

---

# 7. Time-Series Train/Test Split

A typical forecasting split:

```text
Historical Data
│
├────────────── Training ──────────────┤
│                                      │
2023              2024              2025
                                      │
                                      ├── Test
                                      2026
```

Scikit-learn provides:

```python id="h4j5k6"
from sklearn.model_selection import TimeSeriesSplit

tscv = TimeSeriesSplit(n_splits=5)

for train_idx, test_idx in tscv.split(X):
    X_train = X.iloc[train_idx]
    X_test = X.iloc[test_idx]
```

Unlike ordinary K-Fold, the training data progresses forward through time.

---

# 8. Forecasting Evaluation

Common regression metrics can be used for forecasting.

### MAE

$$
MAE = \frac{1}{n}\sum |y_i-\hat{y_i}|
$$

Measures average absolute prediction error.

### RMSE

$$
RMSE = \sqrt{\frac{1}{n}\sum(y_i-\hat{y_i})^2}
$$

Penalizes larger errors more strongly.

### MAPE

$$
MAPE = \frac{100}{n}\sum\left|\frac{y_i-\hat{y_i}}{y_i}\right|
$$

Expresses error as a percentage.

> MAPE can behave poorly when actual values are zero or very close to zero.

---

# 9. Basic Forecasting Workflow

```text
Time-Series Data
      ↓
Sort by Date
      ↓
Explore Trend & Seasonality
      ↓
Check Missing Values
      ↓
Train/Test Split by Time
      ↓
Choose Model
      ↓
ARIMA / SARIMA / Prophet / LSTM
      ↓
Train
      ↓
Forecast Future
      ↓
Evaluate
      ↓
Improve
```

Always make sure the dates are correctly ordered.

```python id="n7p8q9"
df["date"] = pd.to_datetime(df["date"])
df = df.sort_values("date")
```

---

# 🧪 Practice

1. Load a daily sales dataset.
2. Convert the date column to `datetime`.
3. Sort observations chronologically.
4. Plot the time series.
5. Identify trend and seasonality.
6. Create a chronological train/test split.
7. Implement an ARIMA model.
8. Experiment with SARIMA on seasonal data.
9. Build a basic Prophet forecast.
10. Compare forecasts using MAE and RMSE.
11. Use `TimeSeriesSplit`.
12. Explain why random train/test splitting can cause leakage.

---

# 🎤 Interview Questions

1. What is time-series data?
2. Time series vs normal machine learning?
3. What are trend, seasonality, and noise?
4. What is stationarity?
5. What does ARIMA `(p,d,q)` mean?
6. ARIMA vs SARIMA?
7. What is seasonality?
8. What is Prophet?
9. Why shouldn't we randomly shuffle time-series data?
10. What is `TimeSeriesSplit`?
11. When might LSTM be useful for forecasting?
12. Which metrics can be used to evaluate forecasts?

---

# ✅ Key Takeaways

* **Time series** contains observations ordered by time.
* Forecasting predicts **future values using historical data**.
* **Trend** represents long-term movement.
* **Seasonality** represents repeating patterns.
* **ARIMA** handles autoregressive, differencing, and moving-average components.
* **SARIMA** extends ARIMA with seasonality.
* **Prophet** provides a practical approach for trend/seasonality-based forecasting.
* **LSTM** can model complex sequential patterns but belongs mainly to Deep Learning.
* Never allow future information to enter model training.
* Use **time-aware validation**, such as `TimeSeriesSplit`.
* Evaluate forecasts using metrics such as **MAE, RMSE, and MAPE**.

---

### ➡️ Next

**12 — Recommendation Systems** → Content-Based Filtering, Collaborative Filtering, Matrix Factorization, and Hybrid Recommendation Systems.
