import SuwaClient from "./bot";
import ComponentManager from "./manager/ComponentManager";

const client = new SuwaClient("9819238012");
const comMan = new ComponentManager(client);

try {
  comMan.loadButtonComponents();

  console.log(comMan.buttonCollection);

  const a = comMan.buttonCollection.first()?.customId;

  const b = 1923;
} catch (error) {
  console.log(error);
}
