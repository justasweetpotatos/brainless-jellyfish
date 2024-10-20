import SuwaClient from "./bot";
import EventHandler from "./handler/EventHandler";
import ComponentManager from "./manager/ComponentManager";

const client = new SuwaClient("9819238012");
const eventHandler = new EventHandler(client);

eventHandler.loadEvents();