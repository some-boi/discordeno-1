import { ChannelTypes } from '../../mod.js'
import { assertEquals, assertExists } from '../deps.js'
import { loadBot } from '../mod.js'
import { CACHED_COMMUNITY_GUILD_ID } from '../utils.js'

Deno.test({
  name: '[channel] create a new category channel',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()
    const channel = await bot.helpers.createChannel(CACHED_COMMUNITY_GUILD_ID, {
      name: 'Discordeno-test',
      type: ChannelTypes.GuildCategory
    })

    // Assertions
    assertExists(channel)
    assertEquals(channel.type, ChannelTypes.GuildCategory)
    assertEquals(channel.topic, undefined)
    assertEquals(channel.bitrate, undefined)
    assertEquals(channel.userLimit, undefined)
    assertEquals(channel.rateLimitPerUser, undefined)
    assertEquals(channel.nsfw, undefined)
    assertEquals(channel.permissionOverwrites.length, 0)

    // Delete the channel once test is done
    await bot.helpers.deleteChannel(channel.id)
  }
})
