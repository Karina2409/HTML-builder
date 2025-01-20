const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, '/project-dist/bundle.css');
const cssPath = path.join(__dirname, '/styles');

const writeStream = fs.createWriteStream(distPath);

fs.readdir(cssPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading styles folder: ' + err.message);
    return;
  }

  files.forEach((file) => {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(cssPath, file.name);
      const readStream = fs.createReadStream(filePath, 'utf-8');
      readStream.pipe(writeStream, { end: false });

      readStream.on('end', () => {
        writeStream.write('\n\n');
      });

      readStream.on('error', (err) => {
        console.error(`Error reading file ${file.name}: ` + err.message);
      });
    }
  });
});

writeStream.on('finish', () => {
  console.log('Styles successfully merged into bundle.css');
});

writeStream.on('error', (err) => {
  console.error('Error writing to bundle.css: ' + err.message);
});
