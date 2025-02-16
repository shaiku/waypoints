import {
   ModalFormData, MessageFormData
} from "@minecraft/server-ui";

export const waypointConfirmationMessage = new MessageFormData().button1("§2》§r§l %gui.yes").button2("§4》§r§l %gui.no");
export const WaypointAddMenu = new ModalFormData()
   .title("§l§c◤ %options.dev_addLabel ◢")
   .textField("§l§7• %options.name:", "")
   .dropdown("§l§7• %chat.settings.fontColor:",
      [
         "§0◆§r§l %color.black",
         "§1◆§r§l %color.dark_blue",
         "§2◆§r§l %color.dark_green",
         "§3◆§r§l %color.dark_aqua",
         "§4◆§r§l %color.dark_red",
         "§5◆§r§l %color.dark_purple",
         "§6◆§r§l %color.gold",
         "§7◆§r§l %color.gray",
         "§8◆§r§l %color.dark_gray",
         "§9◆§r§l %color.blue",
         "§a◆§r§l %color.green",
         "§b◆§r§l %color.aqua",
         "§c◆§r§l %color.red",
         "§d◆§r§l %color.light_purple",
         "§e◆§r§l %color.yellow",
         "§f◆§r§l %color.white"
      ]).dropdown("§l§7• %dressingRoom.skin_color_picker_title:",
         [
            "§0◆§r§l %item.fireworksCharge.black",
            "§1◆§r§l %item.fireworksCharge.blue",
            "§c◆§r§l %item.fireworksCharge.brown",
            "§3◆§r§l %item.fireworksCharge.cyan",
            "§8◆§r§l %item.fireworksCharge.gray",
            "§2◆§r§l %item.fireworksCharge.green",
            "§9◆§r§l %item.fireworksCharge.lightBlue",
            "§a◆§r§l %item.fireworksCharge.lime",
            "§5◆§r§l %item.fireworksCharge.magenta",
            "§6◆§r§l %item.fireworksCharge.orange",
            "§d◆§r§l %item.fireworksCharge.pink",
            "§5◆§r§l %item.fireworksCharge.purple",
            "§4◆§r§l %item.fireworksCharge.red",
            "§7◆§r§l %item.fireworksCharge.silver",
            "§f◆§r§l %item.fireworksCharge.white",
            "§e◆§r§l %item.fireworksCharge.yellow"
         ]).dropdown("§l§7• %chetty.option.name.set:",
            [
               "§2》§r§l %chetty.option.name.public",
               "§4》§r§l %chetty.option.name.private"
            ]);

export const waypoint_events = [
   [
      "§8》§r§l %gui.default",
      "§2》§r§l %structure_block.show",
      "§4》§r§l %gui.hide"
   ],
   [
      "§8◆§r§l %gui.default",
      "§0◆§r§l %item.fireworksCharge.black",
      "§1◆§r§l %item.fireworksCharge.blue",
      "§c◆§r§l %item.fireworksCharge.brown",
      "§3◆§r§l %item.fireworksCharge.cyan",
      "§8◆§r§l %item.fireworksCharge.gray",
      "§2◆§r§l %item.fireworksCharge.green",
      "§9◆§r§l %item.fireworksCharge.lightBlue",
      "§a◆§r§l %item.fireworksCharge.lime",
      "§5◆§r§l %item.fireworksCharge.magenta",
      "§6◆§r§l %item.fireworksCharge.orange",
      "§d◆§r§l %item.fireworksCharge.pink",
      "§5◆§r§l %item.fireworksCharge.purple",
      "§4◆§r§l %item.fireworksCharge.red",
      "§7◆§r§l %item.fireworksCharge.silver",
      "§f◆§r§l %item.fireworksCharge.white",
      "§e◆§r§l %item.fireworksCharge.yellow"
   ],
   [
      "§8◆§r§l %gui.default",
      "§0◆§r§l %color.black",
      "§1◆§r§l %color.dark_blue",
      "§2◆§r§l %color.dark_green",
      "§3◆§r§l %color.dark_aqua",
      "§4◆§r§l %color.dark_red",
      "§5◆§r§l %color.dark_purple",
      "§6◆§r§l %color.gold",
      "§7◆§r§l %color.gray",
      "§8◆§r§l %color.dark_gray",
      "§9◆§r§l %color.blue",
      "§a◆§r§l %color.green",
      "§b◆§r§l %color.aqua",
      "§c◆§r§l %color.red",
      "§d◆§r§l %color.light_purple",
      "§e◆§r§l %color.yellow",
      "§f◆§r§l %color.white"
   ]
];

