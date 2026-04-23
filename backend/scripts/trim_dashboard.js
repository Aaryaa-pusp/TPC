const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'components', 'StudentDashboard.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Find the first line that contains "export default function StudentDashboard"
// and then find the matching closing "}" for the function
// Strategy: find the line index of lines[821] which should be "}"
// We know the function closes around line 822 (1-indexed = index 821)
// Everything after that which is orphaned code needs to go.

// Find the LAST occurrence of "^}" (closing brace at start of line) and keep up to that
let lastValidEnd = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '}') {
        lastValidEnd = i;
        // Once we find a } and the next non-empty line is NOT part of a valid JSX tree
        // we check if this is the end of the default export function
        // Heuristic: the component function must end where the stack depth returns to 0
    }
}

// Better approach: walk through and track brace depth
let depth = 0;
let functionStart = -1;
let functionEnd = -1;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('export default function StudentDashboard')) {
        functionStart = i;
    }
    if (functionStart >= 0) {
        for (const ch of line) {
            if (ch === '{') depth++;
            if (ch === '}') {
                depth--;
                if (depth === 0 && i > functionStart) {
                    functionEnd = i;
                    break;
                }
            }
        }
        if (functionEnd >= 0) break;
    }
}

console.log(`Function starts at line ${functionStart + 1}, ends at line ${functionEnd + 1}`);

const trimmed = lines.slice(0, functionEnd + 1).join('\n') + '\n';
fs.writeFileSync(filePath, trimmed, 'utf8');
console.log('Done. File trimmed to', functionEnd + 1, 'lines.');
