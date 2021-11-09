import type { GuildWidgetDetails } from "../../types/guilds/guild_widget_details.ts";
import type { Bot } from "../../bot.ts";

/** Returns the widget for the guild. */
export async function getWidget(bot: Bot, guildId: bigint) {
  return await bot.rest.runMethod<GuildWidgetDetails>(
    bot.rest,
    "get",
    `${bot.constants.endpoints.GUILD_WIDGET(guildId)}.json`
  );
}
