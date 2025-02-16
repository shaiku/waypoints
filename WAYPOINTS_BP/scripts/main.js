import { world, system } from "@minecraft/server";
import { waypoint_main_manu } from "./options"

world.beforeEvents.itemUse.subscribe(({ source, itemStack }) => {
   system.run(() => {
      const dimension = world.getDimension('overworld') || world.getDimension('nether') || world.getDimension('the end');
      const entities = Array.from(dimension.getEntities({ type: "chetty:waypoint_beam" }));
      const limit = 48;
      const jsonTag = {
         'limit': {
            'number': limit
         }
      };
      const tags = source.getTags();
      const limitTag = tags.find(tag => tag.startsWith('{"limit":'));
      if (!limitTag) {
         source.addTag(JSON.stringify(jsonTag));
      }
      switch (itemStack.typeId) {
         case "chetty:waypoint_book":
            waypoint_main_manu(source, entities);
            break;
         default: undefined
            break;
      }
   });
});

world.afterEvents.playerSpawn.subscribe((event) => {
   system.run(() => {
      if (!event.initialSpawn) return;
      const limit = 48;
      const jsonTag = {
         'limit': {
            'number': limit
         }
      };
      const tags = event.player.getTags();
      const limitTag = tags.find(tag => tag.startsWith('{"limit":'));
      if (!limitTag) {
         event.player.addTag(JSON.stringify(jsonTag));
         event.player.sendMessage(`§e[${event.player.nameTag}] §a` + "%chetty.message.limit.updated §c" + limit)
         return;
      }
   });
});

//system.beforeEvents.watchdogTerminate.subscribe((event) => {
//    event.cancel = true; // Cancel the world from closing down. This will terminate the script engine instead.
//});