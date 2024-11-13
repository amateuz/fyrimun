<script setup lang="ts">
import type { LocalImagePath, LocalImageLoader } from '@/types'
import DOMPurify from 'dompurify'
import { ref, computed, onMounted } from 'vue'
import { getLocalImageLoaders } from '@/utils/getLocalImageLoaders'

interface BaseWysiwygProps {
  htmlContent: string
  localImagesPath?: string
  trySubstituteImagesSrcWithLocal?: boolean
  addLoadingLazyToImages?: boolean
  isStrictExtension?: boolean
}

const props = withDefaults(defineProps<BaseWysiwygProps>(), {
  localImagesPath: 'wysiwyg',
  trySubstituteImagesSrcWithLocal: true,
  addLoadingLazyToImages: true,
  isStrictExtension: false
})

const isContentReady = ref(false)
const substitutedHtmlContent = ref<string | null>(null)

const extractFileName = (src: string): string => {
  const [fullPath] = src.split(/[?#]/)
  const match = fullPath.match(/([^/]+)$/)
  if (!match) return ''
  let fileName = match[1]
  if (!props.isStrictExtension) {
    fileName = fileName.split('.')[0]
  }
  return fileName
}

const substituteImageSrcWithLocal = async (
  img: HTMLImageElement,
  imageLoaders: Map<LocalImagePath, LocalImageLoader>
) => {
  const src = img.getAttribute('src')
  if (!src) return

  const fileName = extractFileName(src)
  if (!fileName) return

  const newSrc = imageLoaders.get(fileName)?.importFn
  if (!newSrc) return

  img.setAttribute('src', (await newSrc()).default)
}

const addLoadingLazy = (img: HTMLImageElement) => {
  img.setAttribute('loading', 'lazy')
}

const transformImages = async (htmlContent: string): Promise<string> => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlContent, 'text/html')
  const imgTags = doc.querySelectorAll('img')

  const imageLoaders = props.trySubstituteImagesSrcWithLocal
    ? getLocalImageLoaders(
        // extracting filenames from images src
        Array.from(imgTags).map((img) =>
          extractFileName(img.getAttribute('src') ?? '')
        ),
        { isStrictExtension: false }
      )
    : null

  for (const img of imgTags) {
    if (props.addLoadingLazyToImages) {
      addLoadingLazy(img)
    }
    if (imageLoaders === null) continue
    await substituteImageSrcWithLocal(img, imageLoaders)
  }

  return doc.body.innerHTML
}

const getSafeHtml = computed(() => {
  return DOMPurify.sanitize(props.htmlContent)
})

onMounted(async () => {
  substitutedHtmlContent.value = await transformImages(getSafeHtml.value)
  isContentReady.value = true
})
</script>

<template>
  <div
    v-if="isContentReady"
    class="base-wysiwyg"
    v-html="substitutedHtmlContent"
  />
  <div v-else>Loading content...</div>
</template>

<style lang="scss">
.base-wysiwyg {
  ul {
    margin-left: 20px;
    list-style-type: disc;
  }

  .image {
    margin: 0.9em auto;
    min-width: 50px;

    clear: both;

    text-align: center;

    &_resized {
      display: block;
      max-width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
