import RNFS from "react-native-fs";

import {
  RegisteredModel,
} from "./ModelRegistry";

export default class ModelValidator {

  static async validate(
    model: RegisteredModel,
  ) {

    const exists =
      await RNFS.exists(
        model.path,
      );

    if (!exists) {

      throw new Error(
        `Model not found:\n${model.path}`,
      );

    }

    return true;

  }

}

