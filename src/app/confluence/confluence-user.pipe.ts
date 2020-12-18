import { ConfluenceService } from './confluence.service';
import { TaskDTO } from './TaskDTO';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'confluenceUser'
})
export class ConfluenceUserPipe implements PipeTransform {

  constructor(private confluenceService: ConfluenceService) {}

  async transform(userId: string) {
    const user = await this.confluenceService.getConfluenceApi().getUser(userId);
    if (user) {
      return `${user.publicName}`;
    }
    return '';
  }

}
