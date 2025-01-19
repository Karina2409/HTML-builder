const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, '/input.txt');

const writeStream = fs.createWriteStream(filePath);

stdout.write('Enter some text:\n');

stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    process.exit();
  }

  writeStream.write(`${input}\n`, (err) => {
    if (err) {
      console.error('Error writing to file');
    }
  });
});

process.on('SIGINT', () => {
  stdout.write('Goodbye!');
  process.exit();
});
