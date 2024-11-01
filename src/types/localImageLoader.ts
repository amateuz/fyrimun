export interface LocalImageLoader {
  absolutePath: string
  importFn: () => Promise<{ default: string }>
}

export type LocalImagePath = string
