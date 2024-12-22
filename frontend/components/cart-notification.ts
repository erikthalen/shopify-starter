import { AlpineComponent } from 'alpinejs'

type CartNotificationComponent = () => {
  show: () => void
}

const cartNotification: AlpineComponent<CartNotificationComponent> = () => ({
  show() {},
})

export default cartNotification
