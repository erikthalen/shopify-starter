import type { stores } from "./alpine"

type ThemeStores = typeof stores

declare module "alpinejs" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Stores extends ThemeStores {}
}
