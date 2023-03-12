import logger from './logger.js'
import { delay } from './utils.js'

export class LeakyBucket implements LeakyBucketOptions {
  max: number
  refillInterval: number
  refillAmount: number

  /** The amount of requests that have been used up already. */
  used: number = 0
  /** The queue of requests to acquire an available request. Mapped by <shardId, resolve()> */
  queue: Array<{ shardId: number; resolve: (value: void | PromiseLike<void>) => void }> = []
  /** Whether or not the queue is already processing. */
  processing: boolean = false
  /** The timeout id for the timer to reduce the used amount by the refill amount.  */
  timeoutId?: NodeJS.Timeout
  /** The timestamp in milliseconds when the next refill is scheduled. */
  refillsAt?: number

  constructor(options?: LeakyBucketOptions) {
    this.max = options?.max ?? 1
    this.refillAmount = options?.refillAmount ? (options.refillAmount > this.max ? this.max : options.refillAmount) : 1
    this.refillInterval = options?.refillInterval ?? 5000
  }

  /** The amount of requests that still remain. */
  get remaining(): number {
    return this.max < this.used ? 0 : this.max - this.used
  }

  /** Begin processing the queue. */
  async processQueue(): Promise<void> {
    logger.debug('[Gateway] Processing queue')
    // There is already a queue that is processing
    if (this.processing) {
      logger.debug('[Gateway] Queue is already processing.')
      return
    }

    // Begin going through the queue.
    while (this.queue.length) {
      if (this.remaining) {
        logger.debug(`[LeakyBucket] Processing queue. Remaining: ${this.remaining} Length: ${this.queue.length}`)
        // Resolves the promise allowing the paused execution of this request to resolve and continue.
        this.queue.shift()?.resolve()
        // A request can be made
        this.used++

        // Create a new timeout for this request if none exists.
        if (!this.timeoutId) {
          logger.debug(`[LeakyBucket] Creating new timeout for leaky bucket requests.`)
          this.timeoutId = setTimeout(() => {
            logger.debug(`[LeakyBucket] Timeout for leaky bucket requests executed. Refilling bucket.`)
            // Lower the used amount by the refill amount
            this.used -= this.refillAmount
            // Reset the refillsAt timestamp since it just got refilled
            this.refillsAt = undefined
          }, this.refillInterval)
          // Set the time for when this refill will occur.
          this.refillsAt = Date.now() + this.refillInterval
        }
      }

      // Check if a refill is scheduled, since we have used up all available requests
      else if (this.refillsAt) {
        const now = Date.now()
        // If there is time left until next refill, just delay execution.
        if (this.refillsAt > now) {
          logger.debug(`[LeakyBucket] Delaying execution of leaky bucket requests for ${this.refillsAt - now}ms`)
          await delay(this.refillsAt - now)
          logger.debug(`[LeakyBucket] Resuming execution`)
        }
      }
    }

    // Loop has ended mark false so it can restart later when needed
    this.processing = false
  }

  /** Pauses the execution until the request is available to be made. */
  async acquire(shardId: number, highPriority?: boolean): Promise<void> {
    return await new Promise((resolve) => {
      // High priority requests get added to the start of the queue
      if (highPriority) this.queue.unshift({ shardId, resolve })
      // All other requests get pushed to the end.
      else this.queue.push({ shardId, resolve })

      // Each request should trigger the queue to be processesd.
      void this.processQueue()
    })
  }
}

export interface LeakyBucketOptions {
  /**
   * Max requests allowed at once.
   * @default 1
   */
  max?: number
  /**
   * Interval in milliseconds between refills.
   * @default 5000
   */
  refillInterval?: number
  /**
   * Amount of requests to refill at each interval.
   * @default 1
   */
  refillAmount?: number
}
