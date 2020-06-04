import { Pipe, PipeTransform, Sanitizer} from '@angular/core';

@Pipe({
  name: 'boldSpan'
})
export class BoldSpanPipe implements PipeTransform {
  constructor(
    private sanitizer: Sanitizer
  ) {}

  transform(value: string, regex): any {
    const result = this.replace(value, regex);
    return result;
  }

  replace(str, regex) {
    const result = str.replace(new RegExp(`(${regex})`, 'gi'), '<b>$1</b>');
    return result;
  }
}
