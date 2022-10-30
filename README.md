<sub>This repository contains only **server side** of _Webzone_ app </sub>
# Webzone- website builder app inspired by _Wix_

Website builder app inspired by _Wix_.com

### [Go to app in production](https://webzone.onrender.com/)

For those of you who are not familiar yet with _Wix_, read about it [here](#wix-description). 

![image](https://user-images.githubusercontent.com/88834944/198869046-457eb628-98bf-490a-9eff-6a8e8b5fcee1.png)

## Wix description
_Wix_ is an app in which anyone can build a website to himself. Whether it’s your first time creating or you’re a long time expert, you'll be able to get yourself a personalized and professional website by simple features and tools. Users building websites and projects lunching it and are able to edit it any time. There are many features in _Wix_, such as objects customization, detailed editing, logo editing, pre-made sectinos and website templates and more. Webzone performs most of them, actually the main app use use cases.

## Technologies
🧰 Framework: React  
🔌 Server enviroment: Node.js  
💾 Database: MongoDB  
🎨 Style: Sass

The technology stack we used was MERN - MongoDB, Express, React, Node.js.
The app uses webSockets to update the website in real-time and work with teamates online.
API architecture is REST, and we used middlewares to authenticate and authorize actions.

We have used many third side libraries for many features, such as D&D, google login, screen capture and more.

## Getting started
**Note!** This repository contains only server side of the project. To run the app properly, you have to run client side too.

Head to the repository on top and clone the project or download the files.

```
git clone https://github.com/shahafle/WebZone_backend.git
```

Enter the WebZone_backend folder and make sure you have node_modules installed. After that we will initiate the server with 'npm run server:dev':

```
cd WebZone_backend
npm i 
npm run server:dev
```
You shuold get a console ouput that the server is up and running at port 3030. Server is running!

Now you have to run client side. Change directory back to get out of backend directory:

```
cd ..
```

Go to the [frontend repository here](https://github.com/shahafle/WebZone_frontend) and clone the project or download the files. 

```
git clone https://github.com/shahafle/WebZone_frontend.git
```

Enter the WebZone_frontend folder and repeat the same process as done to run the backend.

```
cd WebZone_frontend
npm i 
npm start
```
You shuold get a console ouput that the server is up and running at localhost:3000. Your client side is running!

Everything is ready! The App should be opened automatically, enjoy!

## Authors
* [Shahaf Levi](https://github.com/shahafle)
* [Roi Yotvat](https://github.com/roiyot26)
* [Noy morgenshtein](https://github.com/Noy25)
