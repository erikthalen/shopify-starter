import type { AlpineComponent } from 'alpinejs'

type ExampleComponent = () => {
  someData: boolean
  toggle: () => void
}

const example: AlpineComponent<ExampleComponent> = () => ({
  someData: true,

  toggle() {
    this.someData = !this.someData
  },
})

export default example
