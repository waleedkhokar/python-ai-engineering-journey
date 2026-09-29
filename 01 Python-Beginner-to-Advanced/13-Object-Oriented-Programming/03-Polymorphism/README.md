# 📘 Class 15: OOP — Polymorphism

> **Date: January 17, 2024** 🎯
>
> Day 15 of my Python journey — learning **Polymorphism** in Object-Oriented Programming.

---

## 🎯 What I Learned in Class 15

* What Polymorphism means
* Why polymorphism is useful
* Same method name, different behavior
* Polymorphism with different classes
* Method overriding
* Polymorphism through inheritance
* Polymorphism with functions
* Polymorphism with objects
* Duck typing
* Built-in polymorphism
* Polymorphism with operators
* Operator overloading
* Common special/magic methods
* Polymorphism with abstract classes
* Polymorphism with lists and loops
* Real-world examples
* Polymorphism vs inheritance
* When to use polymorphism

---

# 📖 What is Polymorphism?

### **Definition**

**Polymorphism** means **"many forms."**

In Python, polymorphism allows the **same method, function, or operation** to behave differently depending on the object being used.

### Simple idea:

> **One interface → many behaviors**

For example, different animals can have the same `sound()` method, but each animal makes a different sound.

```python
class Dog:
    def sound(self):
        print("Dog barks")


class Cat:
    def sound(self):
        print("Cat meows")


dog = Dog()
cat = Cat()

dog.sound()
cat.sound()
```

**Output:**

```text
Dog barks
Cat meows
```

Both objects use:

```python
sound()
```

But the behavior is different.

---

# 🤔 Why Does Polymorphism Matter?

Polymorphism helps us write code that is:

* ✅ Flexible
* ✅ Reusable
* ✅ Easier to maintain
* ✅ Easier to extend
* ✅ Less dependent on specific classes
* ✅ Better suited for large applications

Instead of writing separate logic for every class, we can work with a common method or interface.

---

# 💻 1. Same Method Name, Different Classes

Different classes can have the same method name.

```python
class Dog:
    def speak(self):
        print("Dog says: Woof")


class Cat:
    def speak(self):
        print("Cat says: Meow")


class Cow:
    def speak(self):
        print("Cow says: Moo")


dog = Dog()
cat = Cat()
cow = Cow()

dog.speak()
cat.speak()
cow.speak()
```

**Output:**

```text
Dog says: Woof
Cat says: Meow
Cow says: Moo
```

### Key idea

The method name is the same:

```python
speak()
```

But each class provides different behavior.

---

# 💻 2. Polymorphism with a Function

A function can work with different objects if they provide the required method.

```python
class Dog:
    def speak(self):
        print("Woof")


class Cat:
    def speak(self):
        print("Meow")


def make_sound(animal):
    animal.speak()


dog = Dog()
cat = Cat()

make_sound(dog)
make_sound(cat)
```

**Output:**

```text
Woof
Meow
```

The function does not need to know whether the object is a `Dog` or `Cat`.

It simply expects the object to have:

```python
speak()
```

---

# 💻 3. Polymorphism with a List

Polymorphism becomes especially useful when different objects are stored together.

```python
class Dog:
    def speak(self):
        print("Dog: Woof")


class Cat:
    def speak(self):
        print("Cat: Meow")


class Cow:
    def speak(self):
        print("Cow: Moo")


animals = [Dog(), Cat(), Cow()]

for animal in animals:
    animal.speak()
```

**Output:**

```text
Dog: Woof
Cat: Meow
Cow: Moo
```

### Why is this useful?

We don't need:

```python
if animal is Dog:
    ...
elif animal is Cat:
    ...
elif animal is Cow:
    ...
```

We simply call:

```python
animal.speak()
```

Each object handles its own behavior.

---

# 🧬 4. Polymorphism Through Inheritance

Polymorphism is commonly used with inheritance.

A parent class defines a method, and child classes provide their own implementations.

```python
class Animal:
    def sound(self):
        print("Animal makes a sound")


class Dog(Animal):
    def sound(self):
        print("Dog barks")


class Cat(Animal):
    def sound(self):
        print("Cat meows")


dog = Dog()
cat = Cat()

dog.sound()
cat.sound()
```

**Output:**

```text
Dog barks
Cat meows
```

The parent provides:

```python
sound()
```

The children override it with their own behavior.

---

# 🔄 5. Method Overriding

**Method overriding** happens when a child class provides its own version of a method already defined in the parent class.

```python
class Animal:
    def sound(self):
        print("Animal makes a sound")


class Dog(Animal):
    def sound(self):
        print("Dog barks")


animal = Animal()
dog = Dog()

animal.sound()
dog.sound()
```

**Output:**

```text
Animal makes a sound
Dog barks
```

The method name is the same:

```python
sound()
```

But the behavior depends on the object.

---

# 🛠️ 6. Using `super()` with Polymorphism

A child class can also call the parent's implementation using `super()`.

```python
class Animal:
    def sound(self):
        print("Animal makes a sound")


class Dog(Animal):
    def sound(self):
        super().sound()
        print("Dog barks")


dog = Dog()
dog.sound()
```

**Output:**

```text
Animal makes a sound
Dog barks
```

Here, the child extends the parent's behavior instead of completely replacing it.

---

# 🦆 7. Duck Typing

Python uses a concept called **Duck Typing**.

The idea is:

> If an object behaves like the required object, Python can use it.

Python generally cares about **what an object can do**, rather than only what class it belongs to.

```python
class Dog:
    def speak(self):
        print("Woof")


class Robot:
    def speak(self):
        print("Hello from robot")


def make_sound(obj):
    obj.speak()


dog = Dog()
robot = Robot()

make_sound(dog)
make_sound(robot)
```

**Output:**

```text
Woof
Hello from robot
```

`Dog` and `Robot` have no inheritance relationship.

They simply provide the same method:

```python
speak()
```

This is an important Python style of polymorphism.

---

# 🧠 8. Duck Typing Example

Consider a payment system.

```python
class CreditCard:
    def pay(self):
        print("Payment made using credit card")


class PayPal:
    def pay(self):
        print("Payment made using PayPal")


class BankTransfer:
    def pay(self):
        print("Payment made using bank transfer")


def process_payment(payment_method):
    payment_method.pay()


process_payment(CreditCard())
process_payment(PayPal())
process_payment(BankTransfer())
```

**Output:**

```text
Payment made using credit card
Payment made using PayPal
Payment made using bank transfer
```

The function does not care about the exact class.

It only needs:

```python
pay()
```

---

# 🐍 9. Built-in Polymorphism

Python's built-in functions can also work with different types.

For example:

```python
print(len("Python"))
print(len([10, 20, 30]))
print(len((1, 2, 3, 4)))
```

**Output:**

```text
6
3
4
```

The same function:

```python
len()
```

works with different objects.

### Why?

Different objects provide their own way of determining their length.

---

# ➕ 10. Polymorphism with Operators

Python operators can behave differently depending on the data type.

For example:

```python
print(10 + 20)
print("Hello " + "Waleed")
print([1, 2] + [3, 4])
```

**Output:**

```text
30
Hello Waleed
[1, 2, 3, 4]
```

The same operator:

```python
+
```

has different behavior.

| Expression            | Behavior             |
| --------------------- | -------------------- |
| `10 + 20`             | Addition             |
| `"Hello " + "Waleed"` | String concatenation |
| `[1, 2] + [3, 4]`     | List concatenation   |

---

# ⚙️ 11. Operator Overloading

Python allows classes to define how operators work with their objects.

This is called **operator overloading**.

For example, we can define how `+` works for our own class.

```python
class Number:
    def __init__(self, value):
        self.value = value

    def __add__(self, other):
        return Number(self.value + other.value)


num1 = Number(10)
num2 = Number(20)

result = num1 + num2

print(result.value)
```

**Output:**

```text
30
```

Here:

```python
num1 + num2
```

internally uses:

```python
__add__()
```

---

# 🪄 12. Magic Methods and Polymorphism

Magic methods allow Python objects to work with built-in operations.

Some important examples:

| Magic Method | Operation             |
| ------------ | --------------------- |
| `__init__()` | Object creation       |
| `__str__()`  | String representation |
| `__add__()`  | `+`                   |
| `__sub__()`  | `-`                   |
| `__mul__()`  | `*`                   |
| `__eq__()`   | `==`                  |
| `__lt__()`   | `<`                   |
| `__gt__()`   | `>`                   |
| `__len__()`  | `len()`               |

Example:

```python
class Student:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Student: {self.name}"


student = Student("Waleed")

print(student)
```

**Output:**

```text
Student: Waleed
```

---

# 🏗️ 13. Polymorphism with Abstract Classes

Abstract classes can define a common interface for child classes.

```python
from abc import ABC, abstractmethod


class Animal(ABC):

    @abstractmethod
    def sound(self):
        pass


class Dog(Animal):
    def sound(self):
        print("Dog barks")


class Cat(Animal):
    def sound(self):
        print("Cat meows")


animals = [Dog(), Cat()]

for animal in animals:
    animal.sound()
```

**Output:**

```text
Dog barks
Cat meows
```

The abstract class says:

> Every child class must provide a `sound()` method.

Each child implements it differently.

---

# 📦 14. Real-World Payment Example

Polymorphism is very useful in real software systems.

```python
class Payment:
    def pay(self, amount):
        pass


class CreditCard(Payment):
    def pay(self, amount):
        print(f"Paid {amount} using Credit Card")


class PayPal(Payment):
    def pay(self, amount):
        print(f"Paid {amount} using PayPal")


class BankTransfer(Payment):
    def pay(self, amount):
        print(f"Paid {amount} using Bank Transfer")


payments = [
    CreditCard(),
    PayPal(),
    BankTransfer()
]

for payment in payments:
    payment.pay(5000)
```

**Output:**

```text
Paid 5000 using Credit Card
Paid 5000 using PayPal
Paid 5000 using Bank Transfer
```

The application can process different payment methods through the same interface:

```python
pay()
```

---

# 👨‍💻 15. Real-World Employee Example

```python
class Employee:
    def work(self):
        print("Employee is working")


class Developer(Employee):
    def work(self):
        print("Developer is writing code")


class Designer(Employee):
    def work(self):
        print("Designer is creating designs")


class Manager(Employee):
    def work(self):
        print("Manager is managing the team")


employees = [
    Developer(),
    Designer(),
    Manager()
]

for employee in employees:
    employee.work()
```

**Output:**

```text
Developer is writing code
Designer is creating designs
Manager is managing the team
```

The same:

```python
work()
```

produces different behavior.

---

# 🤖 16. Polymorphism in AI Applications

Polymorphism is also useful in AI and software engineering.

For example, different AI models could provide the same interface:

```python
class AIModel:
    def generate(self, prompt):
        pass


class GeminiModel(AIModel):
    def generate(self, prompt):
        print("Generating response using Gemini")


class GPTModel(AIModel):
    def generate(self, prompt):
        print("Generating response using GPT")


class LocalModel(AIModel):
    def generate(self, prompt):
        print("Generating response using local model")


models = [
    GeminiModel(),
    GPTModel(),
    LocalModel()
]

for model in models:
    model.generate("Explain Python")
```

**Output:**

```text
Generating response using Gemini
Generating response using GPT
Generating response using local model
```

The application can use:

```python
model.generate()
```

without needing completely different code for every model.

---

# 🔍 17. Polymorphism with `isinstance()`

We can check whether an object belongs to a class.

```python
class Animal:
    pass


class Dog(Animal):
    pass


dog = Dog()

print(isinstance(dog, Dog))
print(isinstance(dog, Animal))
```

**Output:**

```text
True
True
```

Because `Dog` inherits from `Animal`.

---

# 🔍 18. Polymorphism with `issubclass()`

`issubclass()` checks whether one class inherits from another.

```python
class Animal:
    pass


class Dog(Animal):
    pass


print(issubclass(Dog, Animal))
print(issubclass(Animal, Dog))
```

**Output:**

```text
True
False
```

---

# 🆚 19. Polymorphism vs Method Overriding

These concepts are related but not exactly the same.

| Concept               | Meaning                                                 |
| --------------------- | ------------------------------------------------------- |
| **Polymorphism**      | Same interface can have different behaviors             |
| **Method Overriding** | Child class provides its own version of a parent method |
| **Inheritance**       | Child class receives features from parent               |
| **Duck Typing**       | Objects can be used based on behavior                   |

### Simple relationship:

```text
Inheritance
     ↓
Method Overriding
     ↓
Polymorphic Behavior
```

But Python polymorphism can also happen **without inheritance**, especially through duck typing.

---

# 🆚 20. Polymorphism vs Inheritance

| Inheritance                       | Polymorphism                                         |
| --------------------------------- | ---------------------------------------------------- |
| Reuses code from another class    | Allows different behavior through a common interface |
| Represents an `is-a` relationship | Focuses on interchangeable behavior                  |
| Creates parent-child relationship | Does not always require inheritance                  |
| Example: `Dog(Animal)`            | Example: `dog.sound()` and `cat.sound()`             |

---

# 🧩 21. Polymorphism Without Inheritance

Python does not require inheritance for polymorphism.

```python
class Dog:
    def speak(self):
        print("Woof")


class Cat:
    def speak(self):
        print("Meow")


class Robot:
    def speak(self):
        print("Hello")


def speak_now(obj):
    obj.speak()


objects = [Dog(), Cat(), Robot()]

for obj in objects:
    speak_now(obj)
```

**Output:**

```text
Woof
Meow
Hello
```

This is a good example of **duck typing**.

---

# 🛠️ Common Polymorphism Patterns

| Pattern               | Purpose                                      | Example           |
| --------------------- | -------------------------------------------- | ----------------- |
| Method overriding     | Child changes parent behavior                | `Dog.sound()`     |
| Common interface      | Different classes provide same method        | `pay()`           |
| Duck typing           | Use objects based on behavior                | `obj.speak()`     |
| Function polymorphism | One function handles different objects       | `make_sound()`    |
| Operator overloading  | Customize operators                          | `__add__()`       |
| Built-in polymorphism | Built-in function works with different types | `len()`           |
| Abstract interface    | Force child classes to implement methods     | `@abstractmethod` |

---

# 🎬 Real-World Example — Notification System

Imagine an application that supports multiple notification methods.

```python
class EmailNotification:
    def send(self, message):
        print(f"Email: {message}")


class SMSNotification:
    def send(self, message):
        print(f"SMS: {message}")


class PushNotification:
    def send(self, message):
        print(f"Push Notification: {message}")


def send_notification(notification, message):
    notification.send(message)


email = EmailNotification()
sms = SMSNotification()
push = PushNotification()

send_notification(email, "Your order has shipped")
send_notification(sms, "Your order has shipped")
send_notification(push, "Your order has shipped")
```

**Output:**

```text
Email: Your order has shipped
SMS: Your order has shipped
Push Notification: Your order has shipped
```

The function:

```python
send_notification()
```

doesn't need separate logic for every notification type.

It only expects:

```python
notification.send()
```

This is the practical power of polymorphism.

---

# 🧠 Important Terms

| Term                     | Simple Meaning                         |
| ------------------------ | -------------------------------------- |
| **Polymorphism**         | One interface, many behaviors          |
| **Method Overriding**    | Child changes parent's method behavior |
| **Duck Typing**          | Behavior matters more than exact class |
| **Operator Overloading** | Defining operators for custom objects  |
| **Magic Method**         | Special method such as `__add__()`     |
| **Interface**            | Common set of methods/behavior         |
| **Abstract Class**       | Class that defines required behavior   |
| **`isinstance()`**       | Checks an object's type                |
| **`issubclass()`**       | Checks class inheritance               |

---

# 🎓 Key Takeaways

* ✅ Polymorphism means **many forms**.
* ✅ The same method can have different behavior.
* ✅ Different classes can provide the same method.
* ✅ Method overriding is a common form of polymorphism.
* ✅ Polymorphism can work through inheritance.
* ✅ Python also supports polymorphism through duck typing.
* ✅ Different objects can be stored in the same list and processed with the same method.
* ✅ Built-in functions such as `len()` demonstrate polymorphic behavior.
* ✅ Operators such as `+` can behave differently for different types.
* ✅ Operator overloading lets us customize operators for our classes.
* ✅ Abstract classes can define a common interface.
* ✅ Polymorphism makes applications easier to extend.
* ✅ Real systems such as payment and notification systems can use polymorphism.
* ✅ **One interface → many implementations** is the core idea.

---

# 📝 Practice Exercises

## 🟢 Beginner

### 1. Animal Sounds

Create:

* `Dog`
* `Cat`
* `Cow`

Give all classes a:

```python
sound()
```

method.

---

### 2. Shape Area

Create:

* `Circle`
* `Rectangle`
* `Triangle`

Each class should have:

```python
area()
```

---

### 3. Different Greetings

Create:

* `English`
* `Urdu`
* `Arabic`

Each class should have:

```python
greet()
```

---

### 4. Employee Work

Create:

* `Developer`
* `Designer`
* `Manager`

Each class should have:

```python
work()
```

---

## 🟡 Intermediate

### 5. Payment System

Create:

* `CreditCard`
* `PayPal`
* `BankTransfer`

Each should implement:

```python
pay(amount)
```

Then process all payment methods using one function.

---

### 6. Notification System

Create:

* `Email`
* `SMS`
* `PushNotification`

Each should implement:

```python
send(message)
```

---

### 7. Polymorphism with Lists

Create different animal objects and store them inside one list.

Loop through them and call:

```python
sound()
```

---

### 8. Method Overriding

Create:

```text
Animal
   ↓
Dog
   ↓
sound()
```

Override the parent's `sound()` method.

---

## 🔴 Advanced

### 9. Abstract Shape System

Create an abstract class:

```python
Shape
```

with:

```python
area()
```

Then create:

* `Circle`
* `Rectangle`
* `Triangle`

---

### 10. Operator Overloading

Create a `Vector` class and implement:

```python
__add__()
```

so that:

```python
vector1 + vector2
```

works.

---

### 11. AI Model System

Create:

```text
AIModel
├── GPTModel
├── GeminiModel
└── LocalModel
```

Every model should implement:

```python
generate(prompt)
```

Then process all models through one loop.

---

### 12. Real-World E-Commerce System

Create different payment classes and notification classes.

Build a system where the application can change payment or notification providers without changing the main business logic.

---

# 📂 Files in This Folder

```text
03-Polymorphism/
├── README.md
└── class15.ipynb
```

| File            | Purpose                        |
| --------------- | ------------------------------ |
| `class15.ipynb` | My Class 15 Python notebook    |
| `README.md`     | Complete guide to Polymorphism |

---

# 🔗 Navigation

* **Previous:** [14-Inheritance](../02-Inheritance/)
* **Next:** [16-Encapsulation](../04-Encapsulation/)
* **Main:** [Python Complete Journey](../../README.md)

---

# 💡 Pro Tip

> **Don't think of polymorphism as "many complicated classes." Think of it as: "I want to call the same method, but let each object decide how it behaves."**

### Remember:

```text
Same Interface
      ↓
Different Objects
      ↓
Different Behavior
      ↓
Polymorphism
```

---

**📅 Date:** January 17, 2024
**🎯 Goal:** AI Engineer
**📚 Topic:** OOP — Polymorphism
**⭐ Star this repo if it helps you!**

*"One interface, many behaviors — that's the power of polymorphism."*
