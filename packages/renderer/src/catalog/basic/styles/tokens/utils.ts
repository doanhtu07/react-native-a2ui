import type { A2uiTokens } from './tokens'
import type { A2uiTokenOverrides } from './types'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

/**
 * Deep merges partial token overrides over a base token set. Nested plain
 * objects (e.g. `color`) merge key by key; scalars and non-plain values
 * replace. Never mutates either input.
 */
export function mergeTokens(
  base: A2uiTokens,
  overrides: A2uiTokenOverrides | undefined | null,
): A2uiTokens {
  if (!overrides) {
    return base
  }

  const merged: Record<string, unknown> = {
    ...(base as unknown as Record<string, unknown>),
  }

  for (const [key, override] of Object.entries(overrides)) {
    if (override === undefined) {
      continue
    }

    const current = (base as unknown as Record<string, unknown>)[key]

    merged[key] =
      isPlainObject(current) && isPlainObject(override)
        ? { ...current, ...override }
        : override
  }

  return merged as unknown as A2uiTokens
}
