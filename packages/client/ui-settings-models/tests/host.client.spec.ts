import { Context } from '@deepseek-ai/cordis'
import { describe, expect, it } from 'vitest'
import { SettingsProvider, settingsNamespace, type SettingsNamespace } from '@deepseek-ai/dsh-settings'
import { apply } from '../src/index.ts'
import { PROVIDER_ORDER_SETTINGS_NAMESPACE } from '../src/provider-order-settings.ts'

class MemorySettings extends SettingsProvider {
  readonly writable = true
  protected load(): Promise<Record<string, unknown>> { return Promise.resolve({}) }
  protected persist(_ns: SettingsNamespace, _section: Record<string, unknown>): Promise<void> {
    return Promise.resolve()
  }
}

describe('ui-settings-models host', () => {
  it('registers the durable provider order and rejects values outside its schema', async () => {
    const ctx = new Context()
    await ctx.plugin(MemorySettings).await()
    const fiber = ctx.plugin({ apply })
    await fiber.await()

    const namespace = settingsNamespace(PROVIDER_ORDER_SETTINGS_NAMESPACE)
    expect(ctx.settings.get(namespace)).toEqual({ providerOrder: [] })
    await ctx.settings.update(namespace, { providerOrder: ['openai', 'custom-gateway'] })
    expect(ctx.settings.get(namespace)).toEqual({ providerOrder: ['openai', 'custom-gateway'] })
    await expect(ctx.settings.update(namespace, { providerOrder: ['openai', 1] })).rejects.toThrow()

    await fiber.dispose()
    expect(ctx.settings.describe().map(row => row.ns)).not.toContain(namespace)
  })

  it('does not require a settings provider', async () => {
    const ctx = new Context()
    await ctx.plugin({ apply }).await()
  })
})
