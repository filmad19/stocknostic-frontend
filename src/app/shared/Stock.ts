import {PricePoint} from "./PricePoint";

export interface Stock {
  symbol: string
  companyName: string
  liked: boolean
  currency: string
  previousClosePrice: number
  pricePointDtoList: PricePoint[]
}
