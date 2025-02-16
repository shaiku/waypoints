import {
   world,
   system
} from "@minecraft/server";
import {
   ActionFormData,
   ModalFormData
} from "@minecraft/server-ui";
import {
   WaypointAddMenu,
   waypointConfirmationMessage,
   waypoint_events
} from "./forms";
import {
   message,
   text4,
   text5,
   text6,
   text7,
   text,
   generateRandomName
} from "./functions";

let entityTag;

export function waypoint_main_manu(source, entities) {
   const waypointTags = {
      "waypointName": [],
      "waypointOwner": []
   };
   source.getTags().forEach(tag => {
      if (tag.startsWith('{"player":{')) {
         const waypointData = JSON.parse(tag);
         waypointTags["waypointName"].push(waypointData['player']['Name']);
      }
   });
   const WaypointMainMenu = new ActionFormData()
      .title("§l§c◤ %deathScreen.quit ◢")
      .body(`§e◈ %chetty.body.title.list:§r§c ${waypointTags["waypointName"].length}`)
      .button(`§0§l%menu.options§r\n${text4}`, "textures/icon/ic_options")
      .button(`§0§l%chetty.option.name.show.all§r\n${text4}`, "textures/icon/ic_show_all");
   waypointTags["waypointName"].forEach(waypointName => WaypointMainMenu.button(`§0§l${waypointName}§r\n${text5}`, "textures/icon/ic_waypoint"));
   WaypointMainMenu.show(source).then(({ selection }) => {
      try {
         switch (selection) {
            case 0:
               waypoints_menu_options(source, entities);
               break;
            case 1:
               waypoint_menu_show_all(source, entities);
               break;
            default:
               const entity = entities.find(entity => entity.hasTag(waypointTags['waypointName'][selection - 2]));
               if (entity) {
                  const jsonTag = {
                     'teleport': {
                        'location': waypointTags['waypointName'][selection - 2]
                     }
                  };
                  source.addTag("is_teleported");
                  source.addTag(JSON.stringify(jsonTag));
               }
               break;
         }
      } catch (error) { }
   });
}

function waypoints_menu_options(source, entities) {
   const waypointTags = {
      "waypointName": [],
      "waypointOwner": []
   };
   source.getTags().forEach(tag => {
      if (tag.startsWith('{"player":{')) {
         const waypointData = JSON.parse(tag);
         waypointTags["waypointName"].push(waypointData['player']['Name']);
      }
   });
   const waypoint_menu_options = new ActionFormData()
      .title("§l§c◤ %menu.options ◢")
      .button(`§l§0%chetty.option.name.new§r\n${text4}`, "textures/icon/ic_plus")
      .button(`§l§0%chetty.option.name.delete§r\n${text4}`, "textures/icon/ic_trash")
      .button(`§l§0%chetty.option.name.edit§r\n${text4}`, "textures/icon/ic_edit");
   const tags = source.getTags();
   let limitTag = tags.find(tag => tag.startsWith('{"limit":'));
   let limit;
   if (true || source.hasTag("isOP")) {
      waypoint_menu_options.button(`§0§l%permissions.level.operator§r\n${text4}`, "textures/icon/ic_op");
   }
   if (limitTag) {
      let jsonTag = JSON.parse(limitTag);
      limit = jsonTag.limit.number;
   }
   waypoint_menu_options.body(`${text}\n%jigsaw.title.name §b${source.nameTag}  §r⋮⋮  §rWaypoints: §9${waypointTags['waypointName'].length}/${limit}§r\n${text}`);
   waypoint_menu_options.show(source).then(({ selection }) => {
      switch (selection) {
         case 0:
            if (waypointTags['waypointName'].length < limit) {
               waypoint_menu_add_option(source, entities);
            } else {
               message(source, "§c%chetty.message.limit.reached");
            }
            break;
         case 1:
            waypoint_menu_remove_option(source, entities);
            break;
         case 2:
            waypoint_menu_edit_option(source, entities);
            break;
         case 3:
            waypoint_menu_operator_option(source, entities);
            break;
         default:
            waypoint_main_manu(source, entities);
            break
      }
   });
}

function waypoint_menu_show_all(source, entities) {
   const waypointTags = {
      "waypointName": [],
      "waypointOwner": []
   };
   entities.forEach(entity => {
      entity.getTags().forEach(tag => {
         if (tag.startsWith('{"waypoint":{') && !tag.startsWith('"')) {
            const waypointData = JSON.parse(tag);
            waypointTags["waypointName"].push(waypointData['waypoint']['Name']);
         }
      });
   });
   const waypointShowAll = new ActionFormData()
      .title("§l§c◤ %chetty.option.title.show.all ◢")
      .body(`§e◈ %chetty.body.title.list:§r§c ${waypointTags["waypointName"].length}`);
   waypointTags["waypointName"].forEach(waypointName => waypointShowAll.button(`§0§l${waypointName}§r\n${text5}`, "textures/icon/ic_waypoint"));
   if (!waypointTags['waypointName'].length) {
      message(source, "§c%chetty.message.found.marked");
      return;
   }
   waypointShowAll.show(source).then(({ selection, canceled }) => {
      if (!canceled) {
         const jsonTag = {
            'teleport': {
               'location': waypointTags['waypointName'][selection]
            }
         };
         source.addTag("is_teleported");
         source.addTag(JSON.stringify(jsonTag));
      } else {
         waypoint_main_manu(source, entities);
      }
   });
}

function waypoint_menu_add_option(source, entities) {
   WaypointAddMenu.show(source).then(({ formValues, canceled }) => {
      if (canceled === false) {
         if (formValues[0].trim() === "") {
            formValues[0] = generateRandomName();
         }
         const entityFound = entities.find(entity => entity.hasTag(formValues[0]));
         if (entityFound) {
            message(source, "§c%chetty.message.name.exists");
         } else {
            const colors = ["§0", "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8", "§9", "§a", "§b", "§c", "§d", "§e", "§f"];
            waypoint_menu_add_0(source, formValues[2], formValues[3], formValues[0], colors[formValues[1]]);
         }
      } else {
         waypoints_menu_options(source, entities);
      }
   });
}

function waypoint_menu_add_0(a, b, c, d, e) {
   const jsonDBP = {
      'player': {
         'Name': d,
         'Owner': a.nameTag
      }
   };
   const jsonDBW = {
      'waypoint': {
         'Name': d,
         'Owner': a.nameTag
      }
   };
   const colors = ["black", "blue", "brown", "cyan", "gray", "green", "light_blue", "lime", "magenta", "orange", "pink", "purple", "red", "light_gray", "white", "yellow"];
   const actions = {
      0: () => waypoint_menu_add_1(a, d, jsonDBP, jsonDBW, e, `add_${colors[b]}`),
      1: () => waypoint_menu_add_1(a, d, jsonDBP, "", e, `add_${colors[b]}`)
   };
   if (actions.hasOwnProperty(c)) {
      actions[c]();
   }
}

function waypoint_menu_add_1(a, b, c, d, e, f) {
   const position = a.location;
   const { x, y, z } = position;
   const waypoint = a.dimension.spawnEntity("chetty:waypoint_beam", { x, y, z });
   waypoint.runCommandAsync(`tp @s ${Math.round(x)} ${Math.round(y)} ${Math.round(z)}`);
   waypoint.nameTag = `§l${e} « ${b} »`;
   waypoint.addTag(JSON.stringify(d));
   waypoint.addTag(b);
   a.addTag(JSON.stringify(c)); waypoint.triggerEvent(f);
   message(a, `§a%chetty.ui.added [ ${b} ] %chetty.ui.list1`);
}

function waypoint_menu_remove_option(source, entities) {
   const waypointTags = {
      "waypointName": [],
      "waypointOwner": []
   };
   source.getTags().forEach(tag => {
      if (tag.startsWith('{"player":{')) {
         const waypointData = JSON.parse(tag); waypointTags["waypointName"].push(waypointData['player']['Name']);
      }
   });
   const WaypointRemoveMenu = new ActionFormData()
      .title("§l§c◤ %gui.delete ◢")
      .body(`§e◈ %chetty.body.title.list:§r§c ${waypointTags["waypointName"].length}`);
   waypointTags["waypointName"].forEach(waypointName => WaypointRemoveMenu.button(`§0§l${waypointName}§r\n${text6}`, "textures/icon/ic_trash"));
   if (!waypointTags['waypointName'].length) {
      message(source, "§c%chetty.message.found.delete");
      return;
   }
   WaypointRemoveMenu.show(source).then(({ selection, canceled }) => {
      waypointConfirmationMessage.body("%xbl.signOut.message2\n\n%gui.delete: §a" + waypointTags['waypointName'][selection]);
      const findJsonDB = {
         'player': {
            'Name': waypointTags['waypointName'][selection],
            'Owner': source.nameTag
         }
      };
      if (!canceled) {
         entities.forEach(entity => {
            if (entity.hasTag(waypointTags['waypointName'][selection])) {
               waypointConfirmationMessage.show(source).then(({ selection }) => {
                  if (selection === 0) {
                     message(source, `§c%chetty.ui.removed [ ${waypointTags['waypointName'][selection]} ] %chetty.ui.list2`);
                     entity.triggerEvent("waypoint_remove");
                     source.removeTag(JSON.stringify(findJsonDB));
                     entities = entities.filter(e => e !== entity);
                  }
                  waypoint_menu_remove_option(source, entities);
               });
            }
         });
      } else {
         waypoints_menu_options(source, entities);
      }
   });
}

function waypoint_menu_edit_option(source, entities) {
   const waypointTags = {
      "waypointName": [],
      "waypointOwner": []
   };
   source.getTags().forEach(tag => {
      if (tag.startsWith('{"player":{')) {
         const waypointData = JSON.parse(tag);
         waypointTags["waypointName"].push(waypointData['player']['Name']);
         waypointTags["waypointOwner"].push(waypointData['player']['Owner']);
      }
   });
   const WaypointSelectToEditMenu = new ActionFormData()
      .title("§l§c◤ %gui.edit ◢")
      .body(`§e◈ %chetty.body.title.list:§r§c ${waypointTags["waypointName"].length}`);
   waypointTags["waypointName"].forEach(waypointName => WaypointSelectToEditMenu.button(`§0§l${waypointName}§r\n${text7}`, "textures/icon/ic_edit"));
   if (!waypointTags['waypointName'].length) {
      message(source, "§c%chetty.message.found.edit");
      return;
   }
   WaypointSelectToEditMenu.show(source).then(({ selection, canceled }) => {
      if (!canceled) {
         entities.forEach(entity => {
            if (entity.hasTag(`${waypointTags['waypointName'][selection]}`)) {
               const waypoint_name = waypointTags['waypointName'][selection];
               new ModalFormData().title("§l§c◤ %menu.settings ◢")
                  .textField("§l§7• %options.name:", `${waypoint_name}`)
                  .dropdown("§l§7• %action.interact.name:", waypoint_events[0])
                  .dropdown("§l§7• %chat.settings.fontColor:", waypoint_events[2])
                  .dropdown("§l§7• %chetty.option.name.beam:", waypoint_events[0])
                  .dropdown("§l§7• %chat.settings.color:", waypoint_events[1])
                  .show(source).then(({ formValues, canceled }) => {
                     if (!canceled) {
                        menu_edit_waypoint_0(source, entities, entity, formValues, waypoint_name);
                     } else {
                        waypoint_menu_edit_option(source, entities);
                     }
                  }
                  );
            }
         });
      } else {
         waypoints_menu_options(source, entities);
      }
   });
}

function menu_edit_waypoint_0(source, entities, entity, formValues, name) {
   const WaypointColors = ["", "add_black", "add_blue", "add_brown", "add_cyan", "add_gray", "add_green", "add_light_blue", "add_lime", "add_magenta", "add_orange", "add_pink", "add_purple", "add_red", "add_light_gray", "add_white", "add_yellow"];
   const TextColors = ["", "§0", "§1", "§2", "§3", "§4", "§5", "§6", "§7", "§8", "§9", "§a", "§b", "§c", "§d", "§e", "§f"];
   const WaypointBeamEvents = ["", "set_show_beam", "set_hide_beam"];
   const NameEvents = ["", "set_show_name", "set_hide_name"];
   const findJsonDB = {
      'waypoint': {
         'Name': name,
         'Owner': source.nameTag
      }
   };
   const findJsonDB1 = {
      'player': {
         'Name': name,
         'Owner': source.nameTag
      }
   };
   const jsonDBW = {
      'waypoint': {
         'Name': formValues[0],
         'Owner': source.nameTag
      }
   };
   const jsonDBP = {
      'player': {
         'Name': formValues[0],
         'Owner': source.nameTag
      }
   };
   if (formValues[0].trim() !== "") {
      entity.nameTag = entity.nameTag.replace(name, formValues[0]);
      entity.removeTag(name);
      entity.removeTag(JSON.stringify(findJsonDB));
      source.removeTag(JSON.stringify(findJsonDB1));
      entity.addTag(formValues[0]);
      entity.addTag(JSON.stringify(jsonDBW));
      source.addTag(JSON.stringify(jsonDBP));
   };
   if (formValues[2] !== 0 && formValues[0].trim() !== "") {
      entity.nameTag = `§l${TextColors[formValues[2]]} « ${formValues[0]} »`;
      entity.removeTag(name);
      entity.removeTag(JSON.stringify(findJsonDB));
      source.removeTag(JSON.stringify(findJsonDB1));
      entity.addTag(formValues[0]);
      entity.addTag(JSON.stringify(jsonDBW));
      source.addTag(JSON.stringify(jsonDBP));
   };
   if (formValues[2] !== 0 && formValues[0].trim() === "") {
      entity.nameTag = `§l${TextColors[formValues[2]]} « ${name} »`;;
   }
   entity.triggerEvent(NameEvents[formValues[1]]);
   entity.triggerEvent(WaypointBeamEvents[formValues[3]]);
   entity.triggerEvent(WaypointColors[formValues[4]]);
   waypoint_menu_edit_option(source, entities)
}

function waypoint_menu_operator_option(source, entities) {
   const operatorOptions = new ActionFormData()
      .title("§l§c◤ %permissions.level.operator ◢")
      .body("§e◈ %emote_wheel.gamepad_helper.select:")
      .button(`§l§0%chetty.option.name.delete§r\n${text4}`, "textures/icon/ic_trash")
      .button(`§l§0%chetty.option.name.limit§r\n${text4}`, "textures/icon/ic_edit")
      .button(`§l§0%chetty.option.name.show.private§r\n${text4}`, "textures/icon/ic_show_all");
   operatorOptions.show(source).then(({ selection, canceled }) => {
      switch (selection) {
         case 0:
            waypoint_menu_operator_option_0(source, entities);
            break;
         case 1:
            waypoint_menu_operator_option_1(source);
            break;
         case 2:
            waypoint_menu_operator_option_2(source, entities);
            break;
         default: waypoints_menu_options(source, entities);
            break;
      }
   });
}

function waypoint_menu_operator_option_0(source, entities) {
   const waypointNames = [];
   entities.forEach(entity => {
      entity.getTags().forEach(name => {
         if (!name.startsWith('{"player":{') && !name.startsWith('{"waypoint":{') && !name.startsWith('"')) {
            waypointNames.push(name);
         }
      });
   });
   const operatorRemoveMenu = new ActionFormData()
      .title("§l§c◤ %gui.delete ◢")
      .body(`§e◈ %chetty.body.title.list:§r§c ${waypointNames.length}`);
   waypointNames.forEach(name => operatorRemoveMenu.button(`§0§l${name}§r\n${text6}`, "textures/icon/ic_trash"));
   if (!waypointNames.length) {
      message(source, "§c%chetty.message.found.delete");
      return;
   }
   operatorRemoveMenu.show(source).then(({ selection, canceled }) => {
      waypointConfirmationMessage.body("%xbl.signOut.message2\n\n§c%gui.delete: §a" + waypointNames[selection]);
      if (!canceled) {
         const entity = entities.find(entity => entity.hasTag(`${waypointNames[selection]}`));
         if (entity) {
            waypointConfirmationMessage.show(source).then(({ selection }) => {
               if (selection === 0) {
                  entity.triggerEvent("waypoint_remove");
                  message(source, "§c%chetty.message.location.deleted");
                  entities = entities.filter(e => e !== entity);
               }
               waypoint_menu_operator_option_0(source, entities);
            });
         }
      } else {
         waypoint_menu_operator_option(source, entities);
      }
   });
}

function waypoint_menu_operator_option_1(source, entities) {
   const playerNames = [];
   world.getAllPlayers().forEach(player => playerNames.push(player.nameTag));
   const limitarMenu = new ModalFormData()
      .title("§l§c◤ %chetty.option.name.limit ◢")
      .dropdown("§l§7• %chetty.option.name.select.player", playerNames)
      .slider("§l§7• %chetty.option.name.select.new.limit", 0, 128, 1, 48);
   limitarMenu.show(source).then(({ formValues, canceled }) => {
      if (!canceled) {
         const selectedPlayerName = playerNames[formValues[0]];
         const limit = formValues[1];
         world.getPlayers().forEach(target => {
            if (target.name === selectedPlayerName) {
               const tags = target.getTags();
               const limitTag = tags.find(tag => tag.startsWith('{"limit":'));
               if (limitTag) {
                  let jsonTag = JSON.parse(limitTag);
                  jsonTag.limit.number = limit;
                  target.removeTag(limitTag);
                  target.addTag(JSON.stringify(jsonTag));
                  message(target, `§a%chetty.message.limit.updated ${limit}`);
                  waypoint_menu_operator_option_1(source);
               }
            }
         });
      } else {
         waypoint_menu_operator_option(source, entities);
      }
   });
}

function waypoint_menu_operator_option_2(source, entities) {
   const hiddenNames = [];
   entities.forEach(entity => {
      let hasWaypointTag = entity.getTags().some(tag => tag.startsWith('{"waypoint":{'));
      if (!hasWaypointTag) {
         entity.getTags().forEach(tag => {
            if (!tag.startsWith('{"player":{') && !tag.startsWith('"')) {
               hiddenNames.push(tag);
            }
         });
      }
   });
   const waypointShowAlls = new ActionFormData()
      .title("§l§c◤ %chetty.option.title.show.private ◢")
      .body(`§e◈ %chetty.body.title.list:§r§c ${hiddenNames.length}`);
   hiddenNames.forEach(name => waypointShowAlls.button(`§0§l${name}§r\n${text5}`, "textures/icon/ic_waypoint"));
   if (!hiddenNames.length) {
      message(source, "§c%chetty.message.found.private");
      return;
   }
   waypointShowAlls.show(source).then(({ selection, canceled }) => {
      if (!canceled) {
         const jsonTag = {
            'teleport': {
               'location': waypointTags['waypointName'][selection]
            }
         };
         source.addTag("is_teleported");
         source.addTag(JSON.stringify(jsonTag));
      } else { waypoint_menu_operator_option(source, entities); }
   });
}

system.runInterval(() => {
   world.getAllPlayers().forEach(plr => {
      if (!plr.hasTag("is_teleported")) return;
      plr.getTags().forEach(tag => {
         if (tag.startsWith('{"teleport":{')) {
            const teleportData = JSON.parse(tag);
            entityTag = teleportData['teleport']['location'];
         }
      });
      let timeLeft = 3;
      plr.runCommandAsync(`camera "${plr.nameTag}" fade time 1 1 1`);
      plr.runCommandAsync(`effect "${plr.nameTag}" invisibility 1 1 true`);
      plr.runCommandAsync(`effect "${plr.nameTag}" resistance 1 255 true`);
      plr.teleport({ x: plr.location.x, y: plr.location.y, z: plr.location.z });
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
               const findJsonTag = { 'teleport': { 'location': entityTag } };
               plr.removeTag("timer_set");
               system.clearRun(intervalID);
               plr.removeTag("is_teleported");
               plr.runCommandAsync(`tp "${plr.nameTag}" @e[tag="${entityTag}"]`);
               plr.runCommandAsync(`event entity @e[tag="${entityTag}"] particle`);
               plr.removeTag(JSON.stringify(findJsonTag));
               plr.playSound("mob.shulker.teleport");
            }
         }, 20);
      }
   });
}, 0);