const { analyzeDirectory } = require('./driver');
const path = require('path');

analyzeDirectory(path.join(__dirname, '..', 'example', 'sample-project'));
