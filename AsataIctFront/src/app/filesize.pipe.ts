import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filesize'
})
export class FilesizePipe implements PipeTransform {

  transform(bytes: string | number, decimalPoint: number = 2): string {
    // Convert the input to a number if it's a string
    const bytesNum = typeof bytes === 'string' ? Number(bytes) : bytes;

    // Check if the conversion to number was successful and bytesNum is not NaN
    if (isNaN(bytesNum)) {
      return 'Invalid number';
    }

    if (bytesNum === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimalPoint < 0 ? 0 : decimalPoint;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytesNum) / Math.log(k));

    return parseFloat((bytesNum / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
