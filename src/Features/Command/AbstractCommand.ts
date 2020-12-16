import { injectable } from "inversify";
import Validator from "../Validator/Validator";

@injectable()
export default abstract class AbstractCommand {
  public keyword = "";
  public validators: Validator[] = [];

  async execute() {
    throw new Error("A command as not been implemented!");
  }

  async run() {
    const isValid = await this.performValidation();

    if (isValid) this.execute();
  }

  async performValidation(): Promise<Boolean> {
    const validationResults = await Promise.all(
      this.validators.map(async (validator) => await validator.validate()),
    );

    // If there is no validators for a command, return true
    return validationResults.every((result) => result === true);
  }
}
