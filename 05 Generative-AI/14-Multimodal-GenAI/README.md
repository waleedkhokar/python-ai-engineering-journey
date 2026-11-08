
# 🌐 14 — Multimodal GenAI

> Learn how generative AI works across text, images, audio, and video, and build applications that can understand and generate multiple types of information.

---

## 📅 Learning Schedule

| Detail | Information |
|---|---|
| **Planned Date** | August 20, 2026 |
| **Learning Stage** | Stage 3 — LLM Application Engineering |
| **Difficulty** | Intermediate → Advanced |
| **Primary Language** | Python |
| **Core Technologies** | Multimodal LLM APIs, Vision-Language Models, Audio Models, Transformers |
| **Prerequisites** | LLM Fundamentals, LLM APIs, Prompt Engineering, Structured Outputs |
| **Previous Module** | [13 — Fine-Tuning and Open Models](../13-Fine-Tuning-and-Open-Models/README.md) |
| **Next Module** | [15 — AI Agents Fundamentals](../15-AI-Agents-Fundamentals/README.md) |

### 🎯 Learning Goal

Understand how models process different modalities and build applications that can analyze images, transcribe audio, generate speech, and combine multiple types of input in a single workflow.

---

## 🗺️ Learning Roadmap

```text
                 Multimodal GenAI
                        |
          +-------------+-------------+
          |             |             |
        Text          Images         Audio
          |             |             |
       LLMs       Vision Models    Speech Models
          |             |             |
          +-------------+-------------+
                        |
                  Video + Frames
                        |
                        v
              Multimodal Applications
                        |
                        v
           Evaluation, Safety, Deployment
```

---

## 🎯 1. Learning Objectives

By completing this module, you will be able to:

- Explain multimodal AI and how it differs from text-only LLM applications.
- Identify text, image, audio, video, and combined-modality workflows.
- Understand vision-language models (VLMs).
- Send images to a compatible multimodal model.
- Extract information from screenshots and documents.
- Understand speech-to-text and text-to-speech.
- Explain audio perception, transcription, and speech generation.
- Understand how video can be processed as a sequence of frames and audio.
- Build a multimodal application using model APIs.
- Evaluate outputs for accuracy, reliability, latency, and cost.
- Identify privacy and security risks associated with multimodal inputs.

---

# 🧠 2. What Is Multimodal GenAI?

Traditional text-based LLM applications primarily accept text and generate text.

Multimodal generative AI works with two or more types of information, known as **modalities**.

A modality is a form in which information is represented or processed.

Examples include:

- Text: questions, documents, and instructions.
- Images: photographs, diagrams, screenshots, and scanned documents.
- Audio: speech, music, and environmental sounds.
- Video: sequences of images, often combined with audio.
- Spatial information: coordinates, poses, or structured representations of physical environments.

A multimodal system might accept a photograph and a question, then produce a textual answer. Another system might accept speech, transcribe it, reason about the request, and generate spoken output.

### Example

A user uploads a photograph of a damaged laptop and asks:

> What damage can you see, and what should I check next?

A multimodal model may analyze visible damage and describe possible next steps.

However, it cannot reliably determine hidden internal damage from an image alone. Its answer must distinguish visible evidence from uncertainty.

### Common Multimodal Tasks

| Task | Input | Output |
|---|---|---|
| Image understanding | Image + question | Text answer |
| Document understanding | Document image | Extracted fields |
| Image generation | Text prompt | Image |
| Speech transcription | Audio | Text |
| Speech generation | Text | Audio |
| Audio understanding | Audio | Summary or classification |
| Video understanding | Video or selected frames | Summary or answers |
| Speech assistant | Audio | Spoken response |

Not every model supports every task. Always check the capabilities and input/output requirements of the chosen model.

---

# 🖼️ 3. Image Understanding and Vision-Language Models

A **Vision-Language Model (VLM)** can process visual information and connect it with language.

Depending on its capabilities, it may:

- Describe an image.
- Answer questions about a photograph.
- Read visible text.
- Interpret charts and diagrams.
- Analyze screenshots.
- Extract information from forms.
- Compare visible objects or scenes.

### How Image Understanding Works

A simplified workflow looks like this:

```text
User Question + Image
          |
          v
Image Preprocessing
          |
          v
Visual Representation
          |
          v
Vision-Language Model
          |
          v
Text Answer or Structured Output
```

Image preprocessing may include resizing, cropping, or dividing an image into patches. The exact process depends on the model.

Some systems use a shared multimodal architecture, while others combine specialized components. There is no single architecture used by all multimodal models.

### Image Understanding vs OCR

| OCR | Vision-Language Model |
|---|---|
| Focuses on recognizing text in images | Can interpret visual content and language together |
| Useful for extracting printed or handwritten text, depending on the OCR system | Useful for visual questions, descriptions, and contextual interpretation |
| May return text and coordinates | May return natural-language answers or structured data |
| Does not automatically understand the meaning of a scene | Can reason about visible relationships, but may still make mistakes |

For high-accuracy document processing, combining OCR, layout analysis, schema validation, and a vision-language model may be more reliable than depending on one model alone.

---

# 💻 4. Practical Lab — Analyze an Image with an LLM API

This example uses the OpenAI Python SDK with a vision-capable model. Replace the model ID with one currently available to your account that supports image input.

### Step 1 — Install Dependencies

```bash
pip install openai python-dotenv
```

### Step 2 — Configure Your API Key

Create a `.env` file:

```dotenv
OPENAI_API_KEY=your_api_key_here
```

Add `.env` to `.gitignore`. Never commit API keys to GitHub.

### Step 3 — Analyze an Image

```python
import base64
import mimetypes
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)

MODEL_ID = os.environ.get(
    "VISION_MODEL_ID",
    "gpt-4.1-mini",
)


def encode_image(image_path: str) -> tuple[str, str]:
    path = Path(image_path)

    if not path.is_file():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    mime_type, _ = mimetypes.guess_type(path.name)

    if mime_type not in {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    }:
        raise ValueError(
            "Use a supported image format."
        )

    image_data = base64.b64encode(
        path.read_bytes()
    ).decode("utf-8")

    return image_data, mime_type


def analyze_image(
    image_path: str,
    question: str,
) -> str:
    image_data, mime_type = encode_image(
        image_path
    )

    response = client.chat.completions.create(
        model=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": question,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": (
                                f"data:{mime_type};base64,"
                                f"{image_data}"
                            )
                        },
                    },
                ],
            }
        ],
    )

    return response.choices[0].message.content or ""


answer = analyze_image(
    "sample.jpg",
    "Describe the visible objects and any readable text.",
)

print(answer)
```

The example assumes that the selected model and API endpoint support this image-input format. Confirm current model availability, supported image formats, and request limits before running it.

### Practical Exercises

1. Describe a landscape photograph.
2. Read visible text from a screenshot.
3. Ask questions about a diagram.
4. Extract product details from a photograph.
5. Compare a model's response with manually verified facts.

Record incorrect observations, unsupported assumptions, and unreadable text. A fluent answer is not necessarily an accurate answer.

---

# 📄 5. Multimodal Document Understanding

Many real-world documents contain a mixture of text, images, tables, charts, and visual layouts.

Examples include:

- Invoices.
- Receipts.
- Identity documents.
- Reports.
- Product catalogs.
- Technical manuals.
- Screenshots of business applications.

### Recommended Document Pipeline

```text
Document or Image
        |
        v
File Validation
        |
        v
OCR / Layout Extraction / Vision Model
        |
        v
Structured Information
        |
        v
Schema Validation
        |
        v
Business Rules
        |
        v
Verified Result
```

For a financial invoice, a model might extract:

- Invoice number.
- Supplier name.
- Invoice date.
- Currency.
- Subtotal.
- Tax.
- Total amount.

Use structured outputs and validation to check required fields and types. Validate business rules separately—for example, whether the subtotal plus tax matches the total within the expected rounding tolerance.

Do not assume a model's extraction is correct merely because it returns valid JSON.

### Important Safety Considerations

- Remove unnecessary personal information.
- Avoid sending confidential documents to services that are not approved for that data.
- Validate extracted values before they trigger business operations.
- Require human review for high-impact decisions.
- Treat text found inside documents as untrusted input, not as instructions that override your application's system rules.

---

# 🎙️ 6. Audio AI: Speech-to-Text and Text-to-Speech

Audio-based applications often combine specialized models with application logic.

## 6.1 Speech-to-Text (STT)

Speech-to-text converts spoken language into written text.

Example use cases:

- Meeting transcription.
- Voice notes.
- Customer support recordings.
- Spoken search queries.
- Voice-controlled applications.

A transcription model may also support timestamps, speaker labels, or translation, depending on the service.

## 6.2 Text-to-Speech (TTS)

Text-to-speech converts written text into generated speech.

Example use cases:

- Voice assistants.
- Accessibility features.
- Spoken summaries.
- Language-learning tools.
- Audio versions of documents.

Output quality depends on the model, language, pronunciation, voice, and synthesis settings.

## 6.3 Audio Understanding

Audio understanding can go beyond transcription.

Depending on model capabilities, a system may classify sounds, summarize recordings, identify speech characteristics, or answer questions about audio.

### Audio Pipeline

```text
Audio Input
     |
     v
Transcription or Audio Perception
     |
     v
LLM Processing
     |
     v
Text Response
     |
     v
Optional Text-to-Speech
     |
     v
Audio Output
```

This is one common design, not a requirement for every system. Some models process audio directly without a separate transcription stage.

---

# 💻 7. Practical Lab — Transcribe an Audio File

The following example uses a transcription endpoint available through a compatible OpenAI API account.

```python
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)


def transcribe_audio(
    audio_path: str,
) -> str:
    path = Path(audio_path)

    if not path.is_file():
        raise FileNotFoundError(
            f"Audio file not found: {audio_path}"
        )

    with path.open("rb") as audio_file:
        result = client.audio.transcriptions.create(
            model=os.environ.get(
                "TRANSCRIPTION_MODEL_ID",
                "gpt-4o-mini-transcribe",
            ),
            file=audio_file,
        )

    return result.text


transcript = transcribe_audio(
    "meeting.mp3"
)

print(transcript)
```

Model IDs, accepted audio formats, and file-size limits can change. Check the provider's current API documentation and use a model available to your account.

### Exercises

- Transcribe a short recording.
- Compare the result with the actual spoken words.
- Test background noise and different accents.
- Identify names, numbers, and technical terms that were transcribed incorrectly.
- Add a review step before using the transcript in an important workflow.

---

# 🔊 8. Practical Lab — Generate Speech from Text

The following example demonstrates a text-to-speech API workflow. Use a voice and model supported by your provider.

```python
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"]
)


def generate_speech(
    text: str,
    output_path: str = "speech.mp3",
) -> Path:
    if not text.strip():
        raise ValueError(
            "Text cannot be empty."
        )

    path = Path(output_path)
    path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with client.audio.speech.with_streaming_response.create(
        model=os.environ.get(
            "TTS_MODEL_ID",
            "gpt-4o-mini-tts",
        ),
        voice="alloy",
        input=text,
        response_format="mp3",
    ) as response:
        response.stream_to_file(path)

    return path


saved_file = generate_speech(
    "Welcome to the world of multimodal AI."
)

print(f"Saved audio to: {saved_file}")
```

The voice and model shown are examples; check current availability and supported parameters.

### Key Learning Points

- Speech generation is different from speech recognition.
- Audio output has its own format, latency, and quality considerations.
- Streaming can improve perceived response time.
- User consent, voice rights, and transparency matter when generating realistic speech.
- Never use generated speech to impersonate someone deceptively.

---

# 🎬 9. Video Understanding

Video combines a sequence of visual frames over time and may include audio.

A video-understanding system can use selected frames, audio transcription, timestamps, or a model specifically designed to process video.

### Example Pipeline

```text
Video File
    |
    +-------------------+
    |                   |
    v                   v
Extract Frames      Extract Audio
    |                   |
    v                   v
Visual Analysis     Speech Transcription
    |                   |
    +---------+---------+
              |
              v
      Combine Evidence
              |
              v
       Video Summary
```

Not every video model requires this exact pipeline. Some systems can process video inputs through a provider-specific API.

### Why Frame Selection Matters

A long video may contain thousands of frames. Processing every frame can increase cost and latency.

Possible strategies include:

- Sample frames at fixed intervals.
- Select frames when a scene changes.
- Extract frames around known timestamps.
- Use video-specific models when available.
- Analyze audio separately when speech or sound matters.

Sampling can miss important short events. Choose a strategy based on the task rather than assuming a few frames represent the entire video.

### Exercise

Design a system that summarizes a five-minute meeting recording.

Your system should:

1. Extract or process the relevant audio.
2. Transcribe speech when needed.
3. Identify important visual events or presentation slides.
4. Combine evidence with timestamps.
5. Produce a summary that distinguishes observed facts from uncertain interpretations.

---

# 🧬 10. Multimodal Embeddings and Shared Representations

Some models can map different modalities into compatible representation spaces.

For example, an image and a text description may be represented as vectors that can be compared for semantic similarity.

This enables applications such as:

- Text-to-image retrieval.
- Image-to-image similarity search.
- Cross-modal search.
- Visual product discovery.
- Searching a media library with natural-language queries.

### Example

A user searches for:

> a red car parked beside a lake

An image-retrieval system can encode the query and candidate images into compatible embeddings, then rank images by similarity.

The results depend on the embedding model and the data. Similarity scores are not guaranteed probabilities of correctness.

### Key Distinction

A multimodal embedding model and a multimodal generative model are not necessarily the same thing.

- **Embedding model:** produces representations useful for similarity, retrieval, or downstream tasks.
- **Generative model:** generates content or responses.
- **Vision-language model:** processes visual information alongside language, often for understanding and answering questions.

Some systems combine these capabilities, but you should verify what each model actually supports.

---

# 🏗️ 11. Build a Multimodal AI Application

A practical multimodal application should separate user input, model processing, validation, and output handling.

### Suggested Architecture

```text
Web / Mobile Client
        |
        v
FastAPI Backend
        |
        v
Input Validation
        |
        +-------------------------+
        |                         |
        v                         v
Image Processing             Audio Processing
        |                         |
        v                         v
Vision Model                 Speech Model
        |                         |
        +------------+------------+
                     |
                     v
               LLM Processing
                     |
                     v
           Structured Output Validation
                     |
                     v
               API Response
```

This is a conceptual architecture. Depending on the application, audio or image processing may happen directly in a multimodal model instead of in separate services.

### Suggested API Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /analyze-image` | Answer questions about an uploaded image |
| `POST /transcribe-audio` | Convert audio into text |
| `POST /generate-speech` | Generate speech from text |
| `POST /analyze-document` | Extract structured information from a document |
| `POST /summarize-media` | Summarize supported audio or video inputs |

### Engineering Requirements

- Validate file type, size, and content.
- Do not trust filename extensions alone.
- Use authentication and authorization.
- Set request timeouts and upload limits.
- Handle provider failures and rate limits.
- Avoid logging sensitive file contents.
- Track latency, errors, and usage cost.
- Validate generated structured data.
- Store uploaded files only when necessary.
- Define retention and deletion policies.

---

# 📊 12. Evaluate Multimodal Systems

Multimodal evaluation should reflect the actual task rather than relying on a general-purpose model score.

| Task | Useful Evaluation Methods |
|---|---|
| Image question answering | Correctness, groundedness, human review |
| OCR and document extraction | Character error rate, field-level accuracy |
| Speech transcription | Word error rate, review of names and numbers |
| Speech generation | Intelligibility, pronunciation, latency, human preference |
| Image retrieval | Recall@k, Precision@k, ranking quality |
| Video summarization | Coverage, factual accuracy, timestamp correctness |
| Structured extraction | Schema validity and field-level correctness |

### Evaluation Process

1. Create a representative test dataset.
2. Include difficult examples and edge cases.
3. Define expected outputs or evaluation rubrics.
4. Run the same examples through candidate systems.
5. Inspect errors by type.
6. Measure latency, resource usage, and cost.
7. Repeat evaluations after changing models or prompts.

For high-impact applications, automated metrics should be supplemented with expert or human review.

---

# 🔐 13. Safety, Privacy, and Reliability

Multimodal systems introduce risks beyond text-only applications.

### Privacy

Images and recordings may contain faces, personal documents, addresses, confidential conversations, or other sensitive information.

Only collect and process data that the application is authorized to use.

### Prompt Injection in Images and Documents

An uploaded screenshot or document might contain text instructing the model to ignore previous instructions or reveal confidential information.

Treat this text as untrusted content. It must not override trusted system instructions, application policies, or access controls.

### Model Hallucinations

A model may:

- Describe objects that are not present.
- Misread a number.
- Invent text in a blurry screenshot.
- Misidentify a person or object.
- Miss an event in a video.
- Produce inaccurate speech transcriptions.

Require verification where mistakes matter.

### File and API Security

- Check upload limits and allowed file formats.
- Protect API keys.
- Avoid arbitrary remote file fetching.
- Scan or safely process untrusted files where appropriate.
- Prevent unauthorized access to uploaded media.
- Use human review for sensitive or consequential decisions.

---

# 🚀 14. Final Project — Multimodal Document and Media Assistant

## Project Goal

Build an application that accepts multiple types of input and produces a useful, validated response.

### Core Features

- [ ] Upload an image and ask questions about it.
- [ ] Extract structured fields from a sample document.
- [ ] Transcribe a short audio recording.
- [ ] Generate speech from a text response.
- [ ] Return structured responses from the backend.
- [ ] Validate file types and upload sizes.
- [ ] Handle API failures and invalid inputs.
- [ ] Record latency and approximate request cost.
- [ ] Evaluate outputs against manually checked examples.
- [ ] Document limitations and privacy protections.

### Suggested Project Structure

```text
99-Projects/
└── 14-Multimodal-AI-Assistant/
    ├── README.md
    ├── requirements.txt
    ├── .env.example
    ├── app/
    │   ├── main.py
    │   ├── image_service.py
    │   ├── audio_service.py
    │   ├── document_service.py
    │   ├── schemas.py
    │   └── config.py
    ├── tests/
    │   ├── test_schemas.py
    │   └── test_file_validation.py
    └── evaluation/
        ├── test_cases.jsonl
        └── results.md
```

### Stretch Goals

1. Add a web interface using Next.js and TypeScript.
2. Add a retrieval system for document collections.
3. Add multimodal semantic search.
4. Support timestamps in audio or video summaries.
5. Use a queue for long-running media-processing jobs.
6. Add caching where appropriate.
7. Compare two models using the same evaluation dataset.
8. Deploy the application with authentication, monitoring, and usage limits.

---

# 🎤 15. Interview Questions

**Q1. What is multimodal AI?**

AI that processes or generates information across multiple modalities, such as text, images, audio, and video.

**Q2. What is a vision-language model?**

A model that combines visual processing with language capabilities to perform tasks such as image question answering and visual description.

**Q3. What is the difference between OCR and image understanding?**

OCR focuses on recognizing text in images. Image understanding can also interpret objects, scenes, relationships, and visual context.

**Q4. What is speech-to-text?**

A task that converts spoken audio into written text.

**Q5. What is text-to-speech?**

A task that generates spoken audio from text.

**Q6. How can video be processed by an AI application?**

It may use selected frames, audio transcription, timestamps, or a model designed to process video directly.

**Q7. What are multimodal embeddings?**

Numerical representations of information from different modalities that can support similarity search or cross-modal retrieval.

**Q8. Why is multimodal evaluation difficult?**

Correctness may depend on visual details, speech recognition, temporal events, context, and subjective qualities that a single metric cannot capture.

**Q9. What is a key security risk in multimodal AI?**

Untrusted instructions embedded in images, documents, or audio may influence model behavior. Application-level authorization and trusted instructions must remain in control.

**Q10. How would you design a production multimodal API?**

Validate inputs, authenticate users, call the appropriate model services, validate outputs, handle failures, protect private media, and monitor latency, cost, and quality.

---

# ✅ 16. Completion Checklist

- [ ] Explain multimodal GenAI and its main modalities.
- [ ] Understand vision-language models.
- [ ] Analyze an image using a model API.
- [ ] Understand OCR and document extraction.
- [ ] Transcribe audio into text.
- [ ] Generate speech from text.
- [ ] Explain basic video-processing strategies.
- [ ] Understand multimodal embeddings.
- [ ] Design a multimodal backend architecture.
- [ ] Evaluate quality, latency, and cost.
- [ ] Apply file validation and privacy controls.
- [ ] Complete the Multimodal AI Assistant project.

---

# 💡 17. Key Takeaways

- Multimodal AI works with more than one type of information.
- Vision-language models connect image understanding with language.
- Speech-to-text and text-to-speech solve different problems.
- Video processing may require both temporal visual information and audio.
- Multimodal embeddings enable similarity search across compatible representations.
- Model capabilities, file formats, and API requirements vary.
- Valid outputs are not necessarily correct outputs.
- Security, privacy, evaluation, and input validation are essential engineering responsibilities.

---


## What's Next?

You have completed the core Generative AI learning path through multimodal AI.

The next stages are covered in separate learning tracks to avoid repeating content and to provide deeper, project-based engineering practice.

### Next Learning Tracks

1. **06 — AI Agents and Automation**
   Learn to build AI agents using tools, memory, state, agent frameworks, and practical automation projects.

2. **07 — Agentic AI Engineering**
   Learn to design reliable agentic workflows, orchestrate complex tasks, build multi-agent systems, and deploy production-ready solutions.

### Learning Path

Generative AI
    ↓
AI Agents and Automation
    ↓
Agentic AI Engineering
    ↓
Production AI Systems

Each track builds on the previous one while covering a distinct set of engineering skills.
