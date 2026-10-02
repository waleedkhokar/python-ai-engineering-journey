# 🤖 Deep Learning — Setup and Environment

> **Step 4: Deep Learning**
> **Module 00: Setup and Environment**
> **Date: 01 June 2026**

---

# 📌 What is a Deep Learning Environment?

A Deep Learning environment is the complete software and hardware setup used to develop, train, evaluate, and experiment with Deep Learning models.

It includes:

```text
Python
   ↓
Virtual Environment
   ↓
PyTorch
   ↓
Jupyter / VS Code
   ↓
CPU / GPU
   ↓
CUDA / MPS
   ↓
Datasets
   ↓
Experiments
```

---

# 🎯 Why Do We Need This?

Deep Learning projects use many packages and can require significant computational resources.

A properly configured environment helps us:

* isolate dependencies
* avoid package conflicts
* use PyTorch correctly
* use GPU acceleration when available
* run Jupyter notebooks correctly
* reproduce experiments
* organize datasets and model files
* troubleshoot environment problems

---

# 📚 What I Will Learn

* Python virtual environments
* `pip` and dependencies
* `requirements.txt`
* Jupyter Notebook and JupyterLab
* Jupyter kernels
* VS Code configuration
* PyTorch installation and verification
* CPU vs GPU
* RAM vs VRAM
* CUDA basics
* MPS basics
* PyTorch device management
* reproducibility and seeds
* Deep Learning project structure
* datasets and checkpoints
* basic environment troubleshooting

---

# 1. 🐍 Python Virtual Environment

A virtual environment isolates project dependencies from the system Python installation.

Create:

```bash
python -m venv .venv
```

Activate on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Activate on macOS/Linux:

```bash
source .venv/bin/activate
```

Check Python:

```bash
python --version
```

Check the Python path:

```bash
where python
```

Windows/macOS/Linux can use different commands for locating the interpreter, so always verify that the active interpreter belongs to the intended `.venv`.

### Why use `.venv`?

Without isolation:

```text
Project A
   ↓
Package versions

Project B
   ↓
Different package versions

System Python
   ↓
Everything mixed together
```

With virtual environments:

```text
Project A → .venv
Project B → .venv
Project C → .venv
```

Each project can maintain its own dependencies.

---

# 2. 📦 pip

`pip` is used to install and manage Python packages.

Install:

```bash
python -m pip install package_name
```

Install a specific version:

```bash
python -m pip install package_name==version
```

List packages:

```bash
python -m pip list
```

Show package information:

```bash
python -m pip show torch
```

Upgrade:

```bash
python -m pip install --upgrade package_name
```

Uninstall:

```bash
python -m pip uninstall package_name
```

Using:

```bash
python -m pip
```

helps ensure that `pip` is associated with the Python interpreter currently being used.

---

# 3. 📋 requirements.txt

A project can record its dependencies in:

```text
requirements.txt
```

Example:

```text
torch
torchvision
numpy
pandas
matplotlib
jupyter
```

Install everything:

```bash
python -m pip install -r requirements.txt
```

For reproducibility, versions can be pinned:

```text
package==version
```

Do not blindly copy old PyTorch versions from tutorials. Use versions appropriate for the current environment and hardware.

---

# 4. 📓 Jupyter

Jupyter is useful for:

* experimentation
* visualization
* learning
* testing ideas
* Deep Learning experiments

Typical workflow:

```text
Write Code
   ↓
Run
   ↓
Inspect Output
   ↓
Change
   ↓
Run Again
```

---

# 5. 🧠 Jupyter Kernel

A **kernel** is the process that executes code from a Jupyter notebook.

This distinction is important:

```text
Notebook
   ↓
Jupyter Kernel
   ↓
Python Environment
   ↓
Python Code
```

A common problem:

```text
PyTorch installed in .venv
          ↓
Jupyter using another kernel
          ↓
import torch fails
```

Install `ipykernel` inside the environment:

```bash
python -m pip install ipykernel
```

Register it:

```bash
python -m ipykernel install --user \
  --name deep-learning \
  --display-name "Python (Deep Learning)"
```

Then select:

```text
Python (Deep Learning)
```

as the notebook kernel.

---

# 6. 💻 VS Code

For Deep Learning development, VS Code can be used with:

* Python extension
* Jupyter extension
* integrated terminal
* debugger
* Git
* Python interpreter selection
* notebook kernel selection

Important distinction:

```text
VS Code Python Interpreter
        ↓
Python environment

Jupyter Kernel
        ↓
Notebook execution environment
```

Always verify that both are using the intended environment.

---

# 7. 🔥 PyTorch

**PyTorch** is the primary Deep Learning framework used in this curriculum.

Important components include:

| Component          | Purpose                        |
| ------------------ | ------------------------------ |
| `torch`            | Core PyTorch functionality     |
| `torch.nn`         | Neural network layers/models   |
| `torch.optim`      | Optimizers                     |
| `torch.autograd`   | Automatic differentiation      |
| `torch.utils.data` | Dataset/data loading utilities |
| `torch.cuda`       | CUDA functionality             |
| `torchvision`      | Computer Vision tools          |

Later modules will use these extensively.

---

# 8. 🧪 Verify PyTorch

After installation:

```python
import torch

print("PyTorch:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())

if hasattr(torch.backends, "mps"):
    print("MPS available:", torch.backends.mps.is_available())
```

This tells us whether PyTorch is installed and which hardware acceleration backends are available.

---

# 9. 🖥️ CPU vs GPU

### CPU

General-purpose processor suitable for many types of computation.

### GPU

Designed for highly parallel workloads.

Deep Learning frequently performs operations such as:

```text
Matrix Multiplication
Tensor Operations
Vector Operations
```

These can benefit greatly from GPU parallelism.

However, GPU is not automatically better for every operation. Small workloads can sometimes be faster or simpler on CPU.

---

# 10. 💾 RAM vs VRAM

### RAM

Main system memory.

### VRAM

Memory available to a GPU.

During training, memory may be required for:

```text
Model Parameters
+
Input Data
+
Activations
+
Gradients
+
Optimizer State
```

Therefore, a large model or large batch size can exceed available VRAM.

---

# 11. ⚡ CUDA

CUDA is NVIDIA's platform and software ecosystem for GPU-accelerated computing.

Simplified:

```text
NVIDIA GPU
    ↓
NVIDIA Driver
    ↓
CUDA
    ↓
PyTorch
    ↓
GPU Computation
```

CUDA is not the GPU itself.

* GPU = hardware
* CUDA = NVIDIA computing platform/software ecosystem

PyTorch must have a compatible configuration to use CUDA.

---

# 12. 🍎 MPS

On supported Apple hardware, PyTorch can use Apple's Metal-based **MPS backend** for GPU acceleration.

Simplified:

```text
Apple GPU
    ↓
Metal
    ↓
MPS
    ↓
PyTorch
```

Therefore:

```text
NVIDIA
→ CUDA

Apple
→ MPS
```

The available backend depends on the machine.

---

# 13. 📱 PyTorch Device Management

PyTorch uses `torch.device` to represent where computation occurs.

Example:

```python
import torch

device = torch.device("cpu")

x = torch.tensor([1, 2, 3])

x = x.to(device)

print(x.device)
```

A general device-selection pattern:

```python
import torch

if torch.cuda.is_available():
    device = torch.device("cuda")
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

print("Using:", device)
```

Later, both models and tensors will commonly be moved using:

```python
model = model.to(device)
x = x.to(device)
```

---

# ⚠️ Device Mismatch

A common error occurs when:

```text
Model → GPU
Input → CPU
```

The model and relevant tensors need compatible devices.

Example:

```python
model = model.to(device)
x = x.to(device)
```

This concept becomes very important when training on GPUs.

---

# 14. 🎲 Reproducibility

Deep Learning often contains randomness.

Examples:

* parameter initialization
* data shuffling
* random augmentation
* sampling

Set seeds when appropriate:

```python
import random
import numpy as np
import torch

seed = 42

random.seed(seed)
np.random.seed(seed)
torch.manual_seed(seed)
```

For CUDA workflows, additional reproducibility settings may be required.

Important:

> A fixed seed improves reproducibility but does not guarantee identical results in every hardware and software configuration.

---

# 15. 📁 Project Structure

A basic professional structure:

```text
deep-learning-project/
│
├── notebooks/
├── src/
│
├── data/
│   ├── raw/
│   ├── processed/
│   └── external/
│
├── models/
├── checkpoints/
├── outputs/
├── logs/
├── configs/
├── tests/
│
├── requirements.txt
├── .gitignore
└── README.md
```

### Purpose

| Folder            | Purpose                      |
| ----------------- | ---------------------------- |
| `notebooks/`      | Experiments and learning     |
| `src/`            | Reusable source code         |
| `data/raw/`       | Original data                |
| `data/processed/` | Processed data               |
| `models/`         | Model-related code/artifacts |
| `checkpoints/`    | Saved training states        |
| `outputs/`        | Predictions/results          |
| `logs/`           | Training/experiment logs     |
| `configs/`        | Configuration                |
| `tests/`          | Tests                        |

---

# 16. 💾 Model Checkpoints

A checkpoint saves the state of training.

It may contain:

```text
Model Parameters
Optimizer State
Epoch
Training Information
```

Example:

```text
checkpoints/
├── latest.pt
├── best.pt
└── epoch-10.pt
```

Checkpoints are important because training may take a long time and can be resumed or evaluated later.

---

# 17. 🧪 Experiment Organization

Deep Learning involves experiments.

Record important information such as:

```text
Model
Dataset
Learning Rate
Batch Size
Epochs
Optimizer
Random Seed
Metrics
Hardware
Results
```

Example:

```text
experiments/
├── exp-001-baseline/
├── exp-002-learning-rate/
└── exp-003-model-size/
```

This makes comparisons and debugging easier.

---

# 18. 🧪 Environment Verification

Create a simple verification notebook:

```python
import torch

print("PyTorch version:", torch.__version__)
print("CUDA available:", torch.cuda.is_available())

if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))

if hasattr(torch.backends, "mps"):
    print("MPS available:", torch.backends.mps.is_available())

if torch.cuda.is_available():
    device = torch.device("cuda")
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

x = torch.tensor([1.0, 2.0, 3.0]).to(device)

print("Device:", device)
print("Tensor:", x)
```

This verifies:

* PyTorch
* hardware backend
* device selection
* tensor movement

---

# 🧯 Common Troubleshooting

## `ModuleNotFoundError`

Check:

```bash
python -m pip show torch
```

and verify the active interpreter.

---

## PyTorch works in terminal but not Jupyter

Likely:

```text
Terminal → .venv
Jupyter → different kernel
```

Select the correct Jupyter kernel.

---

## CUDA unavailable

Check:

```python
torch.cuda.is_available()
```

Then investigate:

```text
GPU
↓
Driver
↓
CUDA/PyTorch compatibility
```

---

## CUDA Out of Memory

Common causes:

* batch size too large
* model too large
* input too large
* insufficient VRAM

Common solutions include reducing batch size or model/input size.

---

## Device mismatch

Check:

```python
model.device
```

and:

```python
tensor.device
```

Ensure they are compatible.

---

# 🛠️ Practice

### Exercise 1

Create `.venv` and activate it.

### Exercise 2

Install PyTorch and Jupyter.

### Exercise 3

Register the environment as a Jupyter kernel.

### Exercise 4

Verify PyTorch.

### Exercise 5

Detect:

```text
CUDA
MPS
CPU
```

### Exercise 6

Create a tensor and move it to the selected device.

### Exercise 7

Set random seeds and compare multiple runs.

### Exercise 8

Create the Deep Learning project structure.

### Exercise 9

Create a basic environment verification notebook.

---

# 💼 Interview Questions

## Beginner

1. What is a virtual environment?
2. Why use `.venv`?
3. What is `pip`?
4. What is PyTorch?
5. What is Jupyter?
6. What is a Jupyter kernel?
7. What is a GPU?
8. What is VRAM?

## Intermediate

9. Why can Jupyter use a different Python environment?

10. Why are GPUs useful for Deep Learning?

11. What is CUDA?

12. What is MPS?

13. What is the difference between RAM and VRAM?

14. What does `.to(device)` do?

15. What causes a device mismatch?

16. Why are random seeds useful?

## Advanced Foundation

17. Explain the relationship between NVIDIA GPU, driver, CUDA, and PyTorch.

18. Why might a GPU exist but `torch.cuda.is_available()` return `False`?

19. Why can Deep Learning experiments produce different results?

20. How would you debug a CUDA out-of-memory error?

21. How would you reproduce another developer's Deep Learning environment?

---

# 🎯 Learning Goals

After completing this module, I should be able to:

* Create a Python virtual environment.
* Manage dependencies with `pip`.
* Use `requirements.txt`.
* Configure Jupyter and kernels.
* Configure VS Code.
* Install and verify PyTorch.
* Understand CPU/GPU differences.
* Understand RAM/VRAM.
* Understand CUDA and MPS.
* Manage PyTorch devices.
* Understand basic reproducibility.
* Organize Deep Learning projects.
* Manage checkpoints and experiments.
* Troubleshoot common environment problems.

---

# ✅ Completion Checklist

* [ ] Python verified
* [ ] `.venv` created
* [ ] `pip` working
* [ ] Dependencies installed
* [ ] Jupyter working
* [ ] Correct kernel selected
* [ ] VS Code configured
* [ ] PyTorch installed
* [ ] CPU verified
* [ ] CUDA checked
* [ ] MPS checked where applicable
* [ ] Device selection working
* [ ] Tensor movement tested
* [ ] Reproducibility tested
* [ ] Project structure created
* [ ] Environment verification completed

---

# 🔗 Next Module

Environment is now ready.

Next:

```text
00 Setup & Environment
        ↓
01 Deep Learning Fundamentals
        ↓
02 Neural Networks Basics
        ↓
03 Activation Functions
        ↓
04 Loss Functions & Optimizers
        ↓
05 Backpropagation
        ↓
...
```

### 🎯 Final Goal

The purpose of this module is simply:

> **Build a clean, reproducible, working PyTorch environment so the actual Deep Learning learning can begin.**

