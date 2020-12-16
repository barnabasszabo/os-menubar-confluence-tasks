import { ConfluenceConnection } from './ConfluenceConnection.model';
import { ConfluenceApi } from './confluenceApi';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfluenceService {

  private confluenceApi: ConfluenceApi = null;

  constructor() { }

  async test() {
    await this.getConfluenceApi().getMyTasks();
    await this.getConfluenceApi().addNewTask(`<span class=\"placeholder-inline-tasks\">test content from angular <ac:link><ri:user ri:userkey=\"8a7f808974eb39120174f94654350712\" /></ac:link></span>`)
  }

  isLoggedIn() {
    return this.getStoredUser() ? true : false;
  }

  getStoredUser(): ConfluenceConnection {
    const authData = localStorage.getItem(`cTask-auth`);
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  }
  storeUser(conn: ConfluenceConnection) {
    localStorage.setItem(`cTask-auth`, JSON.stringify(conn));
  }

  async doLogin(conn: ConfluenceConnection) {
    this.doLogout();
    this.storeUser(conn);
    await this.getConfluenceApi().getMyself();
  }

  doLogout() {
    localStorage.clear();
    this.confluenceApi = null;
  }

  getConfluenceApi() {
    if (!this.confluenceApi) {
      const authData = this.getStoredUser();
      if (!authData) {
        throw Error(`Login required!`);
      }
      this.confluenceApi = new ConfluenceApi(authData);
    }
    return this.confluenceApi;
  }

}
