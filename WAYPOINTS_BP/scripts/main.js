export { enqueueTeleportation };

import { world, system } from "@minecraft/server";
import { waypoint_main_menu } from "./options"

var g_worldInitialized = false;
var g_pendingTeleportations = [];

function enqueueTeleportation(player, entity, tag) {
   g_pendingTeleportations.push(
      {
         'player': player,
         'dimId': entity.dimension.id,
         'loc': entity.location,
         'tag': tag
      }
   );
}

function teleportPlayer(player, dimId, loc) {
   player.teleport(loc,
      {
         dimension: world.getDimension(dimId),
         rotation: player.getRotation()
      });
}

world.beforeEvents.itemUse.subscribe(({ source, itemStack }) => {
   system.run(() => {
      // Get all entities with the type "chetty:waypoint_beam" in all dimensions
      const entities = new Array().concat(
         world.getDimension('overworld').getEntities({ type: "chetty:waypoint_beam" }),
         world.getDimension('nether').getEntities({ type: "chetty:waypoint_beam" }),
         world.getDimension('the end').getEntities({ type: "chetty:waypoint_beam" })
      )
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
            waypoint_main_menu(source, entities);
            break;
         default: undefined
            break;
      }
   });
});

world.afterEvents.playerSpawn.subscribe((event) => {
   const scoreObj = world.scoreboard.getObjective(`DB_sirob_wp_cfg`);
   if (typeof scoreObj !== "undefined") {
      const data = scoreObj.getParticipants().map(participant => {
         const displayName = participant.displayName;
         const key = displayName.slice(0, displayName.indexOf('_')).replaceAll('{#}', '_');
         const value = displayName.slice(displayName.indexOf('_') + 1);
         return { key, value };
      });
      const json = JSON.stringify(data);
      console.error(json);
   }

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

system.runInterval(() => {
   for (let i = 0; i < g_pendingTeleportations.length; i++) {
      const tp = g_pendingTeleportations[i];
      const plr = tp.player;
      let timeLeft = 3;
      plr.runCommandAsync(`camera "${plr.nameTag}" fade time 1 1 1`);
      plr.runCommandAsync(`effect "${plr.nameTag}" invisibility 1 1 true`);
      plr.runCommandAsync(`effect "${plr.nameTag}" resistance 1 255 true`);
      // WTF?
      //plr.teleport({ x: plr.location.x, y: plr.location.y, z: plr.location.z });
      // TODO:  We'll replace this nested timer and tag with a proper state machine
      if (!plr.hasTag("timer_set")) {
         plr.addTag("timer_set");
         const intervalID = system.runInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const formattedTime = `${minutes.toString().padStart(2, "0")}:` + `${seconds.toString().padStart(2, "0")}`;
            plr.runCommandAsync(`title "${plr.nameTag}" actionbar ${formattedTime}`);
            plr.playSound("random.orb");
            timeLeft--;
            if (timeLeft < 0) {
               // Remove the player from the pending teleportation list and adjust the index
               g_pendingTeleportations.splice(i, 1);
               i--;
               plr.removeTag("timer_set");
               system.clearRun(intervalID);
               //plr.runCommandAsync(`tp "${plr.nameTag}" @e[tag="${entityTag}"]`);
               teleportPlayer(plr, tp.dimId, tp.loc);
               // TODO:  Gotta make particles work
               plr.runCommandAsync(`event entity @e[tag="${tp.tag}"] particle`);
               plr.playSound("mob.shulker.teleport");
            }
         }, 20);
      }
   };
}, 1);

//system.beforeEvents.watchdogTerminate.subscribe((event) => {
//    event.cancel = true; // Cancel the world from closing down. This will terminate the script engine instead.
//});