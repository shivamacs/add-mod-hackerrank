/* Task -> Login into hackerrank website and add a moderator to each challenge. Moderator username is provided
   as input arguments. Here, we are doing this using puppeteer
*/
let fs = require('fs');
let path = require('path');

let puppeteer = require('puppeteer');

let credentialsFile = process.argv[2];
let moderatorToAdd = process.argv[3];

(async function() {
    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            headless: false,
            defaultViewport: null,
            slowMo: 5,
            args: ['--start-fullscreen', '--disable-notifications']
        });

        let credentialsObject = await fs.promises.readFile(credentialsFile, 'utf-8');
        let credentials = JSON.parse(credentialsObject);

        let username = credentials.un;
        let password = credentials.pwd;
        let url = credentials.url;

        let pages = await browser.pages();
        let page = pages[0];

        await page.goto(url, { waitUntil: 'networkidle0' });

        await page.waitForSelector('.auth-button', { visible: true });
        await page.type('#input-1', username);
        await page.type('#input-2', password);
        await page.click('.auth-button');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        // Administration link is clicked by selecting from the drop-down menu
        await page.waitForSelector('.profile-menu .ui-icon-chevron-down.down-icon', { visible: true });
        // open drop down menu    
        await page.click('.profile-menu .ui-icon-chevron-down.down-icon');
        // click Administration link
        await page.click('[data-analytics=NavBarProfileDropDownAdministration]');

        // find and click 'Manage Challenges'
        await page.waitForSelector('ul.nav-tabs', { visible: true });
        let manageLis = await page.$$('ul.nav-tabs li a');
        // await manageLis[1].click();
        let manageChallHref = await page.evaluate(element => element.getAttribute('href'), manageLis[1]);
        await page.goto(path.join('https://hackerrank.com', manageChallHref), { waitUntil : 'networkidle0' });

        // await page.waitForNavigation({ waitUntil: 'networkidle0' });

        let challengesUrl = page.url();

        let questionIndex = 0;
        let questionElement = await getQuestionElement(challengesUrl, questionIndex, page);

        while(questionElement !== undefined) {
            await handleQuestion(questionElement, page);
            questionIndex++;

            questionElement = await getQuestionElement(challengesUrl, questionIndex, page);
        }

        console.log('Script successful.');

        browser.close();
    } catch(err) {
        console.log(err);
    }
})();

async function getQuestionElement(challengesUrl, questionIndex, page) {
    await page.goto(challengesUrl, { waitUntil: 'networkidle0'} );

    let pageIndex = parseInt(questionIndex / 10);
    questionIndex = questionIndex % 10;

    await page.waitForSelector('.pagination li', { visible: true });
    let paginationButtons = await page.$$('.pagination li');
    let nextPageButton = paginationButtons[paginationButtons.length - 2];
    let classOnNextPageButton = await page.evaluate(function(element) {
        return element.getAttribute('class');
    }, nextPageButton);

    for (let i = 0; i < pageIndex; i++) {
        if (classOnNextPageButton !== "disabled") {
            await nextPageButton.click();

            await page.waitForSelector('.pagination li', { visible: true });
            paginationButtons = await page.$$('.pagination li');
            nextPageButton = paginationButtons[paginationButtons.length - 2];
            classOnNextPageButton = await page.evaluate(function(element) {
                return element.getAttribute('class');
            }, nextPageButton);
        } else {
            return undefined;
        }
    }

    await page.waitForSelector('.backbone.block-center', { visible: true });

    let questionElements = await page.$$('.backbone.block-center');

    if (questionIndex < questionElements.length) {
        return questionElements[questionIndex];
    } else {
        return undefined;
    }
}

async function handleQuestion(questionElement, page) {
    await questionElement.click();
    
    await page.waitForSelector('span.tag', { visible: true });

    await page.click('li[data-tab=moderators]');

    await page.waitForSelector('#moderator', { visible: true });
    await page.type('#moderator', moderatorToAdd);
    await page.keyboard.press("Enter");

    await page.click('.save-challenge');
}