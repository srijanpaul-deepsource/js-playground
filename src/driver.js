/**
 * @fileoverview The driver code that crawls a source directory and calls the analyzer on each file.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const analyzeJS = require('./analyzer');

/**
 * Recursively walks {srcDir}, finding all files that match a pattern listed in {globMatchPatterns}
 * and calling {callback} on each file and it's contents.
 * @param {string} srcDir The source directory to walk recursively
 * @param {(string, string) => any} callback The function that is called for each matching file
 * @param {string[]} matchPatterns Array of file patterns to match
 */
function withFilesInDir(srcDir, callback, matchPatterns) {
  /// TODO (injuly): add support for ignoring file patterns and handle symlinks
  const handleSingleFile = filePath => {
    fs.readFile(filePath, 'utf-8',(err, data) => {
      /// TODO (injuly): handle this error
      if (err) return;
      callback(filePath, data);
    });
  }

  matchPatterns.forEach(pattern =>
    glob(pattern, { cwd: srcDir }, (err, matches) => {
      /// TODO (injuly): handle this error
      if (err) return;
      matches.forEach(fileName => {
        const fullFilePath = path.join(srcDir, fileName);
        handleSingleFile(fullFilePath)
      });
    }
    )
  );
}

/**
 * Runs the analyzer on all matching files in a directory.
 * @param {string} dirPath path to the directory containing the source code.
 */
function analyzeDirectory(dirPath) {
  const analyzeFile = (fileName, sourceCode) => {
    analyzeJS(fileName, sourceCode);
  };
  withFilesInDir(dirPath, analyzeFile, ['**/*.js']);
}

module.exports = {
  withFilesInDir,
  analyzeDirectory,
};
