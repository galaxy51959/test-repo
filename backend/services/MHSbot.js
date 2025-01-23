const pt = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const moment  = require("moment");
pt.use(StealthPlugin());
// const PROXY_CONFIG = {
//     host: '23.26.94.209',
//     port: '6191',
//     username: 'bbnqvzas',
//     password: 'd6tj8mkhldfw'
// };

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};
const signIn = async (page) => {
    try {
        // Wait for username field and type username
        await page.waitForSelector("input#txtUsername", { timeout: 10000 });
        await page.type("input#txtUsername", "acarter@elumatherapy.com", {delay: 100});
        
        // Wait for password field and type password
        await page.waitForSelector("input#txtPassword", { timeout: 5000 });
        await page.type("input#txtPassword", "1.AAssssaa", {delay: 100});

        // Click login button
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 50000 }),
            page.$eval("#cmdLogin", el => el.click())
        ]);

    } catch (err) {
        console.error('Login failed:', err.message);
        throw err;
    }
};
let browser;

const MainAction = async(page, studentInfo, targetInfo) => {
    try {
        // Wait for 5 seconds after login
        await delay(5000);

        // Wait for and click the go button
        await page.waitForSelector('#btn-go', { timeout: 10000 });
        await page.$eval('#btn-go', (el) => {
            el.click();
            console.log("Found and clicked go button");
        });

        // Wait for and click the envelope icon
        await page.waitForSelector('i.fa.fa-envelope-o', { timeout: 10000 });
        await page.$eval('i.fa.fa-envelope-o', (el) => {
            el.click();
            console.log("Found and clicked envelope icon");
        });

        delay(5000);
        await page.waitForSelector('input[value="Add New Client"]', { timeout: 10000 });
        await page.$eval('input[value="Add New Client"]', (el) => el.click());

        await page.waitForSelector('input[tabindex="1"]', { timeout: 50000 });
        await page.type('input[name="ctrl__Controls_Product_Custom_ASRS_Wizard_InviteWizardContainer_ascx$ClientProfile$txtFirstName"]', studentInfo.firstName, {delay: 100});
        
        // Wait for password field and type password
        await page.waitForSelector('input[tabindex="2"]', { timeout: 50000 });
        await page.type('input[tabindex="2"]', studentInfo.lastName, {delay: 100});

        await page.waitForSelector('input#ctrl__Controls_Product_Custom_ASRS_Wizard_InviteWizardContainer_ascx_ClientProfile_txtDOB_dateInput', { timeout: 50000 });
        await page.type("input#ctrl__Controls_Product_Custom_ASRS_Wizard_InviteWizardContainer_ascx_ClientProfile_txtDOB_dateInput", studentInfo.dateOfBirth, {delay: 100});

        await page.waitForSelector('input[tabindex="7"]', { timeout: 50000 });
        await page.type('input[tabindex="7"]', "", {delay: 100});

        await page.waitForSelector(`input[value="${studentInfo.gender}"]`, { timeout: 5000 });
        await page.$eval(`input[value="${studentInfo.gender}"]`, (el) => el.click());

        await page.waitForSelector('input[value="SAVE"]', { timeout: 3000 });
        await page.$eval('input[value="SAVE"]', (el) => el.click());

        delay(5000);

        await page.waitForSelector('#ddl_Description', { timeout: 20000 });

        // Select the option that is not "description"
        await page.evaluate(() => {
            const selectElement = document.querySelector('#ddl_Description');
            const options = Array.from(selectElement.options);
            const validOption = options.find(option => option.value !== 'Description');
            
            if (validOption) {
                selectElement.value = validOption.value; // Set the value to the first valid option
                selectElement.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
            } else {
                console.error('No valid options found to select.');
            }
        });

        await delay(1000);

        await page.waitForSelector('#ddl_RaterType', { timeout: 5000 });
        await page.select('#ddl_RaterType', targetInfo.sendTo);
        await delay(1000);

        await page.waitForSelector('#ddl_Language');
        await page.select('#ddl_Language', "English");
        await delay(1000);

        await page.waitForSelector('input#txtRaterName', { timeout: 10000 });
        await page.type('input#txtRaterName',targetInfo.fullName, {delay: 100});

        await page.waitForSelector('input[value="Next"]', { timeout: 1000 });
        await page.$eval('input[value="Next"]', (el) => el.click());

        await delay(5000);
        await page.waitForSelector('input[value="GENERATE LINKS"]', { timeout: 3000 });
        await page.$eval('input[value="GENERATE LINKS"]', (el) => el.click());

        await page.waitForSelector('#ctrl__Controls_Product_Custom_ASRS_Wizard_InviteWizardContainer_ascx_CreateLink_rptraters_txtLink_0', { timeout: 10000 });
        const linkContent = await page.$eval('#ctrl__Controls_Product_Custom_ASRS_Wizard_InviteWizardContainer_ascx_CreateLink_rptraters_txtLink_0', el => el.value);

        return linkContent;

    } catch (err) {
        console.error('Failed to complete action:', err.message);
        throw err;
    }
}

const startScript = async(studentInfo, targetInfo)=>{
    console.log("S: ", studentInfo);
    console.log("T: ", targetInfo);

    studentInfo.gender = studentInfo.gender == "male" ? "1": "2";
    targetInfo.sendTo = targetInfo.sendTo == "parent" ? "Parent" : "Teacher";

    console.log(studentInfo.gender, targetInfo.sendTo);
    targetInfo.fullName = targetInfo.firstName + targetInfo.lastName;
    studentInfo.dateOfBirth = moment(studentInfo.dateOfBirth).format('YYYY MMM D');

    try {
        browser = await pt.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                // `--proxy-server=${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`
            ],
            defaultViewport: null
        });
    
        const [page] = await browser.pages();
       
        // Authenticate with the proxy
        // await page.authenticate({
        //     username: PROXY_CONFIG.username,
        //     password: PROXY_CONFIG.password
        // });
    
        await retry(() =>
            page.goto("https://assess.mhs.com/Account/Login.aspx", {
                waitUntil: "networkidle0",
                timeout: 30000
            })
        );
    
        await signIn(page);
        const result_link = await MainAction(page, studentInfo, targetInfo);
        const result = {
            link: result_link,
            protocol: "MHS"
        }
        return result;
    
    } catch (err) {
        console.error('Script failed:', err.message);
        if (browser) await browser.close();
    }
}
process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    if (browser) browser.close();
});

module.exports = startScript;
