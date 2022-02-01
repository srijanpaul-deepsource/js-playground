import JSParser from './parsers/JSParser';
import JSXParser from './parsers/JSXParser';
import TSParser from './parsers/TSParser';
import TSXParser from './parsers/TSXParser';
import VueParser from './parsers/VueParser';

/**
 * Factory to create a suitable parser object on the run.
 */
export default class ParserFactory {
  /**
   * Creates and returns a parser object based on the file extension.
   * @param extension The extension of the file to be parsed
   * @param options Custom options to be passed to the parser if any
   * @returns a parser object
   */
  static getParser(extension: string, options: object) {
    const extToParserMap = {
      '.js': () => new JSParser(options),
      '.jsx': () => new JSXParser(options),
      '.ts': () => new TSParser(options),
      '.tsx': () => new TSXParser(options),
      '.vue': () => new VueParser(options),
    };

    // @ts-ignore
    return extToParserMap[extension]();
  }
}
