import { TaskDTO } from './../confluence/TaskDTO';
import { TaskSortableHeaderDirective, SortEvent } from './../task-sortable-header.directive';
import { ConfluenceService } from './../confluence/confluence.service';
import { OnInit, Component, QueryList, ViewChildren } from '@angular/core';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  @ViewChildren(TaskSortableHeaderDirective) headers: QueryList<TaskSortableHeaderDirective>;

  settingBlockDisplay = false;
  tasks: TaskDTO[] = [];
  active = 1;
  filter: string;
  dataDisplayFormat = `fullDate`;

  constructor(private confluenceService: ConfluenceService) { }

  ngOnInit(): void {
    this.init().then();
  }

  async init() {
    this.tasks = await this.confluenceService.getConfluenceApi().getMyTasks();
  }

  doLogout() {
    this.confluenceService.doLogout();
  }

  onSort({column, direction}: SortEvent) {
    console.log(`column, direction`, column, direction);

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.tasks.sort( (a,b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }

}
