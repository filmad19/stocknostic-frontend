import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'priceFormat'
})
export class PriceFormatPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number): string {
    return this.decimalPipe.transform(value, '1.2-2') || '';//this.decimalPipe.transform method is used to format the price value.
                                                                      // The transform method returns the formatted price as a string.
  }
}
