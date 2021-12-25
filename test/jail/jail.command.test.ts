import { appContainer } from "@/app.container";
import App from "@/core/app/app";
import AppFactory from "@/core/app/app.factory";
import { TYPES } from "@/core/app/app.types";
import { coreContainer } from "@/core/core.container";
import JailCommand from "@/jail/jail.command";

describe("Jail Command", () => {
  let application: App;

  beforeAll(async () => {
    application = await AppFactory.create(appContainer);
  });

  it("keyword & guards should be defined", () => {
    const jailCommand = coreContainer.get<JailCommand>(TYPES.COMMAND);
    expect(jailCommand.keyword).toEqual("jail");
    expect(jailCommand.guards.length).toBeGreaterThan(0);
  });
});
