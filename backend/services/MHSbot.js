const pt = require("puppeteer-extra");
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const moment  = require("moment");
const {calculateAge}  = require("../utils");
const { trusted } = require("mongoose");
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

        for(let i = 0; i < targetInfo.length; i++) {
            await page.waitForSelector('#ddl_Description', { timeout: 20000 });

            // Select the first non-Description option for the current rater
            await page.evaluate((index) => {
                // Get all description dropdowns
                const descriptionDropdowns = Array.from(document.querySelectorAll('#ddl_Description'));
                const currentDropdown = descriptionDropdowns[index];
                
                if (currentDropdown) {
                    const options = Array.from(currentDropdown.options);
                    const validOption = options.find(option => 
                        option.value !== 'Description' && 
                        option.textContent !== 'Description'
                    );
                    
                    if (validOption) {
                        currentDropdown.value = validOption.value;
                        currentDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log('Selected option:', validOption.textContent);
                    }
                }
            }, i);

            await delay(2000);

            // Select Parent/Teacher based on index
            await page.evaluate((index, raterType) => {
                const raterTypeDropdowns = Array.from(document.querySelectorAll('#ddl_RaterType'));
                if (raterTypeDropdowns[index]) {
                    raterTypeDropdowns[index].value = raterType;
                    raterTypeDropdowns[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, i, targetInfo[i].sendTo);
            await delay(2000);

            // Select English for language
            await page.evaluate((index) => {
                const languageDropdowns = Array.from(document.querySelectorAll('#ddl_Language'));
                if (languageDropdowns[index]) {
                    languageDropdowns[index].value = "English";
                    languageDropdowns[index].dispatchEvent(new Event('change', { bubbles: true }));
                }
            }, i);
            await delay(1000);

            // Input rater name in the correct field
            await page.evaluate((index, name) => {
                const nameInputs = Array.from(document.querySelectorAll('input#txtRaterName'));
                if (nameInputs[index]) {
                    nameInputs[index].value = name;
                    nameInputs[index].dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, i, targetInfo[i].firstName + targetInfo[i].lastName);
            
            // Click "ADD ANOTHER RATER" button after first
            
            // Click ADD ANOTHER RATER" button after first rater
            if (i == 0 && targetInfo.length == 2 ) {
                try {
                    await page.waitForSelector('button#btn_addRow', { 
                        visible: true,
                        timeout: 5000 
                    });
                    
                    await page.click('button#btn_addRow');
                    console.log('Successfully clicked Add Another Rater button');
                    await delay(2000);
                } catch (error) {
                    console.error('Failed to add new rater:', error);
                    throw error;
                }
            }
        }
        // await page.waitForSelector('#ddl_Description', { timeout: 20000 });

        // // if(targetInfo.length > 0) {
        //     await page.waitForSelector('button#btn_addRow', { 
        //         visible: true,
        //         timeout: 5000 
        //     });
            
        //     // Try multiple methods to click the button
        //     try {
        //         await page.click('button#btn_addRow');
        //     } catch (clickError) {
        //         // Fallback to evaluate if direct click fails
        //         await page.evaluate(() => {
        //             const addButton = document.querySelector('button#btn_addRow');
        //             if (addButton) addButton.click();
        //         });
        //     }
        // //INPUT parent and teacher info
        // for(let i=0; i < targetInfo.length; i++) {
            
        //     targetInfo[i].fullName = targetInfo[i].firstName + targetInfo[i].lastName;

        //     await page.evaluate((index) => {
        //         // Get all description dropdowns
        //         const descriptionDropdowns = Array.from(document.querySelectorAll('#ddl_Description'));
        //         const currentDropdown = descriptionDropdowns[index];
                
        //         if (currentDropdown) {
        //             const options = Array.from(currentDropdown.options);
        //             const validOption = options.find(option => 
        //                 option.value !== 'Description' 
        //             );
                    
        //             if (validOption) {
        //                 currentDropdown.value = validOption.value; // Set the value to the first valid option
        //                 currentDropdown.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
        //             } else {
        //                 console.error('No valid options found to select.');
        //             }
        //         }
        //     }, i);

        // // Select the option that is not "description"
        // //     await page.evaluate(() => {
        // //     const selectElement = document.querySelector('#ddl_Description');
        // //     const options = Array.from(selectElement.options);
        // //     const validOption = options.find(option => option.value !== 'Description');
            
        // //     if (validOption) {
        // //         selectElement.value = validOption.value; // Set the value to the first valid option
        // //         selectElement.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
        // //     } else {
        // //         console.error('No valid options found to select.');
        // //     }
        // // });

        //     await delay(1000);
        //     await page.waitForSelector('#ddl_RaterType', { timeout: 5000 });
        //     await page.select('#ddl_RaterType', targetInfo[i].sendTo);
        //     await delay(1000);

        
        //     await page.waitForSelector('#ddl_Language');
        //     await page.select('#ddl_Language', "English");
        //     await delay(1000);

        //     await page.waitForSelector('input#txtRaterName', { timeout: 10000 });
        //     await page.type('input#txtRaterName', targetInfo[i].fullName, {delay: 100});
        //     //  if(i == 1) break;   
        //     //add row
        //     // const addRowButton = document.getElementById('btn_addRow');

        //     // // Add an event listener to the button
        //     // addRowButton.addEventListener('click', () => {
        //     //     // Logic to add another rater
        //     //     console.log('Add another rater button clicked');
        //     // });
        // }        


        await page.waitForSelector('input[value="Next"]', { timeout: 5000 });
        await page.$eval('input[value="Next"]', (el) => el.click());


        await delay(5000);
        await page.waitForSelector('input[value="GENERATE LINKS"]', { timeout: 3000 });
        await page.$eval('input[value="GENERATE LINKS"]', (el) => el.click());

        await page.waitForSelector('input.txtLinkBox', { 
            visible: true,
            timeout: 10000 
        });

        const links = await page.evaluate(() => {
            const linkInputs = Array.from(document.querySelectorAll('input.txtLinkBox'));
            const result = linkInputs.map(item=>item.value);
            return result;
         });
         const result = links.map((item, index)=>{
            console.log(item);
            const subresult = {};
            console.log(targetInfo[index].sendTo === 'Parent')
            Object.assign(subresult, targetInfo[index].sendTo === 'Parent' ? { parent: item} : { teacher: item });
            return subresult;
            }
        );


        // Get all links using Array.from
        
        console.log(result);

       


        await delay(1000);
        await page.waitForSelector('input[value="CONTINUE TO GENERATE AN EMAIL"]', { timeout: 1000 });
        await page.$eval('input[value="CONTINUE TO GENERATE AN EMAIL"]', (el) => el.click());

        await delay(1000);

      
            try {
                const emailInputs = await page.$$('input[name*="txtTeacherEmail"]');
                
                for (let i = 0; i < emailInputs.length; i++) {
                    await emailInputs[i].type(targetInfo[i].email, { delay: 100 });
                    await delay(1000); // Small delay between inputs
                }
                
                console.log('Successfully entered all teacher emails');
            } catch (error) {
                console.error('Failed to enter teacher emails:', error);
                throw error;
            }
      

        // await page.waitForSelector('input[tabindex="10"]', { timeout: 5000 });
        // await page.type('input[tabindex="10"]', targetInfo[i].email, {delay: 100});

        await page.waitForSelector('input[value="Next"]', { timeout: 1000 });
        await page.$eval('input[value="Next"]', (el) => el.click());

        const defaultOptionSelector = '#ddlEmailTemplate';
        await page.waitForSelector(defaultOptionSelector, {
            visible: true,
            timeout: 5000
        });

        // Select the specific option by value
        await page.select(defaultOptionSelector, 'd7f00042-25ac-ef11-99d0-005056b42b4f');
        console.log('Successfully selected default template');
        await delay(1000);
        await page.waitForSelector('input[value="Next"]', { timeout: 1000 });
        await page.$eval('input[value="Next"]', (el) => el.click());

     

        return result;

    } catch (err) {
        console.error('Failed to complete action:', err.message);
        throw err;
    }
}


const startScript = async(studentInfo, targetInfo)=>{
    console.log("S: ", studentInfo);
    console.log("T: ", targetInfo);
    
    const age = calculateAge(studentInfo.dateOfBirth);

    if(age.year < 2 || age.year > 18) 
        return { link: "", protocol: "MHS"};

    studentInfo.gender = studentInfo.gender == "male" ? "1": "2";
    targetInfo.forEach((item,index)=>{
        item.sendTo = item.sendTo == "parent" ? "Parent" : age.years < 6 ? "Teacher/Childcare Provider" : "Teacher";
    })
    console.log("updated", targetInfo);

    
    studentInfo.dateOfBirth = moment(studentInfo.dateOfBirth).format('YYYY MMM D');

    try {
        browser = await pt.launch({
            headless: false,
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
    
        await page.setViewport({ width: 1920, height: 1080 });

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
