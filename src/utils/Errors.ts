export class AIError extends Error {

  constructor(
    message: string,
  ) {
    super(message);

    this.name = "AIError";
  }

}

export class RuntimeError extends AIError {

  constructor(
    message: string,
  ) {
    super(message);

    this.name = "RuntimeError";
  }

}

export class ModelLoadError extends AIError {

  constructor(
    message: string,
  ) {
    super(message);

    this.name = "ModelLoadError";
  }

}

export class GenerationError extends AIError {

  constructor(
    message: string,
  ) {
    super(message);

    this.name = "GenerationError";
  }

}

export class InitializationError extends AIError {

  constructor(
    message: string,
  ) {
    super(message);

    this.name = "InitializationError";
  }

}

