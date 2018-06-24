
class CustomErrorBase extends Error {
  status = 500;
  errorCode = 0;

  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    this.stack = (new Error()).stack;
    this.status = status || 500;
  }
}

export class ArgumentError extends CustomErrorBase {
  constructor (message, status = 400) {
    super(message || 'Ein Parameter hat einen ungültigen Wert.', status);
    this.errorCode = 1000;
  }
}

export class InvalidOperationError extends CustomErrorBase {
  constructor (message, status = 400) {
    super(message || 'Die Methode kann aufgrund des Objektzustands nicht ausgeführt werden.', status);
    this.errorCode = 1010;
  }
}

export class DuplicateKeyError extends CustomErrorBase {
  constructor (message, status = 400) {
    super(message || 'Es wird versucht, einen doppelten Eintrag in der Datenbank einzufügen (Schlüsselfeld bereits vorhanden).', status);
    this.errorCode = 1020;
  }
}

export function getErrorJSON(errorResponse): { name: string, message: string, status: number } {
  let resultJson = { name: errorResponse.name, message: errorResponse.message, status: errorResponse.status };
  let error = errorResponse.error ? errorResponse.error : null;

  if (typeof error === 'string') {
    resultJson.message = error;

  } else if (typeof error === 'object') {
    if (error.name) { resultJson.name = error.name; }
    if (error.message) { resultJson.message = error.message; }
  }
  return resultJson;
}
