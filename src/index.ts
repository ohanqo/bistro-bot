import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { Client, GuildMember, Message } from "discord.js";
import { AppContainer } from "./App/AppContainer";
import { TYPES } from "./App/AppTypes";
import CommandHandler from "./Features/Command/CommandHandler";
import MessageScopeBuilder from "./App/ScopeBuilder/MessageScopeBuilder";
import MemberAddScopeBuilder from "./App/ScopeBuilder/MemberAddScopeBuilder";
import MemberAddedHandler from "./Features/MemberAdded/MemberAddedHandler";
import Constant from "./Domain/Constant";
import TaskSchedulerScopeBuilder from "./App/ScopeBuilder/TaskSchedulerScopeBuilder";
import DealabsScheduler from "./Features/TaskScheduler/Dealabs/DealabsScheduler";
import WebsiteWatcherScheduler from "./Features/TaskScheduler/WebsiteWatcher/WebsiteWatcherScheduler";

const token = AppContainer.get<string>(TYPES.TOKEN);
const prefix = AppContainer.get<string>(TYPES.PREFIX);
const client = AppContainer.get<Client>(TYPES.CLIENT);
const constant = AppContainer.get<Constant>(TYPES.CONSTANT);
const messageBuilder = AppContainer.get<MessageScopeBuilder>(TYPES.MESSAGE_SCOPE_BUILDER);
const memberAddBuilder = AppContainer.get<MemberAddScopeBuilder>(TYPES.MEMBER_ADD_SCOPE_BUILDER);
const schedulerBuilder = AppContainer.get<TaskSchedulerScopeBuilder>(
  TYPES.TASK_SCHEDULER_SCOPE_BUILDER,
);

client
  .on("message", async (message: Message) => {
    if (!message.content.startsWith(prefix)) return;
    (await messageBuilder.buildScope(message)).get<CommandHandler>(TYPES.COMMAND_HANDLER).handle();
  })
  .on("guildMemberAdd", (member: GuildMember) => {
    memberAddBuilder
      .buildScope(member)
      .get<MemberAddedHandler>(TYPES.MEMBER_ADDED_HANDLER)
      .handle();
  })
  .on("ready", async () => {
    const schedulerScope = await schedulerBuilder.buildScope();
    schedulerScope.get<DealabsScheduler>(TYPES.DEALABS_SCHEDULER).init();
    schedulerScope.get<WebsiteWatcherScheduler>(TYPES.WEBSITE_WATCHER_SCHEDULER).init();
    client.user?.setActivity(constant.BOT_ACTIVITY, { type: "PLAYING" });
  })
  .login(token)
  .then(() => console.log("🤖 — Bot is connected."))
  .catch((error) => console.error("💥 — An error as occurred: ", error));
