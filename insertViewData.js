const fs = require('fs');

const { OUTPUT_FILE, VIEW_FILE, DATA_PLACEHOLDER } = require('./constants');

const dataJson = fs.readFileSync(OUTPUT_FILE, 'utf8');
const data = JSON.parse(dataJson);

const viewContents = fs.readFileSync(VIEW_FILE, 'utf8');
const updatedContents = viewContents.replace(DATA_PLACEHOLDER, JSON.stringify(data));
fs.writeFileSync(VIEW_FILE, updatedContents);
