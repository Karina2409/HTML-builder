const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, '/secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Error reading a folder: ' + err.message);
    return;
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(
            'Error while obtaining file information: ' + err.message,
          );
          return;
        }

        const fileName = path.parse(file.name).name;
        const fileExt = path.extname(file.name).slice(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExt} - ${fileSize}`);
      });
    }
  });
});
