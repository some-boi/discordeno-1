import { SnakeCaseProps } from "../util.ts";
import { DiscordVisibilityTypes } from "./visibility_types.ts";
import { Integration } from "../guilds/integration.ts";

export interface Connection {
  /** id of the connection account */
  id: string;
  /** The username of the connection account */
  name: string;
  /** The service of the connection (twitch, youtube) */
  type: string;
  /** Whether the connection is revoked */
  revoked?: boolean;
  /** An array of partial server integrations */
  integrations?: Integration[];
  /** Whether the connection is verified */
  verified: boolean;
  /** Whether friend sync is enabled for this connection */
  friendSync: boolean;
  /** Whether activities related to this connection will be shown in presence updates */
  showActivity: boolean;
  /** Visibility of this connection */
  visibility: DiscordVisibilityTypes;
}

/** https://discord.com/developers/docs/resources/user#connection-objecthttps://discord.com/developers/docs/resources/user#user-object-premium-types */
export type DiscordConnection = SnakeCaseProps<Connection>;
