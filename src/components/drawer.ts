import { defineComponent } from "~/utils/define"

export default defineComponent(() => ({
  drawerOpen: false,

  openDrawer() {
    setTimeout(() => (this.drawerOpen = true))
  },

  closeDrawer() {
    this.drawerOpen = false
  },

  toggleDrawer() {
    if (this.drawerOpen) {
      this.closeDrawer()
    } else {
      this.openDrawer()
    }
  },
}))
