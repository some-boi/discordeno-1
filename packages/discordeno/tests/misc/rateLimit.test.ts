import { loadBot } from '../mod.js'
import { CACHED_COMMUNITY_GUILD_ID } from '../utils.js'

Deno.test({
  name: '[Misc] Rate Limit Test',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()
    const channel = await bot.helpers.createChannel(CACHED_COMMUNITY_GUILD_ID, { name: 'test' })
    await Promise.all(Array(10).map(() => bot.helpers.sendMessage(channel.id, { content: 'Rate Limit Test' })))
    await bot.helpers.deleteChannel(channel.id)
  }
})
