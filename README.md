# Setup
This app should theoretically work on any platform as long as Node.js is installed (I am using v8.1.2)


>node --version
to check your node version

Clone the repository somewhere

> npm install

This will install all the dependencies you need


>node index.js

After this a QR code will appear on your terminal, scan it with your phone

# Commands
add <item> (example: add pg 13 #15-18). This will add whatever you put into x into your own list. For the example provided it'll add "pg 13 #15-18" to your list

remove <number> (example: remove 2). This will remove the second item in your list, the list is designed in a non-array fashion so it starts at 1, not 0.

list. This will show your entire list including numbers.

remindme XXhXXmXXs <message> (example: remindme 00h10m00s monkaS). This will send you a WeChat message after however much time you specified. For the example provided, it will send you a reminder with "monkaS" after 10 minutes

# License
no license whatsoever, you're free to do whatever you wish.

