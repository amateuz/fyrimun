import type { LocalImagePath, LocalImageLoader } from '@/types'

interface LocalImageLoadersOptions {
  isStrictExtension?: boolean
  sortByImagePath?: boolean
}

function normalizePath(path: string, isStrictExtension: boolean): string {
  path = path.split('?')[0].split('#')[0]
  if (!isStrictExtension) {
    path = path.replace(/\.[^/.]+$/, '')
  }
  return path
}

export function getLocalImageLoaders(
  localImagePaths: string[],
  options?: LocalImageLoadersOptions
): Map<LocalImagePath, LocalImageLoader> {
  const { isStrictExtension = true, sortByImagePath = true } = options || {}

  const localImageImports = import.meta.glob<{ default: string }>(
    '@/assets/img/**/*.{jpg,jpeg,png,webp,avif,gif,svg}'
  )
  const localImageLoaders: Map<LocalImagePath, LocalImageLoader> = new Map<
    LocalImagePath,
    LocalImageLoader
  >()
  const pathSet = new Set<string>(localImagePaths)
  Object.entries(localImageImports).forEach(([absolutePath, importFn]) => {
    const normalizedAbsolutePath = normalizePath(
      absolutePath,
      isStrictExtension
    )

    for (const localPath of pathSet) {
      const normalizedLocalPath = normalizePath(localPath, isStrictExtension)

      if (normalizedAbsolutePath.endsWith(normalizedLocalPath)) {
        localImageLoaders.set(localPath, {
          absolutePath,
          importFn
        })
        pathSet.delete(localPath)
        break
      }
    }
  })

  if (!sortByImagePath) return localImageLoaders

  return new Map(
    Array.from(localImageLoaders.entries()).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true })
    )
  )
}
