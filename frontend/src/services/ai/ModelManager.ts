import ModelRegistry
from "./ModelRegistry";

import ModelValidator
from "./ModelValidator";

export default class ModelManager {

  private initialized =
    false;

  async initialize() {

    if (
      this.initialized
    ) {
      return;
    }

    const model =
      ModelRegistry
      .getDefault();

    await ModelValidator
      .validate(model);

    this.initialized =
      true;

  }

  getModel() {

    return ModelRegistry
      .getDefault();

  }

}

