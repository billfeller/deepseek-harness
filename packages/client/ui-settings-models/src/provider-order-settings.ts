/** Host settings namespace and field for the Models page provider order. */
export const PROVIDER_ORDER_SETTINGS_NAMESPACE = 'ui-models'

/** Field holding provider route ids in the user's preferred order. */
export const PROVIDER_ORDER_SETTINGS_FIELD = 'providerOrder'

/** Durable provider-order preference. */
export interface ProviderOrderSettings {
  /** Route ids in preferred order; unlisted providers follow directory order. */
  providerOrder?: string[]
}
