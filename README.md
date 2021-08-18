### Hear-Data

What is this?

This is a software engineering project on the topic of data sonification. This application allows you to hear data using the method of sonification.


### Requirements
```
npm 
```

Install dependencies
```sh
npm install
```

To run in development mode on `localhost:9000`
```sh
npm run start
```

### Configuration
In the `package.json`, set
```
"start": "cross-env NODE_ENV=development webpack-dev-server",
"dev": "cross-env NODE_ENV=development webpack",
```
Ensure that `npm at at 6.13.2`

### Tree structure

The following image illustrates the tree structure of the application. 

![<Display the tree structure>](/src/images/tree_struct.png "Title")


### Acknowledgements

I have used numerous third party libraries to satisfy the requiresd features in this project. As shown in the tree structure, the following directories are borrowed code from open source projects. These include:
```
->extensions
->engine
->util
->store
```

For configuration and sound integration, I have used the following project from [here](https://github.com/datavized/twotone)

-- The configurations for this project (such as: eslint, packages, babel, webpack, etc.) have been inherited from a similar project to speed up developmenet.

--The 'engine/` dir is an external directory that handles encoding and processing in this project.

--The active Trello profile: https://trello.com/b/eZObcmYb/project-plans
