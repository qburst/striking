# Striking
Striking is a simulation of a carrom board play where 2 players can play carrom board (board version) using a browser. Both players can share same browser interface.
Right now this version won't support remote location.

**Requirements**

- NodeJS   >= 6.4.x

- JDK      = 1.6 or 1.7

- Ant      = 1.9

- cocos2d  >=3.17

**Setup cocos2d**

- Download cocos2d-x-3.17.zip from http://www.cocos2d-x.org/download

- Extract cocos2d-x-3.17.

- Run command ```python setup.py```	in <path>/cocos2d-x-3.17/.
  
- Skip all options(Hit Enter key).

- execute command: ```source /home/<user>/.bashrc``` to make added system variables take effect”.
  
- Run command ```cocos``` to get help.

**How to run it**

- Run command ```npm install``` in the root folder of your project
- Run command  ```npm run setup``` in the root folder of your project

**Create build**

**Development**

- Run command ```npm start``` in the root folder of your project
- Take ```http://localhost:8081``` in any browser. This will load carrom board game in development mode.

**Production**

- Run command ```npm run production``` in the root folder of your project

- Copy html files (publish/html5/) to any webserver document root and call that webserver access url.


**Ready to try Pre build carrom board portal files**

- available in build folder and can be accessible by taking the url

**Communication**

- If you **find a bug**, open an issue.
- If you **have a feature request**, open an issue.
- If you **want to contribute**, submit a pull request.

**Author**


**License**
