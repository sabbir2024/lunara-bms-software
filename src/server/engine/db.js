const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data');

if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath);

function load(collection) {
  const filePath = path.join(dataPath, `${collection}.json`);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function save(collection, data) {
  const filePath = path.join(dataPath, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
