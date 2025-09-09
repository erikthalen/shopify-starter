import { defineComponent } from "~/utils/define"
import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel"

export default defineComponent(initSlide => ({
  emblaApiMain: undefined as EmblaCarouselType | undefined,
  emblaApiThumb: undefined as EmblaCarouselType | undefined,

  init() {
    this.emblaApiMain = EmblaCarousel(this.$refs.emblaViewport, {})

    this.emblaApiThumb = EmblaCarousel(this.$refs.emblaThumbsViewport, {
      containScroll: "keepSnaps",
      dragFree: true,
    })

    if (typeof initSlide === "number") {
      this.emblaApiMain.on("init", () =>
        setTimeout(() => this.emblaApiMain?.scrollTo(initSlide, true))
      )
    }

    const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(
      this.emblaApiMain,
      this.emblaApiThumb
    )
    const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(
      this.emblaApiMain,
      this.emblaApiThumb
    )

    const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
      this.emblaApiMain,
      this.$refs.emblaButtonPrev,
      this.$refs.emblaButtonNext
    )

    this.emblaApiMain
      .on("destroy", removeThumbBtnsClickHandlers)
      .on("destroy", removeToggleThumbBtnsActive)

    this.emblaApiThumb
      .on("destroy", removeThumbBtnsClickHandlers)
      .on("destroy", removeToggleThumbBtnsActive)

    this.emblaApiMain.on("destroy", removePrevNextBtnsClickHandlers)
  },

  destroy() {
    this.emblaApiMain?.destroy()
    this.emblaApiThumb?.destroy()
  },
}))

const addTogglePrevNextBtnsActive = (
  emblaApi: EmblaCarouselType,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement
): (() => void) => {
  const togglePrevNextBtnsState = (): void => {
    if (emblaApi.canScrollPrev()) prevBtn.removeAttribute("disabled")
    else prevBtn.setAttribute("disabled", "disabled")

    if (emblaApi.canScrollNext()) nextBtn.removeAttribute("disabled")
    else nextBtn.setAttribute("disabled", "disabled")
  }

  emblaApi
    .on("select", togglePrevNextBtnsState)
    .on("init", togglePrevNextBtnsState)
    .on("reInit", togglePrevNextBtnsState)

  return (): void => {
    prevBtn.removeAttribute("disabled")
    nextBtn.removeAttribute("disabled")
  }
}

function addPrevNextBtnsClickHandlers(
  emblaApi: EmblaCarouselType,
  prevBtn: HTMLElement,
  nextBtn: HTMLElement
): () => void {
  const scrollPrev = (): void => {
    emblaApi.scrollPrev()
  }
  const scrollNext = (): void => {
    emblaApi.scrollNext()
  }
  prevBtn.addEventListener("click", scrollPrev, false)
  nextBtn.addEventListener("click", scrollNext, false)

  const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
    emblaApi,
    prevBtn,
    nextBtn
  )

  return (): void => {
    removeTogglePrevNextBtnsActive()
    prevBtn.removeEventListener("click", scrollPrev, false)
    nextBtn.removeEventListener("click", scrollNext, false)
  }
}

function addThumbBtnsClickHandlers(
  emblaApiMain: EmblaCarouselType,
  emblaApiThumb: EmblaCarouselType
): () => void {
  const slidesThumbs = emblaApiThumb.slideNodes()

  const scrollToIndex = slidesThumbs.map(
    (_, index) => (): void => emblaApiMain.scrollTo(index)
  )

  slidesThumbs.forEach((slideNode, index) => {
    slideNode.addEventListener("click", scrollToIndex[index], false)
  })

  return (): void => {
    slidesThumbs.forEach((slideNode, index) => {
      slideNode.removeEventListener("click", scrollToIndex[index], false)
    })
  }
}

function addToggleThumbBtnsActive(
  emblaApiMain: EmblaCarouselType,
  emblaApiThumb: EmblaCarouselType
): () => void {
  const slidesThumbs = emblaApiThumb.slideNodes()

  const toggleThumbBtnsState = (): void => {
    emblaApiThumb.scrollTo(emblaApiMain.selectedScrollSnap())
    const previous = emblaApiMain.previousScrollSnap()
    const selected = emblaApiMain.selectedScrollSnap()
    slidesThumbs[previous].classList.remove("embla-thumbs__slide--selected")
    slidesThumbs[selected].classList.add("embla-thumbs__slide--selected")
  }

  emblaApiMain.on("select", toggleThumbBtnsState)
  emblaApiThumb.on("init", toggleThumbBtnsState)

  return (): void => {
    const selected = emblaApiMain.selectedScrollSnap()
    slidesThumbs[selected].classList.remove("embla-thumbs__slide--selected")
  }
}
