const path = require('path');
const fs = require('fs');

const destFolder = path.join(__dirname, 'files-copy');
const srcFolder = path.join(__dirname, 'files');

function clearFolder(destFolder) {
  fs.readdir(destFolder, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT') return;
      console.error('Error reading a folder: ' + err.message);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(destFolder, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats: ' + err.message);
          return;
        }

        if (stats.isFile()) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file: ' + err.message);
            }
          });
        } else if (stats.isDirectory()) {
          clearFolder(filePath);
          fs.rmdir(filePath, (err) => {
            if (err) console.error('Error removing folder: ' + err.message);
          });
        }
      });
    });
  });
}

function copyFolder(srcFolder, destFolder) {
  fs.readdir(srcFolder, (err, files) => {
    if (err) {
      console.error('Error reading source folder: ' + err.message);
      return;
    }

    files.forEach((file) => {
      const srcPath = path.join(srcFolder, file);
      const destPath = path.join(destFolder, file);

      fs.stat(srcPath, (err, stats) => {
        if (err) {
          console.error('Error getting file stats: ' + err.message);
          return;
        }

        if (stats.isFile()) {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error('File copy error: ' + err.message);
            }
          });
        } else if (stats.isDirectory()) {
          fs.mkdir(destPath, { recursive: true }, (err) => {
            if (err) {
              console.error('Error creating folder: ' + err.message);
              return;
            }
            copyFolder(srcPath, destPath);
          });
        }
      });
    });
  });
}

fs.mkdir(destFolder, { recursive: true }, (err) => {
  if (err) {
    console.error('Folder creation error: ' + err.message);
    return;
  }
  clearFolder(destFolder);
  copyFolder(srcFolder, destFolder);
});
