import { EventExecuteFunction } from "./functions";


export interface EventData {
    name: string;
    execute: EventExecuteFunction;
}