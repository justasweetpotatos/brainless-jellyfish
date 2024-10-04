import { ExecuteEventFunction } from "./ExecuteFunction";


export interface EventData {
    name: string;
    execute: ExecuteEventFunction;
}