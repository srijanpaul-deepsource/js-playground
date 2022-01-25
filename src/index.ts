import { analyzeDirectory } from './driver';
import path = require('path');

analyzeDirectory(path.join(__dirname, '..', 'example', 'sample-project'));
