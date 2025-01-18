const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/', 'text.txt');

const readableStream = fs.createReadStream(filePath, 'utf-8');

readableStream.on('data', (chunk) => console.log(chunk));
readableStream.on('error', (error) => console.log('Error', error.message));
