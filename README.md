Generate api token: https://id.atlassian.com/manage-profile/security/api-tokens

# Display your confluence tasks, and create a new one with a really fast way easily from your trayBar.


## How to install
Download from [releases](https://github.com/barnabasszabo/os-menubar-confluence-tasks/releases), and execute the binaries.

## How to setup
1) You need an API token from your confluence server like: https://id.atlassian.com/manage-profile/security/api-tokens
2) Click to "Create API Token" button, and type any comment.
3) Copy the generated string to the application. Add your email address as well, and your confluence server's address

## Limitations
* You can easily add new task, or view your existing ones, but you can't **complete any task** yet, because there is no REST API for that in confluence server :(
* Known bug: Error while creating a task collector page. In your private workspace please create one: "My Todo list: <YOUR Confluence Display Name>"
  
