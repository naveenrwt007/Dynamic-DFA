// Compiler-like DFA Generator with Lexer, Parser, Code Generator, and Simulator

// Get CSS variables for colors
const root = document.documentElement;
const stateColor = getComputedStyle(root).getPropertyValue('--state-color').trim();
const pathColor = getComputedStyle(root).getPropertyValue('--path-color').trim();
const acceptColor = getComputedStyle(root).getPropertyValue('--accept-color').trim();
const arrowColor = getComputedStyle(root).getPropertyValue('--arrow-color').trim();

// Lexer: Tokenizes the input pattern
function lexer(input) {
    const tokens = [];
    const words = input.toLowerCase().split(/\s+/);
    for (let word of words) {
        if (['start', 'with', 'ends', 'contain', 'only', 'combination', 'of'].includes(word)) {
            tokens.push({ type: 'keyword', value: word });
        } else if (/^[a-zA-Z0-9]+$/.test(word)) {
            tokens.push({ type: 'string', value: word });
        } else {
            tokens.push({ type: 'unknown', value: word });
        }
    }
    return tokens;
}

// Parser: Parses tokens into an AST
function parser(tokens) {
    let i = 0;
    function consume(type) {
        if (i < tokens.length && tokens[i].type === type) {
            return tokens[i++].value;
        }
        return null;
    }

    if (consume('keyword') === 'start' && consume('keyword') === 'with') {
        const str = consume('string');
        if (str) return { type: 'start_with', string: str };
    } else if (consume('keyword') === 'ends' && consume('keyword') === 'with') {
        const str = consume('string');
        if (str) return { type: 'ends_with', string: str };
    } else if (consume('keyword') === 'contain') {
        const str = consume('string');
        if (str) return { type: 'contain', string: str };
    } else if (consume('keyword') === 'only' && consume('keyword') === 'combination' && consume('keyword') === 'of') {
        const str = consume('string');
        if (str) return { type: 'only_combination', alphabet: str.split('') };
    }
    return null;
}

// Code Generator: Builds DFA from AST
function codeGenerator(ast) {
    if (!ast) return null;

    let alphabet;
    if (ast.type === 'only_combination') {
        alphabet = ast.alphabet;
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
    }
    return null;
}

// Helper functions for DFA building
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

// Simulator: Tests a string against the DFA
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

// Simulate with path
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

// Main process function
function processPattern() {
    let desc = document.getElementById("patternInput").value.toLowerCase();

    if (!desc) {
        alert("Enter a pattern");
        return;
    }

    const tokens = lexer(desc);
    const ast = parser(tokens);

    if (!ast) {
        alert("Pattern not supported! Use: start with <string>, ends with <string>, contain <string>, only combination of <string>");
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

// Function to simulate
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
    const alphabet = ast.type === 'only_combination' ? ast.alphabet : [...new Set(ast.string.split(''))];
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

// Display DFA table
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

// Display NFA table (same as DFA since DFA is NFA)
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

// Draw simulated DFA with path highlighted
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
        ctx.fillStyle = "white";
        ctx.fillText(state, x - 15, y + 5);

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
                ctx.fillStyle = "#fefefe";
                ctx.fillText(transitions[i].symbol, midX, midY - 10);
            }
        }
    }
}

// Animate step-by-step simulation
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

// Draw DFA diagram
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
        ctx.fillStyle = "white";
        ctx.fillText(state,x-15,y+5);

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

// draw arrow
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
    ctx.fillStyle="#ff00ff";
    ctx.fill();

    ctx.fillStyle="yellow";
    ctx.fillText(label,(fromX+toX)/2,(fromY+toY)/2-5);
}
