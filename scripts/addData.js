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

const newLinks = new Set(newData.map(({ link }) => link));
const updatedData = existingData.filter(({ link }) => !newLinks.has(link))
updatedData.push(...newData);

const jsonOutput = JSON.stringify(updatedData, null, 2);
fs.writeFileSync(OUTPUT_FILE, jsonOutput);

const numUpdated = existingData.length + newData.length - updatedData.length;
if (numUpdated) {
  console.log('updated', numUpdated, 'beer(s)');
}

const numAdded = newData.length - numUpdated;
if (numAdded) {
  console.log('added', numAdded, 'beer(s)');
}
