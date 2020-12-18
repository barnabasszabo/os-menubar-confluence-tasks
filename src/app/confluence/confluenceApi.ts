import { TaskDTO } from './TaskDTO';
import { isatty } from 'tty';
import { ConfluenceConnection } from './ConfluenceConnection.model';

const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;
// const fs = require(`fs`);

export class ConfluenceApi {

    connInfo: ConfluenceConnection;
    baseUrl: string;
    base64EncodedAuth: string = null;

    myself: any = null;

    constructor(connInfo: ConfluenceConnection) {
        this.connInfo = connInfo;
        this.baseUrl = this.connInfo.url + `/rest/api`;
        this.base64EncodedAuth = Buffer.from(`${this.connInfo.email}:${this.connInfo.token}`).toString('base64');
    }

    async getMyself(force = false) {
        if ( force || !this.myself) {
            this.myself = await this.get(`${this.baseUrl}/user/current?expand=personalSpace`);
            this.log(`myself`, this.myself);
        }

        if (!this.myself) { throw new Error(`No currently logged in user!`); }
        return this.myself;
    }

    async getMyTasks(isActive = true): Promise<TaskDTO[]> {
        const myself = await this.getMyself();
        const myAllTasks = await this.get(`${this.baseUrl}/inlinetasks/search?start=0&limit=5000&assignee=${myself.accountId}&status=${(isActive ? 'incomplete' : 'complete' )}`);
        this.log(`myTasks`, myAllTasks);
        return myAllTasks.results || [];
    }

    // taskbody == <span class=\"placeholder-inline-tasks\">test content ${(count + 1)} <ac:link><ri:user ri:userkey=\"8a7f808974eb39120174f94654350712\" /></ac:link></span>
    async addNewTask(taskBody: string) {
        const myTaskPageContent = await this.getOrCreateMyTaskPageContent();
        const count = (myTaskPageContent.body.storage.value.match(/<ac:task-id>/g) || []).length;
        const newTask = `
            <ac:task-list>
                <ac:task>
                    <ac:task-id>${(count + 1)}</ac:task-id>
                    <ac:task-status>incomplete</ac:task-status>
                    <ac:task-body>${taskBody}</ac:task-body>
                </ac:task>
            </ac:task-list>`;
        const newPageContent = {
            version: {
                number: myTaskPageContent.version.number + 1
            },
            title: myTaskPageContent.title,
            type: "page",
            status: "current",
            body: {
                storage: {
                    value: `${myTaskPageContent.body.storage.value}\n${newTask}`,
                    representation: "storage"
                },
            }
        };
        const updatedContent = await this.put(`${this.baseUrl}/content/${myTaskPageContent.id}`, newPageContent);
        this.log(`updatedContent`, updatedContent);

        return await this.getMyTasks();
    }

    async getOrCreateMySpace() {
        let myself = await this.getMyself();
        if (!myself.personalSpace) {
            const myNewSpace = await this.post(`${this.baseUrl}/space/_private`, {
                key: `private${myself.accountId}`,
                name: `${myself.publicName}`
            });
            this.log(`my-new-personal-space`, myNewSpace);
            myself = await this.getMyself(true);
        }
        return myself.personalSpace;
    }

    async getMyTaskPageTitle() {
        const myself = await this.getMyself();
        return `My Todo list: ${myself.publicName}`;
    }
    async getOrCreateMyTaskPageContent() {
        const title = await this.getMyTaskPageTitle();
        const mySpace = await this.getOrCreateMySpace();
        const myTaskPageDescriptorList = await this.get(`${this.baseUrl}/content?type=page&spaceKey=${mySpace.key}&title=${title}&status=current&expand=version,body.storage`);
        if (myTaskPageDescriptorList.results.length == 0) {
            const pageData = {
                title: title,
                type: "page",
                space: {
                  key: mySpace.key
                },
                status: "current",
                body: {
                  storage: {
                    value: "<ac:structured-macro ac:name=\"warning\" ac:schema-version=\"1\" ac:macro-id=\"6b052825-4570-42ef-b21a-5be3908d26c9\"><ac:rich-text-body><p><strong>This page is generated!</strong> Please do not edit manually!</p></ac:rich-text-body></ac:structured-macro>",
                    representation: "storage"
                  }
                }
            };
            console.log(`Missing task page! Create it!`, pageData);
            const createResponse = await this.post(`${this.baseUrl}/content`, pageData);
            console.log(`Create page response:`, JSON.stringify(createResponse, null, 4));
            return await this.getOrCreateMyTaskPageContent();
        } else {
            const myTaskPageContent = myTaskPageDescriptorList.results[0];
            this.log(`myTaskPageContent`, myTaskPageContent);
            return myTaskPageContent;
        }
    }

    log(context: string, data: any) {
      // console.log(context, JSON.stringify(data, null, 4));
      // fs.writeFileSync(`sample-responses/${context}.json`, JSON.stringify(data, null, 4));
    }

    async get(url: string): Promise<any> {
        return new Promise( (resolve, reject) => {
            fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${this.base64EncodedAuth}` },
                })
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(err => reject(err));
        });
    }

    async put(url: string, bodyData: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            fetch(url, {
                    method: 'PUT',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${this.base64EncodedAuth}` },
                    body: JSON.stringify(bodyData)
                })
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(err => reject(err));
        });
    }

    async post(url: string, bodyData: any): Promise<any> {
        return new Promise( (resolve, reject) => {
            fetch(url, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Basic ${this.base64EncodedAuth}` },
                    body: JSON.stringify(bodyData)
                })
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(err => reject(err));
        });
    }

}
