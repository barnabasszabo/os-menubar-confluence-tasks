import { ConfluenceService } from './../confluence/confluence.service';
import { OnInit, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  refreshActiveTableEventsSubject: Subject<void> = new Subject<void>();
  refreshInactiveTableEventsSubject: Subject<void> = new Subject<void>();

  settingBlockDisplay = false;
  active = 1;
  newTaskText = '';
  errorMsg: string = null;
  onSubmitted = false;

  dateModel: NgbDateStruct;
  today = this.calendar.getToday();

  constructor(public confluenceService: ConfluenceService, private calendar: NgbCalendar) { }

  ngOnInit(): void {
    this.reset();
    this.init().then();
  }

  async init() {
    try {
      await this.confluenceService.getConfluenceApi().getOrCreateMyTaskPageContent();
    } catch (e) {
      this.errorMsg = e;
    }
  }

  reset() {
    this.errorMsg = null;
    this.newTaskText = null;
    this.dateModel = null;
    this.onSubmitted = false;
  }

  async onNewTask() {
    this.onSubmitted = true;
    await this.confluenceService.addNewTask(this.newTaskText, this.dateModel);
    this.refreshActiveTableEventsSubject.next();
    this.reset();
  }

  doAllTableRefresh() {
    this.refreshActiveTableEventsSubject.next();
    this.refreshInactiveTableEventsSubject.next();
  }

  doLogout() {
    this.confluenceService.doLogout();
  }


}
