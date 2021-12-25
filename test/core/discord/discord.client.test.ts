import { appContainer } from "@/app.container";
import App from "@/core/app/app";
import AppFactory from "@/core/app/app.factory";
import { TYPES } from "@/core/app/app.types";
import { coreContainer } from "@/core/core.container";
import DiscordHandler from "@/core/discord/discord.handler";
import { Client, Interaction } from "discord.js";

describe("Discord Client", () => {
  let application: App;

  beforeAll(async () => {
    application = await AppFactory.create(appContainer);
    await application.startDiscord(undefined);
  });

  it("should have registered handlers", async () => {
    const client = coreContainer.get<Client>(TYPES.CLIENT);
    const handlers = coreContainer.getAll(TYPES.DISCORD_HANDLER);
    const handler = handlers.find((h) => (h as any).event == "interactionCreate") as DiscordHandler;
    const mock = jest.fn();
    handler.handle = mock;
    client.emit("interactionCreate", {} as Interaction);

    expect(mock.mock.calls.length).toBe(1);
  });
});
