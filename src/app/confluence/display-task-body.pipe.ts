import { ConfluenceService } from './confluence.service';
import { TaskDTO } from './TaskDTO';
import { Pipe, PipeTransform } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'displayTaskBody'
})
export class DisplayTaskBody implements PipeTransform {

  constructor(private sanitized: DomSanitizer, private confluenceService: ConfluenceService) {}
  async transform(task: TaskDTO) {

    let convertedStr = await this.convertUserTag(task);
    convertedStr = await this.convertDateTag(convertedStr);

    return this.sanitized.bypassSecurityTrustHtml(convertedStr);
  }

  async convertUserTag(task: TaskDTO) {
    let ret = task.body;

    const userTags = ret.match(/<ac:link[^>]*>(.*?)<\/ac:link>/ig) || [];
    for (let i = 0; i < userTags.length; i++) {
      const userTag = userTags[i];
      const ids = (userTag.match(/"(\w+)"/ig) || []).map(e => e.replace('"', '').replace('"', ''));
      for (let j = 0; j < ids.length; j++) {
        const id = ids[j];
        const user = await this.confluenceService.getConfluenceApi().getUser(id);
        ret = ret.replace(userTag, `<span class="confluence-user border border-primary rounded mr-1 alert-primary">@${user.publicName}</span>`);
      }
    }

    return ret;
  }

  async convertDateTag(value: string) {
    let ret = value;

    // Convert format FROM <time datetime="2020-12-17" /> TO <span class="confluence-datetime">2020-12-17</span>
    const allTimes = ret.match(/<time datetime="([\d-])+"\s*\/>/ig) || [];
    for (let i = 0; i < allTimes.length; i++) {
      const time = allTimes[i];
      const date = time.match(/"([\d-])+"/ig)[0].replace('"', '').replace('"', '');
      const taskDate = new Date(date).getTime();
      const now = new Date().getTime();
      const warningDate = now - (15 * 24 * 60 * 60 * 1000); // 15 days
      ret = ret.replace(time, `<span class="confluence-datetime border rounded ${(taskDate < warningDate ? 'border-danger alert-danger' : warningDate < taskDate && taskDate < now ? 'border-warning alert-warning' : 'border-success alert-success')}">${date}</span>`);
    }
    return ret;
  }

}
