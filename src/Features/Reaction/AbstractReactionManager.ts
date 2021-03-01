import { injectable } from "inversify";

@injectable()
export default abstract class AbstractReactionManager {
  public async isMatchingReactionCharacteristics(): Promise<boolean> {
    throw new Error("A reaction handler has not been implemented!");
  }

  public async run() {
    throw new Error("A reaction handler has not been implemented!");
  }
}
