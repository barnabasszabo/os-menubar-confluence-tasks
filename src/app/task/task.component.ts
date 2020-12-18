import { TaskDTO } from './../confluence/TaskDTO';
import { TaskSortableHeaderDirective, SortEvent } from './../task-sortable-header.directive';
import { ConfluenceService } from './../confluence/confluence.service';
import { OnInit, Component, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  settingBlockDisplay = false;
  activeTasks: TaskDTO[] = [];
  finishedTasks: TaskDTO[] = [];
  active = 1;

  constructor(private confluenceService: ConfluenceService) { }

  ngOnInit(): void {
    this.init().then();
  }

  async init() {
    this.activeTasks = await this.confluenceService.getConfluenceApi().getMyTasks(true);
    this.finishedTasks = await this.confluenceService.getConfluenceApi().getMyTasks(false);
  }

  doLogout() {
    this.confluenceService.doLogout();
  }


}
