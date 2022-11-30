import { assertEquals } from '../deps.js'
import { loadBot } from '../mod.js'

Deno.test({
  name: '[stickers] Get sticker',
  ignore: process.env.TEST_ENV === 'UNIT',
  async fn(t) {
    const bot = loadBot()
    const sticker = await bot.helpers.getSticker(749054660769218631n)
    assertEquals(sticker.name, 'Wave')
  }
})
