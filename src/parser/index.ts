import { extname } from 'path';
import ParserFactory from './ParserFactory';

/**
 * Parses the code using a suitable parser. The parser to be used is decided based on the extension obtained from file path.
 * @param filePath The path of file to parse
 * @param code The code inside the file to parse
 * @param options Custom options to be passed to the parser if any
 * @returns the AST of the parsed code
 */
// TODO: Change 'object' type for 'options' arg to a proper interface (type) after deciding on the options input structure
export default function parse(filePath: string, code: string, options: object = {}) {
  // Get the file extension
  const extension = extname(filePath);

  // Get the suitable parser
  const parser = ParserFactory.getParser(extension, options);

  // Return the parsed code
  const ast = parser.parse(code, options);

  return ast;
}
