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

  // bindable elements
  drawer: {
    ["@window:navigation.window"]() {
      this.closeDrawer()
    },
  },

  drawerContent: {
    ["@click.outside"]() {
      this.closeDrawer()
    },
  },

  drawerCloseButton: {
    ["@click"]() {
      this.closeDrawer()
    },
  },
}))
