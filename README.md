# Dynamic-DFA-
Web-based DFA generator with compiler-like design. Users define patterns (start, end, contain, combinations, length conditions), and the system builds the DFA via lexical analysis, parsing, and code generation. Includes a simulator showing step-by-step acceptance/rejection, supports alphanumeric input, dead state handling, and visual DFA/NFA tables with CSS styling.

Supported patterns:
- start with <string>
- ends with <string>
- contain <string>
- only combination of <string>
- length is even
- length is odd
- length is 0
- length is 1
- length of a is even
- length of a is odd
- length of b is even
- length of b is odd
- length of a and b is even
- length will be even
