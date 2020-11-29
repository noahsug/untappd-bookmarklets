const fs = require('fs');

const { OUTPUT_FILE } = require('./constants');

function getExistingData() {
  let data;
  try {
    data = fs.readFileSync(OUTPUT_FILE);
  } catch (e) {
    return [];
  }

  return JSON.parse(data);
}

const input = process.argv.slice(2).join(' ');
const newData = JSON.parse(input);

const existingData = getExistingData();

const newNames = new Set(newData.map(({ name }) => name));
const updatedData = existingData.filter(({ name }) => !newNames.has(name))
updatedData.push(...newData);

const jsonOutput = JSON.stringify(updatedData, null, 2);
fs.writeFileSync(OUTPUT_FILE, jsonOutput);

console.log('added', newData.length, 'beers');
