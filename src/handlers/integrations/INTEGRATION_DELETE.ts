import { eventHandlers } from "../../bot.ts";

export function handleIntegrationDelete(data: DiscordPayload) {
  const {
    guild_id: guildId,
    application_id: applicationId,
    ...rest
  } = data.d as IntegrationDeleteEvent;

  eventHandlers.integrationDelete?.({
    ...rest,
    applicationId,
    guildId,
  });
}