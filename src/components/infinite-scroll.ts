import { swup } from "~/swup"
import { defineComponent } from "~/utils/define"
import {
  swupUpdateCache,
  type CacheUpdateStrategy,
} from "~/utils/swup-update-cache"

export default defineComponent(() => ({
  async updateCache(e: CustomEventInit) {
    const newDocument = e.detail.raw

    const targets: CacheUpdateStrategy = [
      { merge: "append", id: "paginated_items" },
      { merge: "replace", id: "pagination" },
    ]

    swupUpdateCache(swup, newDocument, targets)
  },
}))
