
const ConfluenceTask = require(`./ConfluenceTask`);
const localConfig = require(`./localconfig.js`); 

console.log(`local config`, localConfig.config);

async function test() {
    const confluence = new ConfluenceTask(localConfig.config.username, localConfig.config.token, localConfig.config.baseUrl);
    await confluence.getMyTasks();
    await confluence.addNewTask(`<span class=\"placeholder-inline-tasks\">test content <ac:link><ri:user ri:userkey=\"8a7f808974eb39120174f94654350712\" /></ac:link></span>`)
}

test().then();