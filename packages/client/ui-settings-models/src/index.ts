/** Host loader entry for the browser implementation exported from `./client`. */

import type { Context } from '@deepseek-ai/cordis'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { PROVIDER_ORDER_SETTINGS_NAMESPACE } from './provider-order-settings.ts'
import { ProviderOrderSettingsSchema } from './provider-order-schema.ts'

/**
 * Register the durable provider-order preference when a settings provider is
 * composed.
 * @param ctx - Host context that may acquire the settings service.
 */
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(
      settingsNamespace(PROVIDER_ORDER_SETTINGS_NAMESPACE),
      ProviderOrderSettingsSchema,
    )
  })
}
