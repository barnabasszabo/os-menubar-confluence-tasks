import { ConfluenceService } from './../confluence/confluence.service';
import { OnInit, Component } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  settingBlockDisplay = false;
  active = 1;
  newTaskText = '';
  errorMsg: string = null;

  constructor(public confluenceService: ConfluenceService) { }

  ngOnInit(): void {
    this.init().then();
  }

  async init() {
    try {
      await this.confluenceService.getConfluenceApi().getOrCreateMyTaskPageContent();
    } catch (e) {
      this.errorMsg = e;
    }
  }

  async onNewTask() {
    console.log(`submitted!`, this.newTaskText);
    await this.confluenceService.addNewTask(this.newTaskText);
    // TODO: refrsh the table
  }

  doLogout() {
    this.confluenceService.doLogout();
  }


}
