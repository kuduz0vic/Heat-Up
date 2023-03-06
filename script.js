const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'sections');

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach(function(file) {
    if (file.endsWith('.liquid')) {
      const filePath = path.join(directoryPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const schemaStartIndex = fileContent.indexOf('{% schema %}');
      const schemaEndIndex = fileContent.indexOf('{% endschema %}');

      if (schemaStartIndex !== -1 && schemaEndIndex !== -1) {
        const schemaContent = fileContent.substring(schemaStartIndex + 12, schemaEndIndex);
        const schema = JSON.parse(schemaContent.trim());
        const presetName = schema.name;
        const preset = { presets: [{ name: presetName }], ...schema };

        const updatedFileContent = fileContent.substring(0, schemaStartIndex + 12) 
          + JSON.stringify(preset, null, 2) 
          + fileContent.substring(schemaEndIndex);

        fs.writeFileSync(filePath, updatedFileContent, 'utf8');
        console.log(`Updated ${file}`);
      }
    }
  });
});