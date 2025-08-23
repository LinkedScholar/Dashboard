import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(value: number): number[] {
    const array = [];
    for (let i = 0; i < value; i++) {
      array.push(i);
    }
    return array;
  }
}