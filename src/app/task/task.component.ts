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

  constructor(private confluenceService: ConfluenceService) { }

  ngOnInit(): void {
  }

  doLogout() {
    this.confluenceService.doLogout();
  }


}
