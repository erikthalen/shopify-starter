import { defineComponent } from "~/utils/define"
import {
  swupUpdateCache,
  type CacheUpdateStrategy,
} from "~/utils/swup-update-cache"

export default defineComponent(() => ({
  async updateCache(e: CustomEventInit) {
    if (!window.swup) return

    const targets: CacheUpdateStrategy = [
      { merge: "append", id: "paginated_items" },
      { merge: "replace", id: "pagination" },
    ]

    const newDocument = e.detail.raw

    swupUpdateCache(window.swup, newDocument, targets)
  },
}))
