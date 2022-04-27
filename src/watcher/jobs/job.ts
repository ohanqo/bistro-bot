import { Page } from "puppeteer";
import PipelineContext from "../pipeline.context";

export interface Job {
  execute(page: Page, context: PipelineContext): Promise<any>
}