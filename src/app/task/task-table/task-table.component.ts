import { ConfluenceService } from './../../confluence/confluence.service';
import { TaskDebugComponent } from './../task-debug/task-debug.component';
import { TaskDTO } from './../../confluence/TaskDTO';
import { SortEvent, TaskSortableHeaderDirective } from './../../task-sortable-header.directive';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit {

  @ViewChildren(TaskSortableHeaderDirective) headers: QueryList<TaskSortableHeaderDirective>;

  @Input() active: boolean;

  tasks: TaskDTO[] = [];
  dataDisplayFormat = `fullDate`;

  filter: string;

  constructor(private modalService: NgbModal, private confluenceService: ConfluenceService) { }

  ngOnInit(): void {
    this.init().then().catch(e => console.error(e));
  }

  async init() {
    this.tasks = await this.confluenceService.getConfluenceApi().getMyTasks(this.active);
  }

  openDebug(task: TaskDTO) {
    const modalRef = this.modalService.open(TaskDebugComponent);
    modalRef.componentInstance.task = task;
  }

  async checkTask(task) {
    await this.confluenceService.getConfluenceApi().checkTask(task, true);

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
