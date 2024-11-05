<script lang="ts" setup>
import type { Swiper as SwiperClass } from 'swiper/types'
import type { LocalImagePath, LocalImageLoader } from '@/types'
import { ref, onMounted, onBeforeMount } from 'vue'
import { until } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import BaseSvgIcon from '@/components/Base/BaseSvgIcon.vue'
import { getLocalImageLoaders } from '@/utils/getLocalImageLoaders'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

const props = defineProps<{
  imagePaths: string[]
}>()

const MAX_SLIDES_PER_VIEW = 8
const contentSwiper = ref<SwiperClass | null>(null)
const thumbsSwiper = ref<SwiperClass | null>(null)
const selectedIndex = ref<number>(0)
const allImages = ref<string[]>([])

const imageLoadersMap: Map<LocalImagePath, LocalImageLoader> =
  getLocalImageLoaders(props.imagePaths, {
    isStrictExtension: false
  })

const allImagesPaths: Array<string> = []
for (const imageLoader of imageLoadersMap.values()) {
  allImagesPaths.push(imageLoader.absolutePath)
}

const setContentSwiper = (swiper: SwiperClass) => {
  contentSwiper.value = swiper
}
const setThumbsSwiper = (swiper: SwiperClass) => {
  thumbsSwiper.value = swiper
}
const setSelectedIndex = (swiper: SwiperClass) => {
  selectedIndex.value = swiper.realIndex
}

const updateThumbsIndex = async (swiper: SwiperClass) => {
  await until(contentSwiper).not.toBe(null)
  await until(thumbsSwiper).not.toBe(null)

  swiper.thumbs.swiper.slideToLoop(swiper.realIndex)
}

const onIndexChange = (swiper: SwiperClass) => {
  setSelectedIndex(swiper)
  updateThumbsIndex(swiper)
}

const preloadInitialImages = async () => {
  const preloadImages: string[] = []
  let mapIndex = 0
  for (const imageLoader of imageLoadersMap.values()) {
    if (mapIndex >= MAX_SLIDES_PER_VIEW) break
    preloadImages.push((await imageLoader.importFn()).default)
    mapIndex++
  }
  return preloadImages
}

// await preloadInitialImages()

const loadRemainingImages = async () => {
  const remainingImages: string[] = []
  let mapIndex = 0
  for (const imageLoader of imageLoadersMap.values()) {
    if (mapIndex >= MAX_SLIDES_PER_VIEW) {
      remainingImages.push((await imageLoader.importFn()).default)
    }
    mapIndex++
  }
  return remainingImages
}

onBeforeMount(preloadInitialImages)
onMounted(async () => {
  const preloadedImages = await preloadInitialImages()
  allImages.value = [...preloadedImages]
  const remainingImages = await loadRemainingImages()
  allImages.value = [...preloadedImages, ...remainingImages]
  // await fixSlideToClickedSlide()
})

/* watch(allImages, () => {
  contentSwiper.value?.update()
  thumbsSwiper.value?.update()
}) */

defineExpose({
  swiper: contentSwiper
})
// https://github.com/nolimits4web/swiper/issues/6358
/* const fixSlideToClickedSlide = async () => {
  await Promise.all([
    until(contentSwiper).not.toBeNull(),
    until(thumbsSwiper).not.toBeNull()
  ])

  contentSwiper.value!.thumbs.swiper.params.slideToClickedSlide = true
  contentSwiper.value!.thumbs.swiper.update()
} */

/* onMounted(async () => {
await fixSlideToClickedSlide()
}) */
// custom func, swiper glitches sometimes
const slideToThis = (e: Event) => {
  const imgHref = (e.target as HTMLElement).getAttribute('src')
  const foundPath = allImagesPaths.find((path) => path === imgHref)
  if (!foundPath) return
  const slideToIndex = allImagesPaths.indexOf(foundPath)
  if (slideToIndex < 0) return
  contentSwiper.value?.slideTo(slideToIndex)
}

const isLoading = ref(Array(allImagesPaths.length).fill(true))
</script>
<template>
  <div class="base-carousel-block">
    <div class="base-carousel-block__content">
      <swiper
        :modules="[Navigation, Thumbs]"
        :navigation="{
          nextEl: '.base-carousel__next',
          prevEl: '.base-carousel__prev'
        }"
        :slidesPerView="1"
        :spaceBetween="10"
        :speed="700"
        :lazy="true"
        :thumbs="{ swiper: thumbsSwiper }"
        :wrapperClass="'base-carousel-block__wrap base-carousel-block__wrap--content'"
        class="base-carousel-block__carousel base-carousel base-carousel--content"
        @realIndexChange="onIndexChange"
        @swiper="setContentSwiper"
      >
        <swiper-slide
          v-for="(image, index) in allImages"
          :key="'content ' + index"
          :class="[
            'base-carousel__slide base-carousel-slide base-carousel-slide--content',
            { 'base-carousel-slide--selected': index === selectedIndex }
          ]"
        >
          <img
            v-if="isLoading[index]"
            class="swiper-lazy-preloader"
            :src="'img/placeholder.png'"
            alt="carousel slide placeholder"
          />
          <img
            :src="image"
            :alt="'Slide ' + (index + 1)"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="base-carousel-slide__img swiper-lazy"
            @load="isLoading[index] = false"
          />
        </swiper-slide>
      </swiper>
      <button class="base-carousel__prev">
        <BaseSvgIcon name="arrow" />
      </button>
      <button class="base-carousel__next">
        <BaseSvgIcon name="arrow" />
      </button>
    </div>
    <div class="base-carousel-block__thumbs">
      <swiper
        :centeredSlides="true"
        :centeredSlidesBounds="true"
        :freeMode="true"
        :modules="[FreeMode]"
        :slidesPerView="'auto'"
        :lazy="true"
        :wrapperClass="'base-carousel-block__wrap base-carousel-block__wrap--thumbs'"
        class="base-carousel-block__carousel base-carousel base-carousel--thumbs"
        @swiper="setThumbsSwiper"
      >
        <swiper-slide
          v-for="(image, index) in allImages"
          :key="'thumbs ' + index"
          :class="[
            'base-carousel__slide base-carousel-slide base-carousel-slide--thumbs',
            { 'base-carousel-slide--selected': index === selectedIndex }
          ]"
        >
          <img
            v-if="isLoading[index]"
            class="swiper-lazy-preloader"
            :src="'img/placeholder.png'"
            alt="carousel slide placeholder"
          />
          <img
            :alt="'Thumbnail ' + (index + 1)"
            :src="image"
            class="base-carousel-slide__img swiper-lazy"
            :loading="index === 0 ? 'eager' : 'lazy'"
            @click="slideToThis($event)"
            @load="isLoading[index] = false"
          />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<!-- no data attr on swiper wrap because of the way swiper works -->
<style lang="scss">
.base-carousel-block {
  position: relative;

  &__content {
    display: flex;

    position: relative;
  }

  &__content,
  &__thumbs {
    overflow: hidden;
  }

  &__wrap {
    display: flex;
    align-items: stretch;

    position: relative;
  }
}
</style>
<style lang="scss" scoped>
.base-carousel {
  &--content {
    margin-left: -16px;
  }

  &--thumbs {
    margin-top: 12px;
    margin-left: -12px;
  }

  &__next {
    right: 0.75rem;
  }

  &__prev {
    left: 0.75rem;
    transform: rotate(-180deg);
  }

  &__next,
  &__prev {
    margin-top: -1rem;
    width: 2rem;
    height: 2rem;

    position: absolute;
    top: 50%;
    z-index: $z-interactive;

    &:hover {
      cursor: pointer;
    }

    &[disabled] {
      @include set-non-interactive;
      opacity: 0.35;
    }
  }

  &__slide {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }
}

.base-carousel-slide {
  $r: &;
  flex: 0 0 100%;
  box-sizing: border-box;

  transition: 0.7s ease-in-out;

  &--content {
    padding-left: 16px;
  }

  &--thumbs {
    flex: 0 0 96px;
    padding-left: 12px;

    #{$r}__img {
      width: 84px;

      cursor: pointer;
    }

    &#{$r}--selected {
      #{$r}__img {
        border: 2px solid #0a0a0a;
      }
    }
  }

  &__img {
    width: fit-content;
    height: auto;

    aspect-ratio: 1 / 1;
    object-fit: cover;

    border-radius: 8px;
  }
}

.swiper-lazy-preloader {
  width: 100%;
  height: 100%;

  // animation: color-change 1s $ease-in-out infinite;
}

.swiper-lazy-preloader::after {
  display: none;
}

@keyframes color-change {
  0% {
    color: #0a0a0a;
  }

  50% {
    color: #d1d5da;
  }

  100% {
    color: #0a0a0a;
  }
}
</style>
