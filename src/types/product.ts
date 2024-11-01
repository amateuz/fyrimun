import type { Option } from '@/types'
import type { ListItem } from '@/types/listItem'
import type { Review } from '@/types'

export type Product = {
  name: string
  url: string
  colorImageMap: string[][]
  colors: Option[]
  sizes: Option[]
  images: string[]
  description?: string
  rating: number
  ratingCount?: number
  price: number
  oldPrice?: number
  stockLeft: number
  happyCustomerPercentage: number
  itemsPerCustomer: string
  highlights: ListItem[]
  reviews: Review[]
}

export type CartProduct = Omit<
  Product,
  | 'url'
  | 'colors'
  | 'sizes'
  | 'images'
  | 'rating'
  | 'ratingCount'
  | 'stockLeft'
  | 'happyCustomerPercentage'
  | 'itemsPerCustomer'
  | 'highlights'
  | 'reviews'
> & {
  color: Option
  size: Option
  quantity: number
}
