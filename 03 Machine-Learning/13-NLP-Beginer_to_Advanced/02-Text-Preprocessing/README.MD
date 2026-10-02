# 🧹 02 — Text Preprocessing

**Date:** 26 January 2026
**Folder:** `02-Text-Preprocessing`

---

# 📚 Text Preprocessing

## 🎯 Overview

**Text preprocessing** is the process of cleaning and preparing raw text before converting it into numerical features and applying a machine learning model.

A typical NLP workflow is:

```text
Raw Text
   ↓
Cleaning
   ↓
Normalization
   ↓
Tokenization
   ↓
Optional Stemming / Lemmatization
   ↓
Processed Text
   ↓
Vectorization
```

The goal is **not to remove everything from the text**. The goal is to remove unwanted noise while preserving information that is useful for the task.

---

# 1. Why Preprocess Text?

Real-world text is usually messy.

Example:

```text
"OMG!!! This PRODUCT is AMAZING 😍😍
Visit https://example.com NOW!!!"
```

It contains:

* Uppercase letters
* Repeated punctuation
* Emojis
* URLs
* Extra whitespace
* Mixed formatting

A preprocessing pipeline can transform it into something more consistent:

```text
"this product is amazing"
```

The exact preprocessing depends on the NLP problem.

---

# 2. Lowercasing

Lowercasing converts text to lowercase.

```python
text = "I LOVE Python"

text.lower()
```

Output:

```text
"i love python"
```

### Why?

Without lowercasing:

```text
Python
python
PYTHON
```

could be treated as different tokens.

However, lowercasing can sometimes remove useful information.

For example:

```text
US
us
```

can have different meanings.

Therefore, lowercase only when it makes sense for the task.

---

# 3. Removing HTML

Web data often contains HTML.

Example:

```html
<p>This product is amazing</p>
```

We may want:

```text
This product is amazing
```

Libraries such as **BeautifulSoup** can help remove HTML tags.

```python
from bs4 import BeautifulSoup

text = "<p>Hello world</p>"

clean = BeautifulSoup(text, "html.parser").get_text()

print(clean)
```

---

# 4. Handling URLs

URLs often contain information that is not useful for a basic text classifier.

Example:

```text
"Visit https://example.com for more information"
```

Possible output:

```text
"visit for more information"
```

Alternatively, URLs can be replaced with a special token:

```text
"visit URL for more information"
```

Replacing them can be useful when the **presence of a URL itself is meaningful**, such as spam detection.

---

# 5. Punctuation

Punctuation includes:

```text
. , ! ? ; : " ' ( ) -
```

A basic pipeline may remove punctuation:

```python
import string

text = "Hello, world!"

text = text.translate(
    str.maketrans("", "", string.punctuation)
)
```

Result:

```text
"Hello world"
```

But punctuation can contain information.

For example:

```text
"Great!"
"Great..."
"Great?"
```

may express different intentions or emotions.

So punctuation removal should be **task-dependent**.

---

# 6. Whitespace Cleaning

Raw text can contain unnecessary spaces, tabs, and new lines.

Example:

```text
"Hello     world\n\nPython"
```

A common approach is:

```python
text = " ".join(text.split())
```

Result:

```text
"Hello world Python"
```

This makes the text more consistent.

---

# 7. Numbers

Numbers can be:

* Removed
* Kept
* Replaced with a special token

Example:

```text
"I bought 3 phones for $500"
```

For a general text classifier, numbers might be less important.

For financial, medical, scientific, or product-related NLP, numbers can be extremely important.

Therefore:

> **Never remove numbers automatically without considering the task.**

---

# 8. Emojis and Special Characters

Example:

```text
"This is amazing 😍🔥"
```

Emojis can carry sentiment.

For sentiment analysis:

```text
😍 → positive signal
😡 → negative signal
```

Therefore, removing emojis may reduce useful information.

Depending on the project, emojis can be:

```text
Kept
Removed
Converted to text
Replaced with tokens
```

---

# 9. Tokenization

**Tokenization** breaks text into smaller units called tokens.

Example:

```text
"I love Python"
```

Word tokenization:

```text
["I", "love", "Python"]
```

Sentence tokenization:

```text
["I love Python."]
```

Tokenization is important because many NLP techniques operate on individual tokens.

Common tokenization levels include:

| Type      | Example                   |
| --------- | ------------------------- |
| Word      | `["I", "love", "Python"]` |
| Sentence  | `["I love Python."]`      |
| Character | `["P", "y", "t", ...]`    |
| Subword   | Pieces of words           |

---

# 10. Stop Words

**Stop words** are common words that may carry limited information for some tasks.

Examples:

```text
the
is
a
an
of
to
in
```

For example:

```text
"the laptop is good"
```

could become:

```text
"laptop good"
```

using a stop-word list.

However, stop-word removal can be harmful.

Consider:

```text
"I do not like this."
```

Removing `not` could change the meaning:

```text
"I like this."
```

Therefore:

> **Stop-word removal is optional and task-dependent.**

---

# 11. Stemming

**Stemming** reduces words to a simpler root-like form by applying rules.

Example:

```text
playing
played
plays
```

may become:

```text
play
```

A common algorithm is the **Porter Stemmer**.

```python
from nltk.stem import PorterStemmer

stemmer = PorterStemmer()

words = ["playing", "played", "plays"]

for word in words:
    print(stemmer.stem(word))
```

Stemming is fast but can produce words that are not proper dictionary words.

Example:

```text
studies → studi
```

---

# 12. Lemmatization

**Lemmatization** attempts to convert a word to its proper base or dictionary form.

Example:

```text
better → good
running → run
studies → study
```

Compared with stemming:

| Stemming                     | Lemmatization                |
| ---------------------------- | ---------------------------- |
| Rule-based shortening        | Linguistic normalization     |
| Faster                       | Usually more processing      |
| Can produce invalid words    | Usually produces valid words |
| Less linguistically informed | More linguistically informed |

---

# 13. Normalization

Text normalization makes different forms more consistent.

Examples:

```text
"HELLO" → "hello"
"can't" → "cannot"
"  hello   world  " → "hello world"
```

Other normalization techniques may include:

* Lowercasing
* Whitespace normalization
* Spelling normalization
* Contraction handling
* Unicode normalization

The correct normalization depends on the dataset.

---

# 14. Spelling Errors

Real-world users make spelling mistakes.

Example:

```text
"recieve"
"definately"
"amazng"
```

Possible approaches include:

```text
Dictionary correction
Edit distance
Spell-checking libraries
Domain-specific correction
```

But automatic correction can sometimes change the intended meaning.

Therefore, spelling correction should be used carefully.

---

# 15. Levenshtein Distance

**Levenshtein distance** measures how many single-character operations are required to transform one string into another.

Operations include:

```text
Insertion
Deletion
Substitution
```

Example:

```text
cat → cut
```

Only one substitution is required:

```text
a → u
```

Therefore:

```text
distance = 1
```

It can be useful for:

* Spell correction
* Fuzzy matching
* Duplicate detection
* Search systems

---

# 16. A Practical Preprocessing Pipeline

A simple classical NLP pipeline could be:

```text
Raw Text
   ↓
Remove HTML
   ↓
Handle URLs
   ↓
Normalize whitespace
   ↓
Lowercase
   ↓
Tokenize
   ↓
Optional stop-word removal
   ↓
Optional stemming / lemmatization
   ↓
Clean Tokens
   ↓
TF-IDF / BoW
```

Not every project should use every step.

For example:

```text
Sentiment Analysis
→ Keep negation and emojis

Spam Detection
→ URLs may be useful features

Search
→ Stemming may help match word forms
```

---

# 🧠 Key Takeaways

```text
Raw Text
   ↓
Clean
   ↓
Normalize
   ↓
Tokenize
   ↓
Optional linguistic processing
   ↓
Ready for representation
```

Remember:

> **Good preprocessing removes noise without removing useful information.**

You should now understand:

* Lowercasing
* HTML removal
* URL handling
* Punctuation
* Whitespace
* Numbers
* Emojis
* Tokenization
* Stop words
* Stemming
* Lemmatization
* Normalization
* Spelling errors
* Levenshtein distance
* Task-dependent preprocessing

Next:

```text
03 — Text Representation
```

where we convert processed text into representations that machine-learning algorithms can use.
