/** Host schema for the Models page provider-order preference. */

import z from '@deepseek-ai/schemastery'
import type { ProviderOrderSettings } from './provider-order-settings.ts'

/** Durable settings section accepted by the Host and browser mirror. */
export const ProviderOrderSettingsSchema: z<ProviderOrderSettings> = z.object({
  providerOrder: z.array(z.string()).default([]),
})
