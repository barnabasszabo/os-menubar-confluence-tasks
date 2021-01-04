import { ConfluenceConnection } from './ConfluenceConnection.model';
import { ConfluenceApi } from './confluenceApi';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfluenceService {

  private confluenceApi: ConfluenceApi = null;

  constructor() { }

  async addNewTask(text: string) {
    const myself = await this.getConfluenceApi().getMyself();
    return await this.getConfluenceApi().addNewTask(`<span class=\"placeholder-inline-tasks\">${text} - <ac:link><ri:user ri:accountId=\"${myself.accountId}\" ri:username=\"${myself.accountId}\" /></ac:link></span>`)
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
