import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'censorName'
})
export class CensorNamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    return value
      .split(' ') // Split into words (First, Last, etc.)
      .map(word => {
        // Take the first letter and add 3 asterisks (or match length)
        if (word.length > 0) {
           // Option A: Fixed asterisks (looks cleaner)
           return word.charAt(0) + '***'; 
           
           // Option B: Match word length (comment out Option A to use this)
           // return word.charAt(0) + '*'.repeat(word.length - 1);
        }
        return '';
      })
      .join(' '); // Rejoin the words
  }
}