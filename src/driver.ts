/**
 * @fileoverview The driver code that crawls a source directory and calls the analyzer on each file.
 */

import { analyze } from './analyzer';
import path from 'path';
import fs from 'fs';
import glob from 'glob';

type WithFileCallBack = (fileName: string, contents: string) => void;
/**
 * Recursively walks {srcDir}, finding all files that match a pattern listed in {globMatchPatterns}
 * and calling {callback} on each file and it's contents.
 * @param srcDir The source directory to walk recursively
 * @param callback The function that is called for each matching file
 * @param matchPatterns Array of file patterns to match
 */
function withFilesInDir(srcDir: string, callback: WithFileCallBack, matchPatterns: string[]) {
  /// TODO (injuly): add support for ignoring file patterns and handle symlinks
  const handleSingleFile = (filePath: string) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      /// TODO (injuly): handle this error
      if (err) return;
      callback(filePath, data);
    });
  };

  matchPatterns.forEach(pattern =>
    glob(pattern, { cwd: srcDir }, (err, matches) => {
      /// TODO (injuly): handle this error
      if (err) return;
      matches.forEach(fileName => {
        const fullFilePath = path.join(srcDir, fileName);
        handleSingleFile(fullFilePath);
      });
    })
  );
}

/**
 * Runs the analyzer on all matching files in a directory.
 * @param dirPath path to the directory containing the source code.
 */
export function analyzeDirectory(dirPath: string) {
  withFilesInDir(dirPath, analyze, ['**/*.js']);
}
