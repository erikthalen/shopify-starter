import "alpinejs"
import type { stores } from "./theme"

type ThemeStores = typeof stores

declare module "alpinejs" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Stores extends ThemeStores {}
}
