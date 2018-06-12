# Installation:

- install mongodb
https://treehouse.github.io/installation-guides/mac/mongo-mac.html

- create a db called `graphExample`
- create a collection called `users` that contains `name` and `surname`

- npm install

# available commands

## to run in your local environment:
`npm run dev`

it will automatically rerun your code all the time you save and will check for tslint errors and formatting style errors.

### Webstorm
![alt text](https://github.com/daniele-zurico/graphql-setup/blob/graph2/webstorm-prettier.jpg)
### VS Code
prettier-vscode can be installed using the extension sidebar. Search for Prettier - Code formatter. It can also be installed using ext install prettier-vscode in the command palette.
### Other editors
https://prettier.io/docs/en/editors.html


### graphiQl
- http://localhost:4000
here you can run some queries:

1. fetch all the users
```
query{
  allUsers {
    id
    name
    surname
  }
}
```

2. create a new user
```
mutation {
  addUser(name: "adrian", surname: "goHenry") {
    name
    surname
  }
}
```

3. delete existing user
```
mutation {
  deleteUser(id: "5b0d6ad0b4d7720413da7ebe") {
    name
    surname
  }
}
```

4. update existing user
```
mutation {
  updateUser(id: "5b0d61e636c7c0f9c65947cc", name: "daniele", surname: "zurico") {
    _id
    name
    surname
  }
}
```