import { assertExists, assertRejects } from '../deps.js'
import { loadBot } from '../mod.js'
import { CACHED_COMMUNITY_GUILD_ID } from '../utils.js'

Deno.test({
  name: '[webhook] delete a webhook',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()

    const channel = await bot.helpers.createChannel(CACHED_COMMUNITY_GUILD_ID, { name: 'deleteWebhook' })
    assertExists(channel?.id)

    const webhook = await bot.helpers.createWebhook(channel.id, { name: 'delete' })
    assertExists(webhook?.id)

    await bot.helpers.deleteWebhook(webhook.id)

    // Fetch the webhook to validate it was deleted
    await assertRejects(() => bot.helpers.getWebhook(webhook.id))

    await bot.helpers.deleteChannel(channel.id)
  }
})
