import { Client } from "discord.js";
import { Container } from "inversify";
import MessageScopeBuilder from "./ScopeBuilder/MessageScopeBuilder";
import AppState from "./AppState";
import { TYPES } from "./AppTypes";
import MemberAddScopeBuilder from "./ScopeBuilder/MemberAddScopeBuilder";
import Constant from "@/Domain/Constant";
import * as puppeteer from "puppeteer";
import TaskSchedulerScopeBuilder from "./ScopeBuilder/TaskSchedulerScopeBuilder";

const AppContainer = new Container({ defaultScope: "Singleton" });

AppContainer.bind(TYPES.CLIENT).toConstantValue(new Client());
AppContainer.bind(TYPES.STATE).to(AppState);
AppContainer.bind(TYPES.CONSTANT).to(Constant);
AppContainer.bind(TYPES.PREFIX).toConstantValue(process.env.COMMAND_PREFIX);
AppContainer.bind(TYPES.TOKEN).toConstantValue(process.env.DISCORD_CLIENT_ID);
AppContainer.bind(TYPES.BROWSER).toConstantValue(puppeteer.launch({ args: ["--no-sandbox"] }));
AppContainer.bind(TYPES.MESSAGE_SCOPE_BUILDER).to(MessageScopeBuilder);
AppContainer.bind(TYPES.MEMBER_ADD_SCOPE_BUILDER).to(MemberAddScopeBuilder);
AppContainer.bind(TYPES.TASK_SCHEDULER_SCOPE_BUILDER).to(TaskSchedulerScopeBuilder);

export { AppContainer };
