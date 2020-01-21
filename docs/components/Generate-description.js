const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const generateDescription = filePath => {
  const id = crypto
    .createHash('sha1')
    .update(filePath)
    .digest('base64');
  const name = path.basename(filePath);
  const stats = fs.statSync(filePath);

  const file = {
    // Assign the 2 required properties
    id: id,
    name: name,

    // Assign optional properties
    isDir: stats.isDirectory(),
    modDate: stats.ctime,
  };

  // Only set boolean flags if they don't match the defaults
  if (name.charAt(0) === '.') file.isHidden = true;
  if (stats.isSymbolicLink()) file.isSymlink = true;

  // Don't set file size for directories
  if (!stats.isDirectory()) file.size = stats.size;

  return file;
};

const saveJson = (jsonPath, file) => {
  // Pretty print the object into a string and write it out
  const fileJson = JSON.stringify(file, null, 2);
  fs.writeFileSync(jsonPath, fileJson, 'utf8');
};

const inputPath = path.resolve(__dirname, 'FullDemo.js');
const outputPath = path.resolve(__dirname, 'file.json');

const file = generateDescription(inputPath);
saveJson(outputPath, file);
