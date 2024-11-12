import { EventEmitter } from "stream";
import { BaseModuleOptions } from "./interface/module";

export abstract class BaseModule<T extends BaseModuleOptions> extends EventEmitter {
  public readonly name: string;

  constructor(options: T) {
    super();
    this.name = options.name;
  }
}
