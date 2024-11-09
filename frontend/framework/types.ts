type Refs = {
  [key: string]: HTMLElement[]
}

export type CleanupFunction =
  | (void | (() => void) | (() => void)[])
  | Promise<void | (() => void) | (() => void)[]>

export type Component = (
  ref: Refs,
  opts?: {
    // used to remove event listeners on page shift
    signal?: AbortSignal
  }
) => CleanupFunction
