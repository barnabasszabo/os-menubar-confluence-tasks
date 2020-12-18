import { ConfluenceService } from './confluence.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'confluenceContentTitle'
})
export class ConfluenceContentTitlePipe implements PipeTransform {

  constructor(private confluenceService: ConfluenceService) {}

  async transform(id: string | number) {
    const page = await this.confluenceService.getConfluenceApi().getPageData(id);
    return page ? page.title : '';
  }

}
