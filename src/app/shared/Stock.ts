import {PricePoint} from "./PricePoint";

export interface Stock {
  symbol: string
  companyName: string
  liked: boolean
  currency: string
  previousClosePrice: number
  currentPrice: number
  pricePointDtoList: PricePoint[]
}
