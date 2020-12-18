import { TaskDTO } from './../../confluence/TaskDTO';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-task-debug',
  templateUrl: './task-debug.component.html',
  styleUrls: ['./task-debug.component.scss']
})
export class TaskDebugComponent implements OnInit {

  @Input() task: TaskDTO;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
