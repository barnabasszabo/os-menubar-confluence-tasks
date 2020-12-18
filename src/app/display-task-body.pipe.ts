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

    let convertedStr = this.convertDateTag(task.body);

    return this.sanitized.bypassSecurityTrustHtml(convertedStr);
  }

  convertDateTag(value: string) {
    let ret = value;
    // Convert format FROM <time datetime="2020-12-17" /> TO <span class="confluence-datetime">2020-12-17</span>
    const allTimes = ret.match(/<time datetime="([\d-])+"\s*\/>/ig) || [];
    for (let i = 0; i < allTimes.length; i++) {
      const time = allTimes[i];
      const date = time.match(/"([\d-])+"/ig)[0].replace('"', '').replace('"', '');
      ret = ret.replace(time, `<span class="confluence-datetime">${date}</span>`);
    }
    return ret;
  }

}
