<script lang="ts" setup>
import type { Swiper as SwiperClass } from 'swiper/types'
import type { LocalImagePath, LocalImageLoader } from '@/types'
import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { until } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'
import { getLocalImageLoaders } from '@/utils/getLocalImageLoaders'
import { useWindowSize } from '@vueuse/core'
import BaseSvgIcon from '@/components/Base/BaseSvgIcon.vue'
import SkeletonLoader from '@/components/Base/BaseSkeletonLoader.vue'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

const props = defineProps<{
  imagePaths: string[]
}>()

const { width: windowWidth } = useWindowSize()
const baseSlideWidth = 84
const marginOffset = 32

const maxSlidesPerScreen = computed(() => {
  return Math.floor((windowWidth.value - marginOffset) / baseSlideWidth)
})
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

const isSlidesLoading = ref<Array<boolean>>(
  Array(allImagesPaths.length).fill(true)
)

const isVisibleSlidesLoading = computed(() => {
  return isSlidesLoading.value.some(
    (isSlideLoading) =>
      isSlideLoading &&
      isSlidesLoading.value.indexOf(isSlideLoading) <= maxSlidesPerScreen.value
  )
})

const addPreloadLinks = () => {
  allImagesPaths.slice(0, maxSlidesPerScreen.value).forEach((src) => {
    if (!document.head.querySelector(`link[rel="preload"][href="${src}"]`)) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
  })
}

const preloadInitialImages = async () => {
  const loadedImages: string[] = []
  let index = 0

  for (const imageLoader of imageLoadersMap.values()) {
    if (index >= maxSlidesPerScreen.value) break

    const imgSrc = (await imageLoader.importFn()).default

    await new Promise((resolve) => {
      const img = new Image()
      img.src = imgSrc
      img.onload = () => {
        isSlidesLoading.value[index] = false
        resolve(true)
      }
      img.onerror = resolve // Handle errors gracefully
    })

    loadedImages.push(imgSrc)
    index++
  }

  allImages.value = loadedImages
}

const loadRemainingImages = async () => {
  const remainingImages: string[] = []
  let index = maxSlidesPerScreen.value

  for (const imageLoader of Array.from(imageLoadersMap.values()).slice(index)) {
    const imgSrc = (await imageLoader.importFn()).default

    await new Promise((resolve) => {
      const img = new Image()
      img.src = imgSrc
      img.onload = () => {
        isSlidesLoading.value[index] = false
        resolve(true)
      }
      img.onerror = resolve // Handle errors gracefully
    })

    remainingImages.push(imgSrc)
    index++
  }

  allImages.value = [...allImages.value, ...remainingImages]
}

// custom func, swiper glitches sometimes
const slideToThis = (e: Event) => {
  const imgHref = (e.target as HTMLElement).getAttribute('src')
  const foundPath = allImagesPaths.find((path) => path === imgHref)
  if (!foundPath) return
  const slideToIndex = allImagesPaths.indexOf(foundPath)
  if (slideToIndex < 0) return
  contentSwiper.value?.slideTo(slideToIndex)
}

onBeforeMount(async () => {
  addPreloadLinks()
  await preloadInitialImages()
  loadRemainingImages()
})

defineExpose({
  swiper: contentSwiper
})
</script>
<template>
  <div class="base-carousel-block">
    <div v-if="isVisibleSlidesLoading">
      <SkeletonLoader
        class="base-carousel-block__skeleton-loader"
        width="100%"
        aspect-ratio="1 / 1"
      />
    </div>
    <div v-else class="base-carousel-block__content">
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
            :src="image"
            :alt="'Slide ' + (index + 1)"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="base-carousel-slide__img swiper-lazy"
            @load="isSlidesLoading[index] = false"
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

    <div
      v-if="isVisibleSlidesLoading"
      class="base-carousel-block__skeleton-loader-container"
    >
      <SkeletonLoader
        v-for="index in maxSlidesPerScreen"
        :key="`skeleton-${index}`"
        class="base-carousel-block__skeleton-loader base-carousel-block__skeleton-loader--thumbs"
        width="84px"
        aspect-ratio="1 / 1.142857142857143"
      />
    </div>
    <div v-else class="base-carousel-block__thumbs">
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
            :alt="'Thumbnail ' + (index + 1)"
            :src="image"
            class="base-carousel-slide__img swiper-lazy"
            :loading="index === 0 ? 'eager' : 'lazy'"
            @click="slideToThis($event)"
            @load="isSlidesLoading[index] = false"
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

  &__skeleton-loader-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 0.75rem;

    margin-top: 0.75rem;
    overflow: hidden;
  }

  &__skeleton-loader {
    flex: 1 0 auto;

    &--thumbs {
      // padding-left: 0.75rem;
      // margin-left: -0.75rem;
    }
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
    height: 96px;
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

    &[disabled]:not([disabled='false']) {
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
        border: 2px solid $color-dark-15;
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
</style>
