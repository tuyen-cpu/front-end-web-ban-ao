import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    console.log(value);
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();

    return value.filter((data: any) => {
      return JSON.stringify(data).toLowerCase().includes(args);
    });
  }
}
