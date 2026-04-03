// Compiler-like DFA Generator with Lexer, Parser, Code Generator, and Simulator


//NEGI

// Get CSS variables for colors
const root = document.documentElement;
const stateColor = getComputedStyle(root).getPropertyValue('--state-color').trim();
const pathColor = getComputedStyle(root).getPropertyValue('--path-color').trim();
const acceptColor = getComputedStyle(root).getPropertyValue('--accept-color').trim();
const arrowColor = getComputedStyle(root).getPropertyValue('--arrow-color').trim();
const stateNameColor = getComputedStyle(root).getPropertyValue('--state-name-color').trim();
const arrowHeadColor = getComputedStyle(root).getPropertyValue('--arrow-head-color').trim();
const arrowLabelColor = getComputedStyle(root).getPropertyValue('--arrow-label-color').trim();
const circleFillColor = getComputedStyle(root).getPropertyValue('--circle-fill-color').trim();
const transitionLabelColor = getComputedStyle(root).getPropertyValue('--transition-label-color').trim();


//NAVEEN

// Lexer: Tokenizes the input pattern
function lexer(input) {
    const tokens = [];
    const words = input.toLowerCase().split(/\s+/);
    for (let word of words) {
        if (['start', 'with', 'ends', 'contain', 'only', 'combination', 'of', 'length', 'is', 'even', 'odd', 'a', 'b', 'and', 'will', 'be', 'mod'].includes(word)) {
            tokens.push({ type: 'keyword', value: word });
        } else if (/^[a-zA-Z0-9]+$/.test(word)) {
            tokens.push({ type: 'string', value: word });
        } else {
            tokens.push({ type: 'unknown', value: word });
        }
    }
    return tokens;
}

//NAVEEN

// Parser: Parses tokens into an AST
function parser(tokens) {
    let i = 0;
    function peek(offset = 0) {
        return tokens[i + offset] ? tokens[i + offset].value : null;
    }
    function peekType(offset = 0) {
        return tokens[i + offset] ? tokens[i + offset].type : null;
    }
    function consume(type) {
        if (i < tokens.length && tokens[i].type === type) {
            return tokens[i++].value;
        }
        return null;
    }

    if (peekType() === 'keyword' && peek() === 'start' && peekType(1) === 'keyword' && peek(1) === 'with' && peekType(2) === 'string') {
        consume('keyword');
        consume('keyword');
        const str = consume('string');
        return { type: 'start_with', string: str };
    } else if (peekType() === 'keyword' && peek() === 'ends' && peekType(1) === 'keyword' && peek(1) === 'with' && peekType(2) === 'string') {
        consume('keyword');
        consume('keyword');
        const str = consume('string');
        return { type: 'ends_with', string: str };
    } else if (peekType() === 'keyword' && peek() === 'contain' && peekType(1) === 'string') {
        consume('keyword');
        const str = consume('string');
        return { type: 'contain', string: str };
    } else if (peekType() === 'keyword' && peek() === 'only' && peekType(1) === 'keyword' && peek(1) === 'combination' && peekType(2) === 'keyword' && peek(2) === 'of' && peekType(3) === 'string') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        const str = consume('string');
        return { type: 'only_combination', alphabet: str.split('') };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'is' && peekType(2) === 'keyword' && peek(2) === 'even') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'length_even' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'is' && peekType(2) === 'keyword' && peek(2) === 'odd') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'length_odd' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'is' && peekType(2) === 'string' && peek(2) === '0') {
        consume('keyword');
        consume('keyword');
        consume('string');
        return { type: 'length_zero' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'is' && peekType(2) === 'string' && peek(2) === '1') {
        consume('keyword');
        consume('keyword');
        consume('string');
        return { type: 'length_one' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'a' && peekType(3) === 'keyword' && peek(3) === 'is' && peekType(4) === 'keyword' && peek(4) === 'even') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'count_a_even' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'a' && peekType(3) === 'keyword' && peek(3) === 'is' && peekType(4) === 'keyword' && peek(4) === 'odd') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'count_a_odd' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'b' && peekType(3) === 'keyword' && peek(3) === 'is' && peekType(4) === 'keyword' && peek(4) === 'even') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'count_b_even' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'b' && peekType(3) === 'keyword' && peek(3) === 'is' && peekType(4) === 'keyword' && peek(4) === 'odd') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'count_b_odd' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'will' && peekType(2) === 'keyword' && peek(2) === 'be' && peekType(3) === 'keyword' && peek(3) === 'even') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'length_even' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'a' && peekType(3) === 'keyword' && peek(3) === 'and' && peekType(4) === 'keyword' && peek(4) === 'b' && peekType(5) === 'keyword' && peek(5) === 'is' && peekType(6) === 'keyword' && peek(6) === 'even') {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        return { type: 'count_a_b_even' };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'is' && peekType(2) === 'keyword' && peek(2) === 'mod' && peekType(3) === 'string' && /^\d+$/.test(peek(3))) {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        const mod = parseInt(consume('string'));
        return { type: 'length_mod', mod: mod };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'a' && peekType(3) === 'keyword' && peek(3) === 'is' && peekType(4) === 'keyword' && peek(4) === 'mod' && peekType(5) === 'string' && /^\d+$/.test(peek(5))) {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        const mod = parseInt(consume('string'));
        return { type: 'count_a_mod', mod: mod };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'b' && peekType(3) === 'keyword' && peek(3) === 'is' && peekType(4) === 'keyword' && peek(4) === 'mod' && peekType(5) === 'string' && /^\d+$/.test(peek(5))) {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        const mod = parseInt(consume('string'));
        return { type: 'count_b_mod', mod: mod };
    } else if (peekType() === 'keyword' && peek() === 'length' && peekType(1) === 'keyword' && peek(1) === 'of' && peekType(2) === 'keyword' && peek(2) === 'a' && peekType(3) === 'keyword' && peek(3) === 'and' && peekType(4) === 'keyword' && peek(4) === 'b' && peekType(5) === 'keyword' && peek(5) === 'is' && peekType(6) === 'keyword' && peek(6) === 'mod' && peekType(7) === 'string' && /^\d+$/.test(peek(7))) {
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        consume('keyword');
        const mod = parseInt(consume('string'));
        return { type: 'count_a_b_mod', mod: mod };
    }
    return null;
}

//NAVEEN

// Code Generator: Builds DFA from AST
function codeGenerator(ast) {
    if (!ast) return null;

    let alphabet;
    if (ast.type === 'only_combination') {
        alphabet = ast.alphabet;
    } else if (['count_a_even', 'count_a_odd', 'count_b_even', 'count_b_odd', 'count_a_b_even', 'count_a_mod', 'count_b_mod', 'count_a_b_mod'].includes(ast.type)) {
        alphabet = ['a', 'b'];
    } else if (['length_even', 'length_odd', 'length_zero', 'length_one', 'length_mod'].includes(ast.type)) {
        alphabet = [];
        for (let i = 32; i <= 126; i++) {
            alphabet.push(String.fromCharCode(i));
        }
    } else {
        alphabet = [...new Set(ast.string.split(''))];
    }

    if (ast.type === 'start_with') {
        return buildStartWithDFA(ast.string, alphabet);
    } else if (ast.type === 'ends_with') {
        return buildEndsWithDFA(ast.string, alphabet);
    } else if (ast.type === 'contain') {
        return buildContainDFA(ast.string, alphabet);
    } else if (ast.type === 'only_combination') {
        return buildOnlyCombinationDFA(ast.alphabet);
    } else if (ast.type === 'length_even') {
        return buildLengthEvenDFA(alphabet);
    } else if (ast.type === 'length_odd') {
        return buildLengthOddDFA(alphabet);
    } else if (ast.type === 'length_zero') {
        return buildLengthZeroDFA(alphabet);
    } else if (ast.type === 'length_one') {
        return buildLengthOneDFA(alphabet);
    } else if (ast.type === 'count_a_even') {
        return buildCountAEvenDFA(alphabet);
    } else if (ast.type === 'count_a_odd') {
        return buildCountAOddDFA(alphabet);
    } else if (ast.type === 'count_b_even') {
        return buildCountBEvenDFA(alphabet);
    } else if (ast.type === 'count_b_odd') {
        return buildCountBOddDFA(alphabet);
    } else if (ast.type === 'count_a_b_even') {
        return buildCountABEvenDFA(alphabet);
    } else if (ast.type === 'length_mod') {
        return buildLengthModDFA(ast.mod, alphabet);
    } else if (ast.type === 'count_a_mod') {
        return buildCountAModDFA(ast.mod, alphabet);
    } else if (ast.type === 'count_b_mod') {
        return buildCountBModDFA(ast.mod, alphabet);
    } else if (ast.type === 'count_a_b_mod') {
        return buildCountABModDFA(ast.mod, alphabet);
    }
    return null;
}


//DINESH

// Helper functions for DFA building
// Builds DFA for strings starting with a specific prefix
function buildStartWithDFA(prefix, alphabet) {
    let dfa = {};
    for (let i = 0; i <= prefix.length; i++) {
        let state = "q" + i;
        dfa[state] = {};
        for (let c of alphabet) {
            if (i < prefix.length && c === prefix[i]) {
                dfa[state][c] = "q" + (i + 1);
            } else if (i < prefix.length) {
                dfa[state][c] = "qReject";
            } else {
                dfa[state][c] = "q" + prefix.length;
            }
        }
        dfa[state]["else"] = "qReject";
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";
    dfa["q" + prefix.length].accept = true;
    return dfa;
}

// Builds DFA for strings ending with a specific suffix
function buildEndsWithDFA(suffix, alphabet) {
    let dfa = {};
    let len = suffix.length;
    for (let i = 0; i <= len; i++) {
        dfa["q" + i] = {};
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";

    for (let i = 0; i <= len; i++) {
        let state = "q" + i;
        for (let c of alphabet) {
            let next = i;
            if (c === suffix[i]) next = i + 1;
            else if (i > 0 && c === suffix[0]) next = 1;
            else next = 0;
            if (next > len) next = len;
            dfa[state][c] = "q" + next;
        }
        dfa[state]["else"] = "qReject";
    }
    dfa["q" + len].accept = true;
    return dfa;
}

//NAVEEN

// Builds DFA for strings containing a specific pattern
function buildContainDFA(pattern, alphabet) {
    let len = pattern.length;
    let dfa = {};
    for (let i = 0; i <= len; i++) {
        dfa["q" + i] = {};
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";

    for (let i = 0; i <= len; i++) {
        for (let c of alphabet) {
            let next = 0;
            for (let j = Math.min(i + 1, len); j >= 0; j--) {
                if (pattern.slice(0, j) === (pattern.slice(0, i) + c).slice(-j)) {
                    next = j;
                    break;
                }
            }
            dfa["q" + i][c] = "q" + next;
        }
        dfa["q" + i]["else"] = "qReject";
    }
    dfa["q" + len].accept = true;
    return dfa;
}

//HIMANSHU
// Builds DFA for strings using only specified characters
function buildOnlyCombinationDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {};
    alphabet.forEach(c => dfa["q0"][c] = "q0");
    dfa["q0"].accept = true;
    dfa["qReject"] = {};
    for (let i = 32; i <= 126; i++) {
        let ch = String.fromCharCode(i);
        if (!alphabet.includes(ch)) dfa["qReject"][ch] = "qReject";
    }
    dfa["q0"]["else"] = "qReject";
    return dfa;
}

// New functions for length and count conditions

// Builds DFA for strings with even length
function buildLengthEvenDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even length
    dfa["q1"] = {}; // odd length
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        dfa["q0"][c] = "q1";
        dfa["q1"][c] = "q0";
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings with odd length
function buildLengthOddDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even length
    dfa["q1"] = {}; // odd length
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        dfa["q0"][c] = "q1";
        dfa["q1"][c] = "q0";
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q1"].accept = true;
    return dfa;
}

// Builds DFA for empty strings only
function buildLengthZeroDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {};
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        dfa["q0"][c] = "qReject";
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings with length exactly 1
function buildLengthOneDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {};
    dfa["q1"] = {};
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        dfa["q0"][c] = "q1";
        dfa["q1"][c] = "qReject";
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q1"].accept = true;
    return dfa;
}

// Builds DFA for strings with even count of 'a' characters
function buildCountAEvenDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even count of a
    dfa["q1"] = {}; // odd count of a
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        if (c === 'a') {
            dfa["q0"][c] = "q1";
            dfa["q1"][c] = "q0";
        } else if (c === 'b') {
            dfa["q0"][c] = "q0";
            dfa["q1"][c] = "q1";
        } else {
            dfa["q0"][c] = "qReject";
            dfa["q1"][c] = "qReject";
        }
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings with odd count of 'a' characters
function buildCountAOddDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even count of a
    dfa["q1"] = {}; // odd count of a
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        if (c === 'a') {
            dfa["q0"][c] = "q1";
            dfa["q1"][c] = "q0";
        } else if (c === 'b') {
            dfa["q0"][c] = "q0";
            dfa["q1"][c] = "q1";
        } else {
            dfa["q0"][c] = "qReject";
            dfa["q1"][c] = "qReject";
        }
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q1"].accept = true;
    return dfa;
}

// Builds DFA for strings with even count of 'b' characters
function buildCountBEvenDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even count of b
    dfa["q1"] = {}; // odd count of b
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        if (c === 'b') {
            dfa["q0"][c] = "q1";
            dfa["q1"][c] = "q0";
        } else if (c === 'a') {
            dfa["q0"][c] = "q0";
            dfa["q1"][c] = "q1";
        } else {
            dfa["q0"][c] = "qReject";
            dfa["q1"][c] = "qReject";
        }
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings with odd count of 'b' characters
function buildCountBOddDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even count of b
    dfa["q1"] = {}; // odd count of b
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        if (c === 'b') {
            dfa["q0"][c] = "q1";
            dfa["q1"][c] = "q0";
        } else if (c === 'a') {
            dfa["q0"][c] = "q0";
            dfa["q1"][c] = "q1";
        } else {
            dfa["q0"][c] = "qReject";
            dfa["q1"][c] = "qReject";
        }
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q1"].accept = true;
    return dfa;
}

// Builds DFA for strings with even total count of 'a' and 'b' characters
function buildCountABEvenDFA(alphabet) {
    let dfa = {};
    dfa["q0"] = {}; // even count of a and b
    dfa["q1"] = {}; // odd count of a and b
    dfa["qReject"] = {};
    alphabet.forEach(c => {
        if (c === 'a' || c === 'b') {
            dfa["q0"][c] = "q1";
            dfa["q1"][c] = "q0";
        } else {
            dfa["q0"][c] = "qReject";
            dfa["q1"][c] = "qReject";
        }
        dfa["qReject"][c] = "qReject";
    });
    dfa["q0"]["else"] = "qReject";
    dfa["q1"]["else"] = "qReject";
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// New functions for mod conditions

// Builds DFA for strings where length is divisible by mod
function buildLengthModDFA(mod, alphabet) {
    let dfa = {};
    for (let i = 0; i < mod; i++) {
        dfa["q" + i] = {};
        alphabet.forEach(c => dfa["q" + i][c] = "q" + ((i + 1) % mod));
        dfa["q" + i]["else"] = "qReject";
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings where count of 'a' is divisible by mod
function buildCountAModDFA(mod, alphabet) {
    let dfa = {};
    for (let i = 0; i < mod; i++) {
        dfa["q" + i] = {};
        alphabet.forEach(c => {
            if (c === 'a') {
                dfa["q" + i][c] = "q" + ((i + 1) % mod);
            } else {
                dfa["q" + i][c] = "q" + i;
            }
        });
        dfa["q" + i]["else"] = "qReject";
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings where count of 'b' is divisible by mod
function buildCountBModDFA(mod, alphabet) {
    let dfa = {};
    for (let i = 0; i < mod; i++) {
        dfa["q" + i] = {};
        alphabet.forEach(c => {
            if (c === 'b') {
                dfa["q" + i][c] = "q" + ((i + 1) % mod);
            } else {
                dfa["q" + i][c] = "q" + i;
            }
        });
        dfa["q" + i]["else"] = "qReject";
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

// Builds DFA for strings where total count of 'a' and 'b' is divisible by mod
function buildCountABModDFA(mod, alphabet) {
    let dfa = {};
    for (let i = 0; i < mod; i++) {
        dfa["q" + i] = {};
        alphabet.forEach(c => {
            if (c === 'a' || c === 'b') {
                dfa["q" + i][c] = "q" + ((i + 1) % mod);
            } else {
                dfa["q" + i][c] = "q" + i;
            }
        });
        dfa["q" + i]["else"] = "qReject";
    }
    dfa["qReject"] = {};
    alphabet.forEach(c => dfa["qReject"][c] = "qReject");
    dfa["qReject"]["else"] = "qReject";
    dfa["q0"].accept = true;
    return dfa;
}

//ANAS

// Simulator: Tests a string against the DFA and returns true if accepted
function simulateDFA(dfa, input) {
    let state = "q0";
    for (let c of input) {
        if (dfa[state] && dfa[state][c]) {
            state = dfa[state][c];
        } else if (dfa[state] && dfa[state]["else"]) {
            state = dfa[state]["else"];
        } else {
            state = "qReject";
        }
    }
    return dfa[state] && dfa[state].accept;
}

// Simulates string against DFA and returns path and transitions taken
function simulateWithPath(dfa, input) {
    let state = "q0";
    let path = [state];
    let transitions = [];
    for (let c of input) {
        let next;
        if (dfa[state] && dfa[state][c]) {
            next = dfa[state][c];
        } else if (dfa[state] && dfa[state]["else"]) {
            next = dfa[state]["else"];
        } else {
            next = "qReject";
        }
        transitions.push({ symbol: c, from: state, to: next });
        state = next;
        path.push(state);
    }
    const result = dfa[state] && dfa[state].accept;
    return { result, path, transitions };
}

//HIMANSHU

// Processes pattern input and generates DFA with visualization
function processPattern() {
    let desc = document.getElementById("patternInput").value.toLowerCase();

    if (!desc) {
        alert("Enter a pattern");
        return;
    }

    const tokens = lexer(desc);
    displayLexer(tokens);

    const ast = parser(tokens);
    displayParser(ast);

    if (!ast) {
        alert("Pattern not supported! Use: start with <string>, ends with <string>, contain <string>, only combination of <string>, length is even/odd/0/1/mod <n>, length of a is even/odd/mod <n>, length of b is even/odd/mod <n>, length of a and b is even/mod <n>, length will be even");
        return;
    }

    // Code Generator
    let dfa = codeGenerator(ast);

    if (!dfa) {
        alert("Failed to build DFA");
        return;
    }

    displayDFATable(dfa);
    displayNFATable(dfa); // Since DFA is NFA
    drawDFA(dfa);
}

// Displays lexer tokens in formatted text
function displayLexer(tokens) {
    const output = tokens.length
        ? tokens.map(token => `${token.type}: ${token.value}`).join('\n')
        : 'No tokens generated.';
    document.getElementById('lexerOutput').innerText = output;
}

// Displays parser AST in JSON format
function displayParser(ast) {
    const output = ast ? JSON.stringify(ast, null, 2) : 'Invalid syntax or unsupported pattern.';
    document.getElementById('parserOutput').innerText = output;
}

//ANAS

// Runs simulation test and displays result with step-by-step animation
function simulate() {
    const input = document.getElementById("testInput").value;
    const desc = document.getElementById("patternInput").value.toLowerCase();
    const tokens = lexer(desc);
    const ast = parser(tokens);
    if (!ast) {
        document.getElementById("simulationOutput").innerText = "Invalid pattern";
        return;
    }
    const dfa = codeGenerator(ast);
    if (!dfa) {
        document.getElementById("simulationOutput").innerText = "Failed to build DFA";
        return;
    }
    // Determine allowed alphabet for notes (does not block path)
    let alphabet;
    if (ast.type === 'only_combination') {
        alphabet = ast.alphabet;
    } else if (['count_a_even', 'count_a_odd', 'count_b_even', 'count_b_odd', 'count_a_b_even', 'count_a_mod', 'count_b_mod', 'count_a_b_mod'].includes(ast.type)) {
        alphabet = ['a', 'b'];
    } else if (['length_even', 'length_odd', 'length_zero', 'length_one', 'length_mod'].includes(ast.type)) {
        alphabet = [];
        for (let i = 32; i <= 126; i++) {
            alphabet.push(String.fromCharCode(i));
        }
    } else {
        alphabet = [...new Set(ast.string.split(''))];
    }
    let invalidChars = [];
    for (let c of input) {
        if (!alphabet.includes(c)) {
            invalidChars.push(c);
        }
    }

    // Simulate and get path
    const { result, path, transitions } = simulateWithPath(dfa, input);

    let output = result ? "Accepted" : "Rejected";
    if (invalidChars.length) {
        output += ` (contains invalid symbol${invalidChars.length > 1 ? 's' : ''}: ${invalidChars.join(', ')})`;
    }
    document.getElementById("simulationOutput").innerText = output;

    animateSimulation(dfa, path, input, transitions);
}

//DINESH

// Renders DFA transition table as HTML
function displayDFATable(dfa) {
    let symbols = new Set();
    for (let state in dfa) {
        for (let s in dfa[state]) if(s!=='accept') symbols.add(s);
    }
    symbols = [...symbols];

    let table = "<table><tr><th>State</th>";
    symbols.forEach(s => table += `<th>${s}</th>`);
    table += "<th>Accept</th></tr>";

    for (let state in dfa) {
        table += `<tr><td>${state}</td>`;
        symbols.forEach(s => table += `<td>${dfa[state][s] || "-"}</td>`);
        table += `<td>${dfa[state].accept ? "✓" : "-"}</td>`;
        table += "</tr>";
    }

    document.getElementById("dfaTable").innerHTML = table;
}

//DINESH

// Renders NFA transition table as HTML
function displayNFATable(dfa) {
    let symbols = new Set();
    for (let state in dfa) {
        for (let s in dfa[state]) if(s!=='accept') symbols.add(s);
    }
    symbols = [...symbols];

    let table = "<table><tr><th>State</th>";
    symbols.forEach(s => table += `<th>${s}</th>`);
    table += "<th>Accept</th></tr>";

    for (let state in dfa) {
        table += `<tr><td>${state}</td>`;
        symbols.forEach(s => {
            let next = dfa[state][s];
            if (next) {
                table += `<td>{${next}}</td>`; // NFA can have sets, but here it's single
            } else {
                table += `<td>-</td>`;
            }
        });
        table += `<td>${dfa[state].accept ? "✓" : "-"}</td>`;
        table += "</tr>";
    }

    document.getElementById("nfaTable").innerHTML = table;
}

//ANAS

// Draws DFA diagram with simulation path highlighted
function drawSimulatedDFA(dfa, path, transitions, step) {
    const canvas = document.getElementById("simulatedDFACanvas");
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "16px Arial";

    const states = Object.keys(dfa);
    const radius = 200;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let positions = {};

    // draw states
    states.forEach((state, i) => {
        const angle = (2 * Math.PI * i) / states.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions[state] = { x, y };

        // Highlight if in path (current state)
        const isInPath = path.includes(state);
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.strokeStyle = isInPath ? pathColor : stateColor; // Red for path, cyan for others
        ctx.lineWidth = isInPath ? 4 : 2;
        ctx.stroke();
        // Draw state name outside the circle
        ctx.fillStyle = stateNameColor;
        ctx.fillText(state, x - 15, y + 50);

        if (dfa[state].accept) {
            ctx.beginPath();
            ctx.arc(x, y, 36, 0, 2 * Math.PI);
            ctx.strokeStyle = acceptColor;
            ctx.stroke();
        }
    });

    // Draw transitions (simplified, not showing all)
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const fromPos = positions[from];
        const toPos = positions[to];
        if (fromPos && toPos) {
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(toPos.x, toPos.y);
            ctx.strokeStyle = pathColor;
            ctx.lineWidth = 3;
            ctx.stroke();
            // Arrow
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const angle = Math.atan2(dy, dx);
            ctx.beginPath();
            ctx.moveTo(toPos.x, toPos.y);
            ctx.lineTo(toPos.x - 10 * Math.cos(angle - Math.PI / 6), toPos.y - 10 * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(toPos.x, toPos.y);
            ctx.lineTo(toPos.x - 10 * Math.cos(angle + Math.PI / 6), toPos.y - 10 * Math.sin(angle + Math.PI / 6));
            ctx.stroke();

            // Label the transition if it's the current step
            if (i === step) {
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;
                ctx.fillStyle = transitionLabelColor;
                ctx.fillText(transitions[i].symbol, midX, midY - 10);
            }
        }
    }
}

// Animates step-by-step simulation with timed canvas updates
function animateSimulation(dfa, path, input, transitions) {
    const stepsEl = document.getElementById("simulationSteps");
    stepsEl.innerHTML = "";

    // Draw initial state empty path
    drawSimulatedDFA(dfa, [path[0]], transitions, -1);

    for (let i = 0; i < transitions.length; i++) {
        ((idx) => {
            setTimeout(() => {
                const t = transitions[idx];
                const stepText = `Step ${idx + 1}: on '${t.symbol}' from ${t.from} -> ${t.to}`;
                stepsEl.innerText = stepText;
                drawSimulatedDFA(dfa, path.slice(0, idx + 2), transitions, idx);
                if (idx === transitions.length - 1) {
                    const finalState = path[path.length - 1];
                    const finalResult = dfa[finalState] && dfa[finalState].accept ? "Accepted" : "Rejected";
                    stepsEl.innerText += ` | Final in ${finalState}: ${finalResult}`;
                }
            }, idx * 800);
        })(i);
    }
}

// Draws complete DFA diagram on canvas with states and transitions
function drawDFA(dfa) {
    const canvas = document.getElementById("dfaCanvas");
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = "16px Arial";

    const states = Object.keys(dfa);
    const radius = 200;
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;

    let positions = {};

    // draw states
    states.forEach((state,i)=>{
        const angle = (2*Math.PI*i)/states.length;
        const x = centerX + radius*Math.cos(angle);
        const y = centerY + radius*Math.sin(angle);
        positions[state]={x,y};

        ctx.beginPath();
        ctx.arc(x,y,30,0,2*Math.PI);
        ctx.strokeStyle = stateColor;
        ctx.stroke();
        // Draw state name outside the circle
        ctx.fillStyle = stateNameColor;
        ctx.fillText(state, x - 15, y + 50);

        if(dfa[state].accept){
            ctx.beginPath();
            ctx.arc(x,y,36,0,2*Math.PI);
            ctx.strokeStyle = acceptColor;
            ctx.stroke();
        }
    });

    // draw arrows
    states.forEach(state=>{
        for(let symbol in dfa[state]){
            if(symbol==='accept') continue;
            let target = dfa[state][symbol];
            const from=positions[state];
            const to=positions[target];
            if(!to) continue;
            drawArrow(ctx,from.x,from.y,to.x,to.y,symbol);
        }
    });
}

// Draws arrow with arrowhead and label between two states
function drawArrow(ctx, fromX, fromY, toX, toY, label){
    const headLen=10;
    const angle=Math.atan2(toY-fromY,toX-fromX);

    ctx.beginPath();
    ctx.moveTo(fromX,fromY);
    ctx.lineTo(toX,toY);
    ctx.strokeStyle = arrowColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX,toY);
    ctx.lineTo(toX-headLen*Math.cos(angle-Math.PI/6),toY-headLen*Math.sin(angle-Math.PI/6));
    ctx.lineTo(toX-headLen*Math.cos(angle+Math.PI/6),toY-headLen*Math.sin(angle+Math.PI/6));
    ctx.closePath();
    ctx.fillStyle = arrowHeadColor;
    ctx.fill();

    ctx.fillStyle = arrowLabelColor;
    ctx.fillText(label,(fromX+toX)/2,(fromY+toY)/2-5);
}
