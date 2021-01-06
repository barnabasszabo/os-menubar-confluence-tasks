import { ConfluenceService } from './../../confluence/confluence.service';
import { TaskDebugComponent } from './../task-debug/task-debug.component';
import { TaskDTO } from './../../confluence/TaskDTO';
import { SortEvent, TaskSortableHeaderDirective } from './../../task-sortable-header.directive';
import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { differenceWith, isEqual } from 'lodash';

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss']
})
export class TaskTableComponent implements OnInit, OnDestroy {

  @ViewChildren(TaskSortableHeaderDirective) headers: QueryList<TaskSortableHeaderDirective>;

  @Input() active: boolean;
  @Input() refreshEvent: Observable<void>;

  tasks: TaskDTO[] = [];
  dataDisplayFormat = `fullDate`;

  private eventsSubscription: Subscription;

  constructor(private modalService: NgbModal, private confluenceService: ConfluenceService) { }

  ngOnInit(): void {
    this.init();
    this.eventsSubscription = this.refreshEvent.subscribe(() => this.doRefresh(true));
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  init(timeout = 0) {
    setTimeout(() => {
      this.doRefresh();
      this.init( (1000 * 60) );
    }, timeout);
  }

  doRefresh(force = false) {
    this.confluenceService.getConfluenceApi().getMyTasks(this.active).then(data =>  {
      const diff = differenceWith(data, this.tasks, isEqual);
      if (force || (diff && diff.length > 0)) {
        this.tasks = data;
      }
    });
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
