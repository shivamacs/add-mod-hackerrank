# Automate Moderator Addition in HackerRank
This [script](https://github.com/shivamacs/add-mod-hackerrank/blob/master/script/moderatorWithPuppeteer.js) is developed using [Puppeteer](https://developers.google.com/web/tools/puppeteer). For more information on **puppeteer** visit this [link](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md). 

Here's what the running script looks like in action:
>![Demo](https://github.com/shivamacs/add-mod-hackerrank/blob/master/demo/demo.gif)
<br>[See full demo](https://github.com/shivamacs/add-mod-hackerrank/blob/master/demo/hackerrank-demo.mp4)

## Run
1. Clone this [repository](https://github.com/shivamacs/add-mod-hackerrank.git)
2. Requirements:
>[Node.js and npm](https://www.npmjs.com/get-npm)
><br>[Puppeteer](https://www.npmjs.com/package/puppeteer)
3. Go to *script/credentials.json* which is a template:
 ```
  {
    "un": "<your-account-username>",
    "pwd": "<your-account-password>",
    "url": "https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login"
  }
 ```
 >Replace the marked fields with your hackerrank account username and password.
 4. Navigate to the root folder and run the following commands:
 ```
 ~/../$ cd script
 ~/../script/$ node moderatorWithPuppeteer.js credentials.json <moderator-username-to-add>
 ```
 [See Puppeteer tutorial](https://www.toptal.com/puppeteer/headless-browser-puppeteer-tutorial)
