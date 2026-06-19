import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('ledger_app.html');
const destPath = path.resolve('src/App.jsx');

let html = fs.readFileSync(htmlPath, 'utf8');

// Find the content inside <script type="text/babel"> ... </script>
const startTag = '<script type="text/babel">';
const endTag = '</script>';

const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag, startIndex + startTag.length);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find babel script block in ledger_app.html");
  process.exit(1);
}

let scriptContent = html.substring(startIndex + startTag.length, endIndex).trim();

// Replace `const { useState, useEffect, useMemo, useRef } = React;` 
// with `import React, { useState, useEffect, useMemo, useRef } from 'react';`
scriptContent = scriptContent.replace(
  'const { useState, useEffect, useMemo, useRef } = React;',
  '' // We will prepend the import at the top
);

// Remove the `const root = ReactDOM.createRoot...` logic since it's now in main.jsx
scriptContent = scriptContent.replace(/const root = ReactDOM\.createRoot[\s\S]*$/, '');

// Prepend necessary imports
const imports = `import React, { useState, useEffect, useMemo, useRef } from 'react';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

`;

// Append export default App
const exports = `

export default App;
`;

const finalContent = imports + scriptContent + exports;

fs.writeFileSync(destPath, finalContent, 'utf8');
console.log('App.jsx has been successfully extracted!');
