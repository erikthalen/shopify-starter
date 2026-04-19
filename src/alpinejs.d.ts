import { alpineStores } from "./alpine"

type ThemeStores = typeof alpineStores

declare module "alpinejs" {
  interface Stores extends ThemeStores {}

  interface Alpine {
    store<T extends keyof ThemeStores>(name: T): ThemeStores[T]
    store<T extends keyof ThemeStores>(name: T, value: ThemeStores[T]): void
  }
}
