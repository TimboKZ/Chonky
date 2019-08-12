const fs = require('fs');
const path = require('path');

const lineBreakRegex = /\r?\n/;
const typedefPath = path.resolve(__dirname, '..', '..', 'src', 'typedef.ts');

const extractTypedef = (typeName, filePath = typedefPath) => {
    // const typeStartRegex = new RegExp(`(export)?\\s+(interface|type|enum)\\s+${typeName}\\s+(=|=\\s+{|{)`);
    const typeStartRegex = new RegExp(`(export)?\\s+(interface|type|enum)\\s+${typeName}\\s+(=|=\\s+{|{)`);
    const lines = fs.readFileSync(filePath, 'utf-8').split(lineBreakRegex);

    let docLines = [];
    let typeLines = [];
    let recording = false;
    for (const line of lines) {
        if (recording) {
            typeLines.push(line);
            if (line.startsWith('}') || line.startsWith('};')) break;
        } else {
            const match = line.match(typeStartRegex);
            if (match) {
                const singleLine = match[3] === '=';
                typeLines = docLines;
                docLines = [];
                typeLines.push(line);
                if (singleLine) break;
                else recording = true;
            } else {
                if (line.startsWith('//')) docLines.push(line);
                else docLines = [];
            }
        }
    }
    return typeLines.join('\n');
};

module.exports = extractTypedef;
