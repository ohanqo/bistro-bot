import { TYPES } from "@/App/AppTypes";
import { inject, injectable } from "inversify";
import ReactionManagerFactory from "./ReactionManagerFactory";

@injectable()
export default class ReactionHandler {
  constructor(
    @inject(TYPES.REACTION_MANAGER_FACTORY)
    private managerFactory: ReactionManagerFactory,
  ) {}

  public async handle() {
    try {
      await (await this.managerFactory.make())?.run();
    } catch (error) {
      console.error(error);
    }
  }
}
