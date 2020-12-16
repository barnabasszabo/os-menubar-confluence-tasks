import { Router } from '@angular/router';
import { ConfluenceService } from './../confluence/confluence.service';
import { ConfluenceConnection } from './../confluence/ConfluenceConnection.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  hasError = false;
  connInfo: ConfluenceConnection = new ConfluenceConnection();

  constructor(private confluenceService: ConfluenceService, private router: Router) { }

  ngOnInit(): void {
  }

  async doLogin() {
    console.log(`connInfo`, this.connInfo);
    try {
      this.hasError = false;
      await this.confluenceService.doLogin(this.connInfo);
      this.router.navigate(['/']);
    } catch (e) {
      this.hasError = true;
      console.log(`error occured`, e);
    }
  }

}
