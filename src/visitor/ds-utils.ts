/**
 * @fileoverview This file contains types and utilities to help translate location data
 * and issues raised by the checker into a format that is understood by other
 * DeepSource services.
 */

import { Position as ESTreePosition, SourceLocation } from 'estree';

export type Coordinate = {
  line: number;
  column: number;
};

export type Position = {
  begin: Coordinate;
  end: Coordinate;
};

export type Location = {
  path: string;
  position: Position;
};

// A DeepSource compatible issue object.
export type Issue = {
  // Message describing the issue raised.
  issue_text: string;
  // Issue code in DeepSource format.
  issue_code: string;
  // file path and begin/end coordinates where the issue was raised.
  location: Location;
};

// A data type representing an issue raised by a Check.
export type ReportDescriptor = {
  // Description of the problem.
  message: string;
  // Location of the node where the issue is to be raised.
  loc: SourceLocation | ESTreePosition;
};

/**
 * Converts an ESTree location to a DeepSource position object.
 * @param loc The location attached to an ESTree node.
 * @returns A deepsource compatible Position object.
 */
export function convertPosition(loc: SourceLocation | Coordinate): Position {
  // a `loc` attached to an ESTree node can either be a `SourceLocation` object
  // or a `Position` object. However deepsource requires all location info
  // to be in a uniform format.

  // `loc` is a SourceLocation.
  if ((loc as SourceLocation).start) {
    loc = loc as SourceLocation;
    return {
      begin: {
        line: loc.start.line,
        column: loc.start.column,
      },

      end: {
        line: loc.end.line,
        column: loc.end.column,
      },
    };
  }

  loc = loc as Coordinate;
  return {
    begin: {
      line: loc.line,
      column: loc.column,
    },

    end: {
      line: loc.line,
      column: loc.column,
    },
  };
}

/**
 * Convert a report object into a deepsource compatible issue.
 * @param reportDesc The report object to generate an issue from.
 */
export function convertReport(reportDesc: ReportDescriptor, filePath: string): Issue {
  const position = convertPosition(reportDesc.loc);

  // TODO (injuly): Add issue codes too!
  const dsReport: Issue = {
    issue_text: reportDesc.message,
    issue_code: '404',
    location: {
      path: filePath,
      position,
    },
  };
  return dsReport;
}
