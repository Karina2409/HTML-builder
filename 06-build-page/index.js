const path = require('path');
const fs = require('fs');

const distFolder = path.join(__dirname, 'project-dist');
const cssPath = path.join(__dirname, 'styles');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const assetsPath = path.join(__dirname, 'assets');
const distAssetsPath = path.join(distFolder, 'assets');
const distCSSPath = path.join(distFolder, 'style.css');
const distHTMLPath = path.join(distFolder, 'index.html');

fs.mkdir(distFolder, { recursive: true }, (err) => {
  if (err) return console.error('Error creating project-dist: ' + err.message);

  bundleCSS();
  copyFolder(assetsPath, distAssetsPath);

  generateHTML();
});

function bundleCSS() {
  const writeStream = fs.createWriteStream(distCSSPath);

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

        readStream.on('end', () => writeStream.write('\n\n'));

        readStream.on('error', (err) => {
          console.error(`Error reading file ${file.name}: ` + err.message);
        });
      }
    });
  });

  writeStream.on('error', (err) => {
    console.error('Error writing to style.css: ' + err.message);
  });
}

function copyFolder(srcFolder, distFolder) {
  fs.mkdir(distFolder, { recursive: true }, (err) => {
    if (err) return console.error('Error creating folder: ' + err.message);
    fs.readdir(srcFolder, (err, files) => {
      if (err) {
        console.error('Error reading source folder: ' + err.message);
        return;
      }

      files.forEach((file) => {
        const srcPath = path.join(srcFolder, file);
        const distPath = path.join(distFolder, file);

        fs.stat(srcPath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats: ' + err.message);
            return;
          }

          if (stats.isFile()) {
            fs.copyFile(srcPath, distPath, (err) => {
              if (err) {
                console.error('File copy error: ' + err.message);
              }
            });
          } else if (stats.isDirectory()) {
            fs.mkdir(distPath, { recursive: true }, (err) => {
              if (err) {
                console.error('Error creating folder: ' + err.message);
                return;
              }
              copyFolder(srcPath, distPath);
            });
          }
        });
      });
    });
  });
}

function generateHTML() {
  fs.readFile(templatePath, 'utf-8', (err, template) => {
    if (err)
      return console.error('Error reading template.html: ' + err.message);
    const tagRegex = /{{\s*(\w+)\s*}}/g;
    const components = [];
    let match;

    while ((match = tagRegex.exec(template)) !== null) {
      components.push(match[1]);
    }

    let resultTemplate = template;
    let componentsProcessed = 0;

    components.forEach((component) => {
      const componentPath = path.join(componentsPath, `${component}.html`);
      fs.readFile(componentPath, (err, data) => {
        if (err) {
          console.error(`Error reading component ${component}: ` + err.message);
          return;
        }

        resultTemplate = resultTemplate.replace(
          new RegExp(`{{\\s*${component}\\s*}}`, 'g'),
          data,
        );
        componentsProcessed++;

        if (componentsProcessed === components.length) {
          fs.writeFile(distHTMLPath, resultTemplate, (err) => {
            if (err) console.error('Error writing index.html: ' + err.message);
          });
        }
      });
    });
  });
}
