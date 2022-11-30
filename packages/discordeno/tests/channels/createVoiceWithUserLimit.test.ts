import { ChannelTypes } from '../../mod.js'
import { assertEquals, assertExists } from '../deps.js'
import { loadBot } from '../mod.js'
import { CACHED_COMMUNITY_GUILD_ID } from '../utils.js'

Deno.test({
  name: '[channel] create a new voice channel with a user limit',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()
    const channel = await bot.helpers.createChannel(CACHED_COMMUNITY_GUILD_ID, {
      name: 'discordeno-test',
      type: ChannelTypes.GuildVoice,
      userLimit: 32
    })

    // Assertions
    assertExists(channel)
    assertEquals(channel.type, ChannelTypes.GuildVoice)
    assertEquals(channel.topic, undefined)
    assertEquals(channel.bitrate, 64000)
    assertEquals(channel.userLimit, 32)
    assertEquals(channel.rateLimitPerUser, 0)
    assertEquals(channel.nsfw, false)
    assertEquals(channel.permissionOverwrites.length, 0)

    // Delete the channel once test is done
    await bot.helpers.deleteChannel(channel.id)
  }
})
