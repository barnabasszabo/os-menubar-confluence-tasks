import { TaskDTO } from './confluence/TaskDTO';
import { Pipe, PipeTransform } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'displayTaskBody'
})
export class DisplayTaskBody implements PipeTransform {

  constructor(private sanitized: DomSanitizer) {}
  transform(task: TaskDTO) {

    console.log(this.sanitized.bypassSecurityTrustHtml(task.body));

    this.convertDateTag(task.body);

    return this.sanitized.bypassSecurityTrustHtml(task.body);
  }

  convertDateTag(value: string) {
    // Convert format FROM <time datetime="2020-12-17" /> TO <span class="confluence-datetime">2020-12-17</span>
    const allTimes = value.match(/<time datetime="([\d-])+"\s*\/>/ig) || [];
    for (let i = 0; i < allTimes.length; i++) {
      const time = allTimes[i];
      const date = time.match(/"([\d-])+"/ig)[0].replace('"', '').replace('"', '');
      value = value.replace(time, `<span class="confluence-datetime">${date}</span>`);
    }
  }

}
