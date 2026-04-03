# Dynamic DFA Studio

A user-friendly web application for creating and testing Deterministic Finite Automata (DFAs) through natural language patterns. No programming knowledge required!

## What is a DFA?

A **Deterministic Finite Automaton (DFA)** is a mathematical model used to recognize patterns in strings. It consists of:
- **States**: Different conditions the machine can be in
- **Transitions**: Rules for moving between states based on input characters
- **Accepting States**: States that indicate the input string matches the pattern

Think of it like a flowchart that processes text character by character to decide if it matches a specific pattern.

## Features

✨ **Easy Pattern Input**: Describe patterns in plain English
🔍 **Visual DFA Diagrams**: See your automaton as a graph
📊 **Transition Tables**: View DFA and NFA tables
🎯 **Step-by-Step Simulation**: Watch how strings are processed
⚡ **Real-time Testing**: Test any string against your DFA
🎨 **Beautiful Interface**: Clean, modern design with animations

## Quick Start

1. **Open the Application**: Open `index.html` in any modern web browser
2. **Define Sigma (Optional)**: Enter the alphabet characters in the "Define Sigma" field (e.g., "abc", "01", "xyz")
   - If left empty, the alphabet is auto-detected from the pattern
   - If specified, only these characters are allowed in the DFA
3. **Enter a Pattern**: Type a pattern description in the input field
4. **Generate DFA**: Click "Generate DFA" to create the automaton
5. **Test Strings**: Enter test strings and click "Test String" to see if they match
6. **Explore**: Use the visual diagram and tables to understand how it works

## Custom Alphabet (Sigma)

You can optionally define a custom alphabet (sigma) for your DFA:
- **Format**: Enter characters without spaces (e.g., "abc", "01", "xyz")
- **Purpose**: Restricts the input alphabet to only the specified characters
- **Example**: If you define sigma as "01", the DFA will only process binary strings
- **Auto-Detection**: If left empty, the alphabet is automatically derived from your pattern

### Sigma Examples
```
Pattern: start with hello
Sigma: (empty) → Auto-detects {h, e, l, o}

Pattern: start with 10
Sigma: 01 → Only binary strings allowed

Pattern: length is even
Sigma: abc → Only strings with characters a, b, c
```

## Supported Patterns

### Basic String Patterns
- `start with abc` - Strings that begin with "abc"
- `ends with xyz` - Strings that end with "xyz"
- `contain hello` - Strings that contain "hello" anywhere
- `only combination of abc` - Strings using only a, b, and c characters

### Length-Based Patterns
- `length is even` - Strings with even number of characters
- `length is odd` - Strings with odd number of characters
- `length is 0` - Empty strings only
- `length is 1` - Single character strings
- `length is mod 3` - Strings where length is divisible by 3
- `length will be even` - Same as "length is even"

### Character Count Patterns
- `length of a is even` - Even number of 'a' characters
- `length of a is odd` - Odd number of 'a' characters
- `length of a is mod 4` - Number of 'a's is divisible by 4
- `length of b is even` - Even number of 'b' characters
- `length of b is odd` - Odd number of 'b' characters
- `length of b is mod 5` - Number of 'b's is divisible by 5
- `length of a and b is even` - Even total count of 'a' and 'b' characters
- `length of a and b is mod 6` - Total 'a'+'b' count divisible by 6

## Examples

### Example 1: Email Validation Pattern
```
Pattern: start with user and contain @
Result: Accepts strings like "user123@test.com", rejects "test.com"
```

### Example 2: Even Length Strings
```
Pattern: length is even
Test: "hello" → Rejected (5 chars)
Test: "world" → Accepted (5 chars? Wait, "world" has 5 chars)
Test: "hi" → Accepted (2 chars)
```

### Example 3: Binary Strings with Even Number of 1's
```
Pattern: length of a is even
Note: Here 'a' represents '1', 'b' represents '0'
Test: "abba" → Accepted (2 'a's)
Test: "abbb" → Rejected (1 'a')
```

## How It Works

The application uses a **compiler-like architecture**:

1. **Lexer**: Breaks your pattern into tokens
2. **Parser**: Analyzes the tokens and creates an Abstract Syntax Tree (AST)
3. **Code Generator**: Builds the DFA from the AST
4. **Simulator**: Tests strings against the DFA

## Technical Details

- **Languages**: HTML, CSS, JavaScript
- **No Dependencies**: Pure vanilla JavaScript
- **Browser Support**: Modern browsers with Canvas support
- **Architecture**: Compiler pipeline (Lexer → Parser → Code Generator → Simulator)

## Pattern Syntax Guide

### Keywords
- `start with` - Beginning of string
- `ends with` - End of string
- `contain` - Contains substring
- `only combination of` - Character set restriction
- `length is` - Total string length
- `length of a is` - Count of 'a' characters
- `length of b is` - Count of 'b' characters
- `length of a and b is` - Combined count of 'a' and 'b'

### Modifiers
- `even` - Divisible by 2
- `odd` - Not divisible by 2
- `mod N` - Divisible by N (where N is 2-10)

## Tips

- Use lowercase letters for patterns
- For character counting, 'a' and 'b' are the only characters considered
- Length patterns work with any characters
- Invalid characters in test strings will be highlighted
- The simulator shows step-by-step processing

## Contributing

This is an educational project. Feel free to:
- Add new pattern types
- Improve the UI/UX
- Add more visualization features
- Fix bugs or add tests

## License

Educational use only. Created for learning automata theory and compiler design.
