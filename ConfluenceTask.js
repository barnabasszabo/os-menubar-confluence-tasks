'use strict';

const fetch = require('node-fetch');
const Bluebird = require('bluebird'); 
fetch.Promise = Bluebird;
const fs = require(`fs`);

module.exports =  class ConfluenceTask {

    usernaName = null;
    token = null;
    baseUrl = null;
    base64EncodedAuth = null;

    myself = null;

    constructor(usernaName, token, confluenceBaseUrl) {
        this.usernaName = usernaName;
        this.token = token;
        this.baseUrl = confluenceBaseUrl;
        this.base64EncodedAuth = Buffer.from(`${this.usernaName}:${this.token}`).toString('base64');
    }

    async getMyself(force = false) {
        if ( force || !this.myself) {
            this.myself = await this.get(`${this.baseUrl}/user/current?expand=personalSpace`);
            this.log(`myself`, this.myself);
        }
        return this.myself;
    }

    async getMyTasks() {
        const myself = await this.getMyself();
        const myAllTasks = await this.get(`${this.baseUrl}/inlinetasks/search?assignee=${myself.accountId}`);
        this.log(`myTasks`, myAllTasks);
        return myAllTasks;
    }

    // taskbody == <span class=\"placeholder-inline-tasks\">test content ${(count + 1)} <ac:link><ri:user ri:userkey=\"8a7f808974eb39120174f94654350712\" /></ac:link></span>
    async addNewTask(taskBody) {
        const myTaskPageContent = await this.getMyTaskPageContent();
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
    async getMyTaskPageContent() {
        const title = await this.getMyTaskPageTitle();
        const mySpace = await this.getOrCreateMySpace();
        const myTaskPageDescriptorList = await this.get(`${this.baseUrl}/content?type=page&spaceKey=${mySpace.key}&title=${title}&status=current&expand=version,body.storage`);
        const myTaskPageContent = myTaskPageDescriptorList.results[0];
        this.log(`myTaskPageContent`, myTaskPageContent);
        return myTaskPageContent;
    }


    log(context, data) {
        // fs.writeFileSync(`sample-responses/${context}.json`, JSON.stringify(data, null, 4));
    }

    async get(url) {
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
    
    async put(url, bodyData) {
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

    async post(url, bodyData) {
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
