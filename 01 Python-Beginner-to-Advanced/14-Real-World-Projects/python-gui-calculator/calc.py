import tkinter as tk
import ast        # NEW: reads math expressions safely (replaces eval)
import operator   # NEW: gives us +, -, *, / as Python functions


# --- NEW: SAFE CALCULATION (replaces eval) ---
# Only these operations are allowed. Anything else raises an error.
OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
}


def safe_eval(expression):
    """Calculate a math expression like '2+3*(4-1)' without using eval()."""

    def evaluate(node):
        # A plain number such as 5 or 3.14
        if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
            return node.value
        # Two numbers with an operator between them, e.g. 2 + 3
        if isinstance(node, ast.BinOp) and type(node.op) in OPERATORS:
            return OPERATORS[type(node.op)](evaluate(node.left), evaluate(node.right))
        # A negative number such as -5
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
            return -evaluate(node.operand)
        # Anything else (letters, function calls, etc.) is not allowed
        raise ValueError("Unsupported expression")

    tree = ast.parse(expression, mode="eval")
    return evaluate(tree.body)


# --- 1. FUNCTIONS (THE BRAINS) ---
def press(symbol):
    # NEW: if the screen shows "Error!", wipe it before typing a new number
    if entry_box.get() == "Error!":
        clear()
    entry_box.insert(tk.END, symbol)
    entry_box.focus_set()  # NEW: keeps the keyboard working after clicking a button


def clear():
    entry_box.delete(0, tk.END)


# NEW: delete only the last character
def backspace():
    current_text = entry_box.get()
    entry_box.delete(0, tk.END)
    entry_box.insert(0, current_text[:-1])


def calculate():
    try:
        result = safe_eval(entry_box.get())  # CHANGED: safe_eval instead of eval
        result = round(result, 10)           # NEW: fixes 0.1+0.2 = 0.30000000000000004
        if isinstance(result, float) and result.is_integer():
            result = int(result)             # NEW: shows 6 instead of 6.0
        clear()
        entry_box.insert(0, str(result))
    except Exception:
        clear()
        entry_box.insert(0, "Error!")


# NEW: keyboard support
def on_key(event):
    if event.char != "" and event.char in "0123456789+-*/.()":
        press(event.char)
    elif event.keysym in ("Return", "KP_Enter"):
        calculate()
    elif event.keysym == "BackSpace":
        backspace()
    elif event.keysym == "Escape":
        clear()
    return "break"  # stops the Entry from typing the key a second time


window = tk.Tk()
window.title("Cutie Calculator 🎀")
window.geometry("320x480")  # CHANGED: taller, because we added a 6th row
window.configure(bg="#FFE4EC")  # soft baby pink

# --- 2. Create the display screen (Entry widget) ---
entry_box = tk.Entry(
    window,
    font=("Comic Sans MS", 20),
    bg="#FF8FB1",  # bubblegum pink screen
    fg="#FFFFFF",
    justify="right",  # Numbers align to the right side, just like real calculators!
    bd=8,             # Border thickness
    relief="ridge",
)
entry_box.bind("<Key>", on_key)  # NEW: connect the keyboard to the calculator
entry_box.focus_set()            # NEW: start with the cursor in the display

# --- 3. Place it on row 0, starting at column 0, stretching across 4 columns! ---
entry_box.grid(
    row=0,
    column=0,
    columnspan=4,
    padx=10,
    pady=15,
    ipady=10,
    sticky="nsew",
)

# --- 4. BUTTON LAYOUT BLUEPRINT ---
buttons = [
    ("7", 1, 0, "#FFD6E0"), ("8", 1, 1, "#FFCCDC"), ("9", 1, 2, "#FFC2D6"), ("/", 1, 3, "#FF9EBB"),
    ("4", 2, 0, "#FFD6E0"), ("5", 2, 1, "#FFCCDC"), ("6", 2, 2, "#FFC2D6"), ("*", 2, 3, "#FF9EBB"),
    ("1", 3, 0, "#FFD6E0"), ("2", 3, 1, "#FFCCDC"), ("3", 3, 2, "#FFC2D6"), ("-", 3, 3, "#FF9EBB"),
    ("C", 4, 0, "#CDB4DB"), ("0", 4, 1, "#FFCCDC"), ("=", 4, 2, "#FF6FA5"), ("+", 4, 3, "#FF9EBB"),
    # ROW 5: decimal point, delete, and brackets
    (".", 5, 0, "#FFD6E0"), ("DEL", 5, 1, "#BDE0FE"), ("(", 5, 2, "#FFAFCC"), (")", 5, 3, "#FFAFCC"),
]

# Configure all 4 columns to stretch equally
for col in range(4):
    window.grid_columnconfigure(col, weight=1)

# Configure all 6 rows (Row 0 for display, Rows 1-5 for buttons) to stretch equally
for row in range(6):  # CHANGED: 5 -> 6
    window.grid_rowconfigure(row, weight=1)

# --- 5. BUTTON FACTORY LOOP ---
for text, row, col, color in buttons:
    if text == "=":
        cmd = calculate
    elif text == "C":
        cmd = clear
    elif text == "DEL":  # NEW
        cmd = backspace
    else:
        cmd = lambda t=text: press(t)

    btn = tk.Button(
        window,
        text=text,
        font=("Comic Sans MS", 14, "bold"),
        bg=color,
        fg="#7A2E4D",  # deep berry text
        command=cmd,
        relief="flat",
    )
    btn.grid(row=row, column=col, padx=5, pady=5, sticky="nsew")


window.mainloop()
