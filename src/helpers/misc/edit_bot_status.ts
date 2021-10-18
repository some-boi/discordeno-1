import {Bot} from "../../bot.ts";
import { DiscordGatewayOpcodes } from "../../types/codes/gateway_opcodes.ts";
import type { StatusUpdate } from "../../types/gateway/status_update.ts";

export function editBotStatus(bot: Bot, data: Omit<StatusUpdate, "afk" | "since">) {
  bot.ws.shards.forEach((shard) => {
    bot.events.debug("loop", `Running forEach loop in editBotStatus function.`);

    bot.ws.sendShardMessage(shard, {
      op: DiscordGatewayOpcodes.StatusUpdate,
      d: {
        since: null,
        afk: false,
        activities: data.activities,
        status: data.status
      },
    });
  });
}
