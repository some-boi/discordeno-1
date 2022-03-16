import { Bot } from "../bot.ts";
import { DiscordSticker } from "../types/discord.ts";

export function transformSticker(bot: Bot, payload: DiscordSticker) {
  return {
    id: bot.utils.snowflakeToBigint(payload.id),
    packId: payload.pack_id ? bot.utils.snowflakeToBigint(payload.pack_id) : undefined,
    name: payload.name,
    description: payload.description,
    tags: payload.tags,
    type: payload.type,
    formatType: payload.format_type,
    available: payload.available,
    guildId: payload.guild_id ? bot.utils.snowflakeToBigint(payload.guild_id) : undefined,
    user: payload.user ? bot.transformers.user(bot, payload.user) : undefined,
    sortValue: payload.sort_value,
  };
}

export interface Sticker extends ReturnType<typeof transformSticker> {}