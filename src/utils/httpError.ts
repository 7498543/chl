export class HttpError extends Error {
  public readonly code: number;
  constructor(message: string, code = 400) {
    super(message);
    this.code = code;
  }
}
