import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename'
})
export class FilenamePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const maxLength = 12;
    const extension = value.substring(value.lastIndexOf('.'));
    const nameWithoutExtension = value.substring(0, value.lastIndexOf('.'));

    if (nameWithoutExtension.length <= maxLength) {
      return value;
    }

    const truncatedName = nameWithoutExtension.substring(0, 10) + '...';
    return truncatedName + extension;
  }

}
