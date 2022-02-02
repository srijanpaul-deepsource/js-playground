import { extname } from 'path';
import ParserFactory from './ParserFactory';

/**
 * Parses the code using a suitable parser. The parser to be used is decided based on the extension obtained from file path.
 * @param filePath The path of file to parse
 * @param code The code inside the file to parse
 * @param options Custom options to be passed to the parser if any
 * @returns the AST of the parsed code
 */
// TODO: Change 'Object' type for 'options' arg to a proper interface (type) after deciding on the options input structure
export default function parse(filePath: string, code: string, options: Object = {}) {
  const extension = extname(filePath);
  const parser = ParserFactory.getParser(extension, options);
  const ast = parser.parse(code, options);

  return ast;
}
