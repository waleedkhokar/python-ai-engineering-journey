
# 🧠 13 — Fine-Tuning and Open Models

> Learn how to work with open-weight language models, prepare fine-tuning datasets, apply parameter-efficient fine-tuning, and evaluate whether customization actually improves an LLM application.

---

## 📅 Learning Schedule

| Detail | Information |
|---|---|
| **Planned Date** | August 15, 2026 |
| **Learning Stage** | Stage 3 — LLM Application Engineering |
| **Difficulty** | Intermediate → Advanced |
| **Primary Language** | Python |
| **Core Technologies** | Hugging Face Transformers, Datasets, PEFT, LoRA, QLoRA, PyTorch |
| **Prerequisites** | LLM Fundamentals, Python, Deep Learning, Evaluation and Guardrails |
| **Previous Module** | [12 — LLM Evaluation and Guardrails](../12-LLM-Evaluation-and-Guardrails/README.md) |
| **Next Module** | [14 — Multimodal GenAI](../14-Multimodal-GenAI/README.md) |

### 🎯 Learning Goal

Understand how to customize open-weight LLMs, prepare high-quality instruction datasets, perform parameter-efficient fine-tuning, and compare the resulting model against a reliable baseline.

---

## 🗺️ Learning Roadmap

```text
Pretrained Language Models
          │
          ▼
Hosted APIs vs Open-Weight Models
          │
          ▼
When to Fine-Tune?
          │
          ▼
Dataset Preparation
          │
          ▼
Tokenization + Training Examples
          │
          ▼
LoRA and QLoRA
          │
          ▼
Fine-Tuning with Transformers + PEFT
          │
          ▼
Evaluation Against a Baseline
          │
          ▼
Save, Load, and Deploy the Adapter
```

---

## 🎯 1. Learning Objectives

By completing this module, you will be able to:

- Explain pretrained, instruction-tuned, and fine-tuned models.
- Distinguish open-weight models from fully open-source software.
- Compare hosted model APIs with local model inference.
- Decide whether prompting, RAG, or fine-tuning best fits a problem.
- Prepare and validate an instruction-tuning dataset.
- Understand tokenization, labels, and causal language-model training.
- Explain full fine-tuning, LoRA, and QLoRA.
- Understand the role of Hugging Face Transformers, Datasets, and PEFT.
- Run a small supervised fine-tuning experiment.
- Evaluate the fine-tuned model against a baseline.
- Understand adapter storage, model licensing, hardware limits, and deployment trade-offs.

---

# 🧠 2. What Is Fine-Tuning?

Fine-tuning means taking a pretrained model and continuing its training on a selected dataset to adapt its behavior to a particular task or style.

A pretrained LLM has already learned language patterns from a large training corpus. Fine-tuning uses additional examples to adjust the model's parameters or a trainable subset of them.

Examples of fine-tuning tasks:

- Following a particular instruction format.
- Producing consistent support-ticket classifications.
- Writing responses in a defined style.
- Extracting information in a predictable format.
- Adapting to specialized terminology.
- Improving performance on a specific task represented in the training data.

Fine-tuning is not the same as training an LLM from scratch. Training from scratch generally requires much more data, compute, and engineering.

### Model Customization Pipeline

```text
Pretrained Model
       │
       ▼
Prepare High-Quality Examples
       │
       ▼
Choose Training Method
       │
       ▼
Fine-Tune Model or Adapter
       │
       ▼
Evaluate on Held-Out Data
       │
       ▼
Compare With Baseline
       │
       ▼
Keep, Improve, or Reject the Result
```

Fine-tuning does not guarantee better performance. Poor training data or inappropriate training settings can make a model worse.

---

# 🧩 3. Hosted APIs vs Open-Weight Models

A hosted API lets you call a model operated by a provider. An open-weight model makes its trained parameter weights available under its distribution terms.

**Open weights do not automatically mean unrestricted use or a fully open-source model.** Check the model's license, acceptable-use terms, and redistribution requirements.

| Feature | Hosted Model API | Open-Weight Model |
|---|---|---|
| Model hosting | Provider operates it | You or a service provider can host it |
| Infrastructure management | Mostly handled by provider | Depends on hosting approach |
| Customization | Depends on provider's offerings | Often supports custom inference and fine-tuning |
| Initial setup | Usually straightforward | May require additional infrastructure |
| Hardware responsibility | Usually abstracted away | Your hosting environment must support the model |
| Data handling | Governed by provider terms and settings | Depends on your deployment and data controls |
| Cost structure | Often usage-based | Infrastructure, hosting, storage, and operations |
| Model access | Provider-controlled | Subject to model availability and license |

### Common Model-Hub Concepts

When using a model hub, you may encounter:

- Model ID or repository ID.
- Tokenizer files.
- Configuration files.
- Model weights.
- Model cards.
- License information.
- Training and evaluation details.

A model card should help you understand the model's intended use, limitations, supported languages, and recommended settings. It is not a substitute for your own evaluation.

---

# 🔍 4. When Should You Fine-Tune?

Fine-tuning is one of several ways to customize an AI application.

| Requirement | A Good Starting Approach |
|---|---|
| Improve the instructions given to a model | Prompt engineering |
| Answer questions from private or frequently changing documents | RAG |
| Use current external information | Retrieval or API integration |
| Produce valid structured data | Schema-constrained output and validation |
| Execute business operations | Tool calling and application logic |
| Improve consistent behavior on a specialized task | Evaluate fine-tuning |
| Train an entirely new foundation model | Pretraining, usually at much greater scale |

### RAG vs Fine-Tuning

**RAG** supplies relevant information at inference time. It is useful when answers depend on documents that change or must be cited.

**Fine-tuning** changes model behavior through training. It may help with consistent task patterns, response styles, or domain-specific behaviors when supported by suitable data.

They can also be combined.

For example, an enterprise assistant could use fine-tuning for a consistent response format and RAG for current internal policies.

**Important:** Fine-tuning is not a reliable way to keep frequently changing facts up to date. For that, retrieval or a trusted data/API connection is usually more appropriate.

---

# 📚 5. Prepare a Training Dataset

Dataset quality is one of the most important factors in fine-tuning.

For supervised instruction tuning, a dataset often contains examples of an instruction and the desired response.

Example `data/train.jsonl`:

```json
{"instruction":"Explain RAG in simple English.","response":"Retrieval-Augmented Generation finds relevant information and gives it to an LLM so the model can produce an answer grounded in that information."}
{"instruction":"Explain embeddings in one sentence.","response":"Embeddings are numerical vectors that represent information such as text in a form useful for measuring similarity."}
{"instruction":"Explain tool calling in simple English.","response":"Tool calling lets a model request that an application run a defined function, such as searching a database or calling an API."}
```

Each line is an independent JSON object.

These examples illustrate the format; they are not a sufficient dataset for training a useful model.

### Dataset Preparation Checklist

- Use examples that represent the real task.
- Remove duplicates and inconsistent answers.
- Exclude secrets and unauthorized personal data.
- Standardize formatting.
- Validate each JSONL record.
- Avoid examples that teach incorrect behavior.
- Keep training and evaluation examples separate.
- Track the dataset version.
- Document where the data came from and whether you have permission to use it.

### Train, Validation, and Test Sets

| Split | Purpose |
|---|---|
| Training | Updates model parameters or adapter weights |
| Validation | Helps choose training settings and detect overfitting |
| Test | Measures final performance on held-out examples |

Do not repeatedly tune against your test set. Keep it separate until you are ready to compare candidate models.

---

# 🔤 6. Tokenization and Training Examples

LLMs process tokens rather than ordinary words directly.

A tokenizer converts text into token IDs. The model learns to predict the next token in a sequence during causal language-model training.

For instruction tuning, the training example may be formatted as:

```text
### Instruction:
Explain embeddings in simple English.

### Response:
Embeddings are numerical vectors that represent information.
```

The exact format depends on the model's training template. Chat models often use a model-specific chat template containing role and message-boundary tokens.

### Why Formatting Matters

The model must learn the format you expect at inference time.

If the model uses a chat template, follow the model's documented format rather than inventing an incompatible one.

For supervised fine-tuning, training systems often calculate loss on the desired assistant response. Depending on the method, prompt tokens may be masked so they do not contribute to the loss.

The correct masking and formatting behavior depends on the trainer and model architecture.

---

# ⚙️ 7. Full Fine-Tuning vs LoRA vs QLoRA

There are different ways to update a pretrained model.

## 7.1 Full Fine-Tuning

Updates all or most of the model's trainable parameters.

**Advantages**
- Can adapt a broad range of model behavior.

**Trade-offs**
- Higher memory and compute requirements.
- More expensive training.
- Larger training artifacts.
- Greater risk of overfitting or damaging previously useful behavior.

## 7.2 LoRA — Low-Rank Adaptation

LoRA adds small trainable low-rank matrices to selected model layers while keeping the original weights frozen.

Instead of updating every model parameter, training updates a smaller set of adapter parameters.

**Advantages**
- Usually requires fewer trainable parameters.
- Reduces optimizer-state memory requirements.
- Makes adapters easier to store and compare.
- Can be effective for task-specific adaptation.

## 7.3 QLoRA — Quantized Low-Rank Adaptation

QLoRA combines a quantized base model with trainable LoRA adapters.

The quantized base model uses lower-precision storage to reduce memory requirements, while training updates the adapters.

Actual memory requirements still depend on model size, sequence length, batch size, quantization method, and implementation.

### Comparison

| Method | Base Model | Trainable Parameters | Typical Resource Demand |
|---|---|---|---|
| Full fine-tuning | Loaded in a suitable precision | Most or all model parameters | Highest |
| LoRA | Base weights generally frozen | Adapter parameters | Lower than full fine-tuning |
| QLoRA | Quantized base weights | Adapter parameters | Often lower memory than LoRA with a full-precision base |

LoRA and QLoRA do not automatically make every model trainable on every GPU. Verify hardware and memory requirements before starting.

---

# 🧰 8. Hugging Face Fine-Tuning Ecosystem

Several libraries work together in a typical fine-tuning workflow.

| Library | Purpose |
|---|---|
| Transformers | Load pretrained models and tokenizers |
| Datasets | Load, transform, and manage datasets |
| PEFT | Parameter-efficient methods such as LoRA |
| TRL | Training utilities for language-model post-training |
| PyTorch | Tensor operations and model training |
| Accelerate | Helps manage training across supported hardware configurations |

For a practical supervised fine-tuning workflow, Transformers, Datasets, PEFT, and TRL are commonly used together.

You do not need every library for every experiment. Select dependencies based on the chosen model and training approach.

### Install the Main Packages

```bash
pip install torch transformers datasets peft trl accelerate
```

Hardware-specific installation requirements can vary. Follow the official PyTorch installation guidance for your operating system and accelerator.

---

# 💻 9. Practical Lab — Fine-Tune a Small Model With LoRA

The following example demonstrates the general structure of supervised fine-tuning with a small causal language model and LoRA.

**Hardware note:** Even a small model requires suitable memory, and training performance varies by device. Start with a small experiment and verify the model's license and hardware requirements.

### Step 1 — Prepare the Dataset

Create `data/train.jsonl`:

```json
{"instruction":"What is RAG?","response":"RAG retrieves relevant external information and supplies it to a language model to help ground its answer."}
{"instruction":"What is tool calling?","response":"Tool calling lets a language model request that an application execute a defined function."}
{"instruction":"What is an embedding?","response":"An embedding is a numerical vector representation of information such as text."}
```

For this lab, create a separate validation file containing additional examples that are not copied from the training file.

### Step 2 — Load the Model and Dataset

```python
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM

model_id = "HuggingFaceTB/SmolLM2-135M-Instruct"

tokenizer = AutoTokenizer.from_pretrained(model_id)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

dataset = load_dataset(
    "json",
    data_files={
        "train": "data/train.jsonl",
        "validation": "data/validation.jsonl",
    },
)

model = AutoModelForCausalLM.from_pretrained(
    model_id
)
```

This model ID is an example. Check the model card, license, and compatibility with your installed library versions before use.

### Step 3 — Format Instruction Examples

```python
def format_example(example):
    messages = [
        {
            "role": "user",
            "content": example["instruction"],
        },
        {
            "role": "assistant",
            "content": example["response"],
        },
    ]

    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=False,
    )

    return {"text": text}


formatted_dataset = dataset.map(
    format_example
)
```

This uses the tokenizer's chat template when supported. Confirm that the chosen model's template matches the intended supervised fine-tuning behavior.

### Step 4 — Configure LoRA

```python
from peft import LoraConfig

lora_config = LoraConfig(
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules=[
        "q_proj",
        "v_proj",
    ],
)
```

The target module names vary between model architectures. Inspect the chosen model's layer names and PEFT documentation before using this configuration.

### Step 5 — Configure the Trainer

```python
from trl import SFTConfig, SFTTrainer

training_args = SFTConfig(
    output_dir="./outputs/smollm2-lora",
    dataset_text_field="text",
    max_length=512,
    per_device_train_batch_size=1,
    per_device_eval_batch_size=1,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    num_train_epochs=1,
    logging_steps=5,
    eval_strategy="epoch",
    save_strategy="epoch",
    report_to="none",
)

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=formatted_dataset["train"],
    eval_dataset=formatted_dataset["validation"],
    peft_config=lora_config,
    processing_class=tokenizer,
)

trainer.train()
```

Trainer arguments and integration interfaces can change between library versions. Use mutually compatible versions and check the installed version's documentation if an argument is unavailable.

### Step 6 — Save the Adapter

```python
trainer.model.save_pretrained(
    "./outputs/smollm2-lora/adapter"
)

tokenizer.save_pretrained(
    "./outputs/smollm2-lora/adapter"
)
```

With PEFT, the saved training artifact is typically an adapter rather than a complete copy of the base model. You must retain access to the compatible base model when loading the adapter.

### What You Should Learn

- How to format instruction examples.
- How a tokenizer prepares text for training.
- How LoRA reduces the number of trainable parameters.
- How training and validation datasets are used.
- How to save an adapter.
- Why a successful training run does not prove that model quality improved.

**Important:** Treat this as a learning template, not a guaranteed copy-and-run script for every library version or model architecture. First verify the model template, target modules, trainer arguments, dataset formatting, and hardware compatibility.

---

# 📈 10. Evaluate the Fine-Tuned Model

The main question is not whether training completed. It is whether the resulting model performs better on the intended task.

Evaluate the base model and fine-tuned model using the same held-out test examples.

### Evaluation Dimensions

| Dimension | What to Check |
|---|---|
| Task correctness | Does it complete the intended task correctly? |
| Instruction following | Does it follow required constraints? |
| Format compliance | Does it produce the required structure? |
| General capability | Has useful general behavior deteriorated? |
| Safety | Does it continue to follow application safety requirements? |
| Latency | Does inference meet your requirements? |
| Resource usage | What memory and compute does it need? |

### Evaluation Workflow

1. Save a baseline before fine-tuning.
2. Prepare a separate test dataset.
3. Run the baseline on the test examples.
4. Run the fine-tuned model on the same examples.
5. Calculate suitable task-specific metrics.
6. Inspect representative failures manually.
7. Compare quality, latency, and resource usage.
8. Keep the fine-tuned version only if it provides a meaningful improvement.

For classification, use appropriate classification metrics. For extraction, measure schema validity and field-level correctness. For generation, use a rubric, task-specific checks, and human review.

Do not rely on training loss alone. Lower training loss does not guarantee better real-world answers.

---

# ⚠️ 11. Common Fine-Tuning Mistakes

| Mistake | Better Approach |
|---|---|
| Fine-tuning before testing prompts | Establish a strong baseline first |
| Using a tiny dataset as proof of quality | Treat tiny datasets as pipeline smoke tests |
| Training and testing on the same examples | Keep held-out evaluation data |
| Using inconsistent answer formats | Standardize the dataset and template |
| Ignoring model licensing | Verify use and redistribution conditions |
| Selecting incompatible LoRA targets | Inspect model architecture and documentation |
| Overtraining on repeated examples | Monitor validation results and generalization |
| Assuming fine-tuning stores all private documents reliably | Use retrieval for changing or reference-specific information |
| Ignoring inference hardware | Benchmark the actual serving configuration |
| Assuming an adapter is a standalone model | Retain and load the compatible base model |

---

# 🔐 12. Data, Licensing, and Model Safety

Before training or deploying a model, check:

- Whether the dataset can legally be used for training.
- Whether personal or confidential information must be removed.
- Whether the model license permits your intended commercial use.
- Whether redistribution of model weights or adapters is allowed.
- Whether training examples contain biased or unsafe behavior.
- Whether the fine-tuned model introduces new failure modes.
- Whether the deployment environment protects model files and user data.

A fine-tuned model is not automatically private, unbiased, safe, or compliant. Fine-tuning can reproduce patterns present in the training data, so dataset governance and evaluation remain important.

---

# 🚀 13. Final Project — Domain-Specific Fine-Tuned Assistant

## Project Goal

Fine-tune a small instruction model for a clearly defined task, then evaluate whether it improves over the original model.

Possible tasks:

- Support-ticket classification.
- Short technical explanations.
- Consistent structured information extraction.
- Categorization of software issue reports.
- Domain-specific instruction following.

### Core Requirements

- [ ] Select a suitable model and verify its license.
- [ ] Define a measurable task.
- [ ] Create and validate an instruction dataset.
- [ ] Separate training, validation, and test data.
- [ ] Establish a baseline model evaluation.
- [ ] Run a small supervised fine-tuning experiment.
- [ ] Use LoRA or another justified method.
- [ ] Save the trained adapter.
- [ ] Evaluate the fine-tuned model on held-out data.
- [ ] Compare quality against the baseline.
- [ ] Inspect failures and potential regressions.
- [ ] Document hardware, training settings, and limitations.
- [ ] Explain whether fine-tuning was worth the cost.

### Suggested Project Structure

```text
13-Fine-Tuning-and-Open-Models/
├── README.md
├── requirements.txt
├── .env.example
├── data/
│   ├── train.jsonl
│   ├── validation.jsonl
│   └── test.jsonl
├── src/
│   ├── prepare_dataset.py
│   ├── train.py
│   ├── evaluate.py
│   └── inference.py
├── configs/
│   └── lora_config.yaml
├── outputs/
│   └── .gitkeep
├── tests/
│   ├── test_dataset.py
│   └── test_output_format.py
└── reports/
    └── baseline_vs_finetuned.md
```

Avoid committing large model weights, private datasets, or training artifacts to GitHub without a clear reason and permission.

### Stretch Goals

1. Compare LoRA and QLoRA.
2. Compare two small open-weight models.
3. Measure trainable parameters and peak GPU memory.
4. Experiment with learning rates and training duration.
5. Compare adapter inference with merged-model inference.
6. Package the inference service with FastAPI.
7. Deploy a model behind an authenticated API.
8. Track experiments and evaluation results with MLflow.

---

# 🎤 14. Interview Questions

**Q1. What is fine-tuning?**

Fine-tuning continues training a pretrained model on task-specific data to adapt its behavior.

**Q2. What is the difference between pretraining and fine-tuning?**

Pretraining teaches broad capabilities from a large corpus. Fine-tuning further adapts an existing model to a particular task, format, or behavior.

**Q3. What is an open-weight model?**

A model whose trained parameters are made available under specified terms. Open weights do not automatically imply an unrestricted or fully open-source license.

**Q4. When should you use RAG instead of fine-tuning?**

RAG is usually a better starting point when answers depend on changing documents, external facts, or sources that must be cited.

**Q5. What is LoRA?**

LoRA adds trainable low-rank adapter matrices to selected model layers while keeping the base weights frozen.

**Q6. What is QLoRA?**

QLoRA combines a quantized base model with trainable LoRA adapters to reduce memory requirements during fine-tuning.

**Q7. What is supervised fine-tuning?**

It trains a model on examples that specify the desired behavior, typically instructions paired with target responses.

**Q8. Why do you need a validation set?**

It helps compare training configurations and detect overfitting without relying exclusively on training loss.

**Q9. Why is a held-out test set important?**

It provides a more independent estimate of how the model performs on unseen examples.

**Q10. Does lower training loss mean a better model?**

No. The model may overfit, learn unwanted patterns, or fail to generalize to real user requests.

**Q11. What is a LoRA adapter?**

A small set of learned parameters that modifies a compatible base model's behavior without storing a complete independently trained copy of that model.

**Q12. Can fine-tuning guarantee factual accuracy?**

No. Fine-tuning can improve task behavior but does not guarantee factual correctness. Use evaluation, retrieval, validation, and other appropriate controls.

---

# ✅ 15. Completion Checklist

- [ ] Understand hosted APIs and open-weight models.
- [ ] Explain when fine-tuning is appropriate.
- [ ] Compare RAG, prompting, and fine-tuning.
- [ ] Prepare a valid instruction dataset.
- [ ] Understand tokenization and chat templates.
- [ ] Explain full fine-tuning, LoRA, and QLoRA.
- [ ] Load a pretrained model with Transformers.
- [ ] Run a small fine-tuning experiment.
- [ ] Save and reload the adapter.
- [ ] Evaluate against a baseline using held-out data.
- [ ] Check licensing, data governance, and hardware constraints.
- [ ] Complete the Domain-Specific Fine-Tuned Assistant.
- [ ] Document real results and limitations.

---

# 💡 16. Key Takeaways

- Fine-tuning adapts an existing model; it is not the same as training from scratch.
- Open-weight models provide more deployment flexibility, subject to their license and technical requirements.
- High-quality, consistent training examples matter more than simply increasing dataset size.
- LoRA and QLoRA can reduce training resource requirements.
- Fine-tuning should be justified through measurable improvement over a baseline.
- RAG is often a better fit for changing facts and document-grounded answers.
- Training loss alone is not enough to establish model quality.
- Data governance, licensing, hardware, and deployment are part of responsible fine-tuning.

---

# ➡️ Next Module

## 14 — Multimodal GenAI

**Planned Date:** August 20, 2026

Next, you will explore AI systems that work with multiple types of information, including text, images, audio, and video.

You will learn multimodal model concepts, vision-language applications, speech processing, and practical approaches to combining different modalities in AI applications.

**Next folder:** `05-Generative-AI/14-Multimodal-GenAI/README.md`
