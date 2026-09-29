# 📘 Class 13: OOP — Classes and Objects

> **Date: January 15, 2024** 🎯
>
> Class 13 of my Python journey — learning how to create classes and objects in Python.

---

## 🎯 What I Learned

* What Object-Oriented Programming (OOP) is.
* What classes and objects are.
* How to create a class in Python.
* How to create objects from a class.
* How to use the `__init__()` constructor.
* How to use `self` to access object data.
* How to create attributes and methods.
* How to work with multiple objects.

---

## 📖 What is Object-Oriented Programming (OOP)?

**OOP** is a way of writing code by using classes and objects.

It helps us organize code by keeping data and functions together.

### Why is OOP useful?

* Makes code easier to organize.
* Helps us reuse code.
* Makes large projects easier to manage.
* Keeps related data and functions together.

---

## 🏗️ What is a Class?

A **class** is a blueprint for creating objects.

It defines what data and actions an object can have.

### Example

```python
class Student:
    name = "Waleed"
    age = 23
```

Here:

* `Student` is the class name.
* `name` and `age` are attributes.
* The class describes the data a student object can have.

---

## 📦 What is an Object?

An **object** is something created from a class.

A class is like a blueprint, and an object is the actual thing created from it.

### Example

```python
class Student:
    name = "Waleed"
    age = 23

student1 = Student()

print(student1.name)
print(student1.age)
```

**Output:**

```text
Waleed
23
```

### Explanation

* `student1` is an object of the `Student` class.
* We use the dot (`.`) to access its attributes.

---

## 💻 1. Creating a Class and an Object

```python
class Car:
    brand = "Toyota"
    color = "White"

car1 = Car()

print(car1.brand)
print(car1.color)
```

**Output:**

```text
Toyota
White
```

### Explanation

* `Car` is the class.
* `car1` is the object.
* `brand` and `color` are attributes.

---

## 💻 2. What is the `__init__()` Constructor?

The `__init__()` method runs automatically when we create an object.

It is commonly used to set the starting values of an object.

### Example

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

student1 = Student("Waleed", 23)

print(student1.name)
print(student1.age)
```

**Output:**

```text
Waleed
23
```

### Explanation

* `__init__()` sets the object's starting data.
* `name` and `age` are values passed when creating the object.
* `self.name` and `self.age` store those values in the object.

---

## 💻 3. What is `self`?

`self` refers to the current object.

We use it to access the object's attributes and methods.

### Example

```python
class Student:
    def __init__(self, name):
        self.name = name

    def show_name(self):
        print(self.name)

student1 = Student("Waleed")
student1.show_name()
```

**Output:**

```text
Waleed
```

### Explanation

* `self.name` refers to the name stored in the current object.
* `show_name()` is a method.
* When we call `student1.show_name()`, Python passes `student1` as `self`.

---

## 💻 4. What are Attributes?

**Attributes** are variables that store information about an object.

### Example

```python
class Student:
    def __init__(self, name, age, city):
        self.name = name
        self.age = age
        self.city = city

student1 = Student("Waleed", 23, "Rawalakot")

print(student1.name)
print(student1.age)
print(student1.city)
```

**Output:**

```text
Waleed
23
Rawalakot
```

---

## 💻 5. What are Methods?

**Methods** are functions defined inside a class.

They describe what an object can do.

### Example

```python
class Student:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print(f"My name is {self.name}")

student1 = Student("Waleed")
student1.introduce()
```

**Output:**

```text
My name is Waleed
```

---

## 💻 6. Working with Multiple Objects

We can create many objects from the same class.

Each object can have its own data.

### Example

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

student1 = Student("Waleed", 23)
student2 = Student("Ali", 22)
student3 = Student("Ahmed", 24)

print(student1.name, student1.age)
print(student2.name, student2.age)
print(student3.name, student3.age)
```

**Output:**

```text
Waleed 23
Ali 22
Ahmed 24
```

### Explanation

Each student object stores its own name and age.

---

## 🎬 Real-World Example: Bank Account

A bank account has information such as the account holder's name and balance.

It also has actions such as depositing and withdrawing money.

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited: {amount}")

    def show_balance(self):
        print(f"Balance: {self.balance}")

account1 = BankAccount("Waleed", 5000)

account1.deposit(2000)
account1.show_balance()
```

**Output:**

```text
Deposited: 2000
Balance: 7000
```

### Explanation

* `BankAccount` is the class.
* `account1` is the object.
* `owner` and `balance` are attributes.
* `deposit()` and `show_balance()` are methods.

---

## 📊 Class vs Object

| Class                             | Object                                  |
| --------------------------------- | --------------------------------------- |
| A blueprint                       | An actual instance                      |
| Defines attributes and methods    | Uses the class's attributes and methods |
| Example: `Student`                | Example: `student1`                     |
| One class can create many objects | Each object can store its own data      |

---

## 🛠️ Important Terms

| Term         | Simple Meaning                   |
| ------------ | -------------------------------- |
| `class`      | A blueprint for creating objects |
| `object`     | An instance of a class           |
| `__init__()` | Initializes an object            |
| `self`       | Refers to the current object     |
| Attribute    | Data stored in an object         |
| Method       | A function inside a class        |

---

## 🎓 Key Takeaways

* ✅ OOP organizes code using classes and objects.
* ✅ A class is a blueprint for creating objects.
* ✅ An object is created from a class.
* ✅ `__init__()` sets the starting values of an object.
* ✅ `self` refers to the current object.
* ✅ Attributes store data, and methods perform actions.
* ✅ One class can create many objects with different data.

---

## 📝 Practice Exercises

1. Create a `Student` class with `name`, `age`, and `city`.
2. Create a `Car` class with `brand`, `color`, and `model`.
3. Create a `Mobile` class with `brand` and `price`.
4. Create a `Book` class with `title` and `author`, and add a method to display the details.
5. Create a `BankAccount` class with a deposit method and a balance display method.

---

## 📂 Files in This Folder

| File            | Purpose                                |
| --------------- | -------------------------------------- |
| `class13.ipynb` | Notebook with Python code and practice |
| `README.md`     | Simple guide to classes and objects    |

---

## 🔗 Navigation

* **Previous:** [Class 12 — Python File Handling](../12-Python-File-Handling/)
* **Next:** [Class 14 — Inheritance](../02-Inheritance/)
* **Main:** [Python AI Engineering Journey](../../README.md)

---

## 💡 Pro Tip

> Practice by creating small classes for real-world things like students, cars, books, and bank accounts. The more you practice, the easier OOP becomes.

---

**📅 Date:** January 16, 2024
**🎯 Goal:** Full-Stack AI Engineer
*“Small steps every day lead to big achievements.”*
