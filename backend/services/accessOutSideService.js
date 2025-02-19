const pt = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readline = require('readline');
const moment = require('moment');
// Add stealth plugin to better avoid detection
pt.use(StealthPlugin());

// Proxy configuration
// const PROXY_CONFIG = {
//     host: '23.26.94.209',
//     port: '6191',
//     username: 'bbnqvzas',
//     password: 'd6tj8mkhldfw'
// };

// Helper function for delays

const assessment = async (page, typeOfAssecss, targetInfo, studentInfo) => {
    const tableSelector = '#examineeGrid';

    // Wait for table and first row to be visible
    await page.waitForSelector(tableSelector, {
        visible: true,
        timeout: 5000,
    });
    // Get the position of the first row
    const elementHandle = await page.$(tableSelector);
    if (!elementHandle) {
        throw new Error('Could not find table row');
    }
    // Get element position
    const box = await elementHandle.boundingBox();
    await delay(500); // Small delay after mouse move
    // Click the element
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 }),
        page.mouse.click(box.x + box.width / 2, box.y + 80),
    ]);

    console.log('Successfully clicked table row');

    const assignNewAssessSelectors = 'input[value="Assign New Assessment"]';
    buttonElement = await page.waitForSelector(assignNewAssessSelectors, {
        visible: true,
        timeout: 5000,
    });
    try {
        await buttonElement.click();
    } catch (error) {
        console.log('Direct click failed, trying evaluate...');
    }

    await delay(3000); // Wait longer after click
    console.log('Successfully clicked Assign New Assessment button');
    const age = calculateAge(studentInfo.dateOfBirth);
    console.log(age);
    if (targetInfo.sendTo === 'parent') {
        if (age.years >= 12 && age.years < 22) {
            studentInfo.age = '2596';
        } else if (age.years >= 2 && age.years < 6) {
            studentInfo.age = '2600';
        }
    } else if (targetInfo.sendTo === 'teacher') {
        if (age.years >= 12 && age.years < 22) {
            studentInfo.age = '2608';
        } else if (age.years >= 6 && age.years < 12) {
            studentInfo.age = '2610';
        } else if (age.years >= 2 && age.years < 6) {
            studentInfo.age = '2612';
        }
    }

    if (typeOfAssecss == 'BASC') {
        console.log(studentInfo.age);
        await page.waitForSelector(`input[value="${studentInfo.age}"]`, {
            timeout: 3000,
        }); // 0-6
        await page.$eval(`input[value="${studentInfo.age}"]`, (el) =>
            el.click()
        );
    }

    if (typeOfAssecss == 'Vineland') {
        if (targetInfo.sendTo == 'parent') {
            await page.waitForSelector(`input[value="2728"]`, {
                timeout: 3000,
            }); // 0-6
            await page.$eval(`input[value="2728"]`, (el) => el.click());
        } else {
            await page.waitForSelector(`input[value="2729"]`, {
                timeout: 3000,
            }); // 0-6
            await page.$eval(`input[value="2729"`, (el) => el.click());
        }
    }

    await page.waitForSelector('input[value="Assign"]', { timeout: 3000 });
    await page.$eval('input[value="Assign"]', (el) => el.click());

    // Wait for the Send Link button to appear
    await delay(6000);

    // Try to find and click the envelope icon
    const envelopeSelector = 'svg.fa-envelope.fa-2x';
    await page.waitForSelector(envelopeSelector, {
        visible: true,
        timeout: 10000,
    });
    // Click the envelope icon
    try {
        await page.$eval(envelopeSelector, (el) => {
            // Find the clickable parent element that contains the SVG
            const clickableParent =
                el.closest('button') || el.closest('a') || el.parentElement;
            clickableParent.click();
        });
        console.log('Successfully clicked envelope icon');
    } catch (error) {
        console.error('Failed to click envelope icon:', error);
    }

    // Wait for Continue to E-mail button to appear
    await delay(3000);

    const firstNameSelector = '#respondentFirstName';
    await page.waitForSelector(firstNameSelector, {
        visible: true,
        timeout: 20000,
    });
    await page.type(firstNameSelector, targetInfo.firstName, { delay: 100 });

    // Fill in respondent's last name
    const lastNameSelector = '#respondentLastName';
    await page.waitForSelector(lastNameSelector, {
        visible: true,
        timeout: 20000,
    });
    await page.type(lastNameSelector, targetInfo.lastName, { delay: 100 });

    console.log('Successfully filled in respondent information');

    if (typeOfAssecss == 'Vineland') {
        await delay(1000);
        try {
            await page.evaluate(() => {
                const labels = Array.from(document.querySelectorAll('label'));
                console.log(labels);
                const includeLabels = labels.filter(
                    (label) =>
                        label.textContent.trim().toLowerCase() === 'include'
                );
                includeLabels.forEach((label) => label.click());
                console.log('Successfully clicked all Include labels');
            });
        } catch (err) {
            colnsole.log(err);
        }
        await delay(1000);
    }

    await delay(2000);
    const continueButtonSelector = 'button.btn-cta.btn-block';
    await page.waitForSelector(continueButtonSelector, {
        visible: true,
        timeout: 20000,
    });

    try {
        await page.click(continueButtonSelector);
        console.log('Successfully clicked Continue to E-mail button');
    } catch (error) {
        console.error('Failed to click Continue to E-mail button:', error);
        // Fallback method if direct click fails
        await page.$eval(continueButtonSelector, (button) => button.click());
    }
    // Wait for form fields to appear
    await delay(5000);

    // Wait for and click Create e-mail button (specifically the second button)
    try {
        // First try to find all buttons with the specific class
        const buttons = await page.$$(
            'button.btn-outline-primary.btn-sm.btn-block.btn-cta'
        );
        // Find the Create e-mail button by checking text content
        for (const button of buttons) {
            const text = await page.evaluate(
                (el) => el.textContent.trim(),
                button
            );
            if (text === 'Create e-mail') {
                await button.click();
                console.log('Successfully clicked Create e-mail button');
                break;
            }
        }
    } catch (error) {
        console.error('Failed to click Create e-mail button:', error);
    }

    await delay(2000);

    // Fill in the email address
    const emailInputSelector = '#to';

    await page.waitForSelector(emailInputSelector, {
        visible: true,
        timeout: 20000,
    });

    await page.type(emailInputSelector, targetInfo.email, { delay: 100 });

    console.log('Successfully entered email address');

    await delay(2000);

    // const sendEmailButtonSelector = 'button.btn-cta.btn-secondary';
    // await page.waitForSelector(sendEmailButtonSelector, {
    //     visible: true,
    //     timeout: 5000
    // });

    // try {
    //     await page.click(sendEmailButtonSelector);
    //     console.log('Successfully clicked Continue to send E-mail button');
    // } catch (error) {
    //     console.error('Failed to click Continue to send E-mail button:', error);
    // }

    // // Wait for page to settle after sending email
    // await delay(1000);

    try {
        // Wait for CKEditor iframe to load
        const frameSelector = 'iframe.cke_wysiwyg_frame';
        await page.waitForSelector(frameSelector, {
            visible: true,
            timeout: 5000,
        });

        // Get the link content from CKEditor
        const linkContent = await page.evaluate(() => {
            const editorFrame = document.querySelector(
                'iframe.cke_wysiwyg_frame'
            );
            if (editorFrame && editorFrame.contentDocument) {
                const links = editorFrame.contentDocument.querySelectorAll('a');
                // Return array of all link hrefs
                return Array.from(links).map((link) => ({
                    href: link.getAttribute('href'),
                    text: link.textContent,
                }));
            }
            return [];
        });
        return linkContent[0].href;
        // console.log('Found links in editor:', linkContent);
    } catch (error) {
        console.error('Failed to get link content from editor:', error);
    }
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const signIn = async (page) => {
    try {
        await page.waitForSelector('button#onetrust-accept-btn-handler');
        await page.$eval('button#onetrust-accept-btn-handler', (el) =>
            el.click()
        );

        await page.waitForSelector('#login\\:uname', { timeout: 5000 });
        await page.type('#login\\:uname', 'alexis.carter', { delay: 100 });
        await page.type('#login\\:pword', 'MakeMoney@40', { delay: 100 });
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'networkidle0',
                timeout: 10000,
            }),
            page.$eval('#login\\:signInButton', (el) => el.click()),
        ]);
    } catch (err) {
        console.error('Login failed:', err.message);
        throw err;
    }
};

const Action = async (page, studentInfo, targetInfo) => {
    try {
        // Wait for and click the New Examinee button
        const newExamineeSelector =
            '#searchForm\\:newExamineeButton, button[value="New Examinee"]';
        await page.waitForSelector(newExamineeSelector, {
            visible: true,
            timeout: 3000,
        });
        await page.click(newExamineeSelector);

        // Wait for the form page to load
        await delay(3000);

        // Try multiple possible selectors for the form
        const formSelectors = {
            firstName: '#firstName',
            middleName: '#middleName',
            lastName: '#lastName',
            gender: '#genderMenu',
            birthDate: '#calendarInputDate',
            saveButton: '#save',
        };

        // Wait for the form to be ready
        await page.waitForSelector(formSelectors.firstName, {
            visible: true,
            timeout: 5000,
        });
        await delay(1000);

        await page.type(formSelectors.birthDate, studentInfo.dateOfBirth, {
            delay: 200,
        });
        await delay(200);
        // Fill in the form fields
        await page.type(formSelectors.firstName, studentInfo.firstName, {
            delay: 50,
        });
        await delay(50);

        await page.type(formSelectors.middleName, studentInfo.middleName, {
            delay: 50,
        });
        await delay(50);

        await page.type(formSelectors.lastName, studentInfo.lastName, {
            delay: 50,
        });
        await delay(50);

        // Select option with value "51" from gender menu
        await page.waitForSelector(formSelectors.gender);
        await page.select(formSelectors.gender, studentInfo.gender);
        await delay(300);

        await page.waitForSelector(formSelectors.saveButton, { visible: true });
        await Promise.all([
            page.waitForNavigation({
                waitUntil: 'networkidle0',
                timeout: 6000,
            }),
            page.click(formSelectors.saveButton),
        ]);

        console.log('Successfully filled and submitted the form');

        await delay(2000);
        const linkarray = {};
        for (let i = 0; i < targetInfo.length; i++) {
            let sublink_array = [];
            let target_name = targetInfo[i].sendTo;
            let link_Basc = await assessment(
                page,
                'BASC',
                targetInfo[i],
                studentInfo
            );
            try {
                await page.evaluate(() => {
                    const links = Array.from(document.querySelectorAll('a'));
                    const homeLink = links.find(
                        (link) =>
                            link.textContent.trim() === 'Home' &&
                            (!link.getAttribute('href') ||
                                link.getAttribute('href') === '')
                    );
                    if (homeLink) {
                        homeLink.click();
                    }
                });
                console.log('Successfully clicked Sign Out link');

                // Wait for and click OK button in confirmation dialog
            } catch (error) {
                console.error('Failed goint to home process:', error);
            }
            let link_Vineland = await assessment(
                page,
                'Vineland',
                targetInfo[i],
                studentInfo
            );

            sublink_array.push(link_Basc);
            sublink_array.push(link_Vineland);
            linkarray[target_name] = sublink_array;

            try {
                await page.evaluate(() => {
                    const links = Array.from(document.querySelectorAll('a'));
                    const homeLink = links.find(
                        (link) =>
                            link.textContent.trim() === 'Home' &&
                            (!link.getAttribute('href') ||
                                link.getAttribute('href') === '')
                    );
                    if (homeLink) {
                        homeLink.click();
                    }
                });
                console.log('Successfully clicked Sign Out link');

                // Wait for and click OK button in confirmation dialog
            } catch (error) {
                console.error('Failed goint to home process:', error);
            }
        }

        try {
            await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'));
                const homeLink = links.find(
                    (link) =>
                        link.textContent.trim() === 'Home' &&
                        (!link.getAttribute('href') ||
                            link.getAttribute('href') === '')
                );
                if (homeLink) {
                    homeLink.click();
                }
            });
            console.log('Successfully clicked Sign Out link');

            // Wait for and click OK button in confirmation dialog
        } catch (error) {
            console.error('Failed goint to home process:', error);
        }

        // const links = {
        //     link_basc: link_basc,
        //     link_vineland: link_vineland,
        // }
        console.log(linkarray);
        return linkarray;
        //     const tableSelector = '#examineeGrid';

        //     // Wait for table and first row to be visible
        //     await page.waitForSelector(tableSelector, {
        //         visible: true,
        //         timeout: 5000
        //     });
        //     // Get the position of the first row
        //     const elementHandle = await page.$(tableSelector);
        //     if (!elementHandle) {
        //         throw new Error('Could not find table row');
        //     }
        //     // Get element position
        //     const box = await elementHandle.boundingBox();
        //     await delay(500); // Small delay after mouse move
        //     // Click the element
        //     await Promise.all([
        //         page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 20000 }),
        //         page.mouse.click(box.x + box.width / 2, box.y  + 80)
        //     ]);

        //     console.log('Successfully clicked table row');

        //     const assignNewAssessSelectors = 'input[value="Assign New Assessment"]';
        //     buttonElement = await page.waitForSelector(assignNewAssessSelectors, {
        //                     visible: true,
        //                     timeout: 5000
        //                 });
        //     try {
        //         await buttonElement.click();
        //     } catch (error) {
        //         console.log('Direct click failed, trying evaluate...');
        //     }

        //     await delay(3000); // Wait longer after click
        //     console.log('Successfully clicked Assign New Assessment button');

        //     await page.waitForSelector(`input[value="${studentInfo.age}"]`, { timeout: 3000 }); // 0-6
        //     await page.$eval(`input[value="${studentInfo.age}"]`, (el) => el.click());

        //     await page.waitForSelector('input[value="Assign"]', { timeout: 3000 });
        //     await page.$eval('input[value="Assign"]', (el) => el.click());

        // // Wait for the Send Link button to appear
        //     await delay(6000);

        // // Try to find and click the envelope icon
        //     const envelopeSelector = 'svg.fa-envelope.fa-2x';
        //     await page.waitForSelector(envelopeSelector, {
        //         visible: true,
        //         timeout: 10000
        //     });
        // // Click the envelope icon
        // try {
        //     await page.$eval(envelopeSelector, (el) => {
        //         // Find the clickable parent element that contains the SVG
        //         const clickableParent = el.closest('button') || el.closest('a') || el.parentElement;
        //         clickableParent.click();
        //     });
        //     console.log('Successfully clicked envelope icon');
        // } catch (error) {
        //     console.error('Failed to click envelope icon:', error);
        // }

        // // Wait for Continue to E-mail button to appear
        // await delay(3000);

        // const firstNameSelector = '#respondentFirstName';
        // await page.waitForSelector(firstNameSelector, {
        //     visible: true,
        //     timeout: 20000
        // });
        // await page.type(firstNameSelector, targetInfo.firstName, {delay: 100});

        // // Fill in respondent's last name
        // const lastNameSelector = '#respondentLastName';
        // await page.waitForSelector(lastNameSelector, {
        //     visible: true,
        //     timeout: 20000
        // });
        // await page.type(lastNameSelector, targetInfo.lastName, {delay: 100});

        // console.log('Successfully filled in respondent information');

        // await delay(2000);

        // const continueButtonSelector = 'button.btn-cta.btn-block';
        // await page.waitForSelector(continueButtonSelector, {
        //     visible: true,
        //     timeout: 10000
        // });

        // try {
        //     await page.click(continueButtonSelector);
        //     console.log('Successfully clicked Continue to E-mail button');
        // } catch (error) {
        //     console.error('Failed to click Continue to E-mail button:', error);
        //     // Fallback method if direct click fails
        //     await page.$eval(continueButtonSelector, button => button.click());
        // }
        // // Wait for form fields to appear
        // await delay(5000);

        // // Wait for and click Create e-mail button (specifically the second button)
        // try {
        //     // First try to find all buttons with the specific class
        //     const buttons = await page.$$('button.btn-outline-primary.btn-sm.btn-block.btn-cta');
        //     // Find the Create e-mail button by checking text content
        //     for (const button of buttons) {
        //         const text = await page.evaluate(el => el.textContent.trim(), button);
        //         if (text === 'Create e-mail') {
        //             await button.click();
        //             console.log('Successfully clicked Create e-mail button');
        //             break;
        //         }
        //     }
        // } catch (error) {
        //     console.error('Failed to click Create e-mail button:', error);
        // }

        // await delay(2000);

        // // Fill in the email address
        // const emailInputSelector = '#to';
        // await page.waitForSelector(emailInputSelector, {
        //     visible: true,
        //     timeout: 10000
        // });
        // await page.type(emailInputSelector, targetInfo.email, {delay: 100});

        // console.log('Successfully entered email address');

        // await delay(2000);

        // // const sendEmailButtonSelector = 'button.btn-cta.btn-secondary';
        // // await page.waitForSelector(sendEmailButtonSelector, {
        // //     visible: true,
        // //     timeout: 5000
        // // });

        // // try {
        // //     await page.click(sendEmailButtonSelector);
        // //     console.log('Successfully clicked Continue to send E-mail button');
        // // } catch (error) {
        // //     console.error('Failed to click Continue to send E-mail button:', error);
        // // }

        // // // Wait for page to settle after sending email
        // // await delay(1000);

        // try {
        //     // Wait for CKEditor iframe to load
        //     const frameSelector = 'iframe.cke_wysiwyg_frame';
        //     await page.waitForSelector(frameSelector, {
        //         visible: true,
        //         timeout: 5000
        //     });

        //     // Get the link content from CKEditor
        //     const linkContent = await page.evaluate(() => {
        //         const editorFrame = document.querySelector('iframe.cke_wysiwyg_frame');
        //         if (editorFrame && editorFrame.contentDocument) {
        //             const links = editorFrame.contentDocument.querySelectorAll('a');
        //             // Return array of all link hrefs
        //             return Array.from(links).map(link => ({
        //                 href: link.getAttribute('href'),
        //                 text: link.textContent
        //             }));
        //         }
        //         return [];
        //     });
        //     return linkContent[0].href;
        //     // console.log('Found links in editor:', linkContent);

        // } catch (error) {
        //     console.error('Failed to get link content from editor:', error);
        // }
        // try {
        //     await page.evaluate(() => {
        //         const links = Array.from(document.querySelectorAll('a'));
        //         const signOutLink = links.find(link =>
        //             link.textContent.trim() === 'Sign Out' &&
        //              (!link.getAttribute('href') || link.getAttribute('href') === '')
        //          );
        //          if (signOutLink) {
        //              signOutLink.click();
        //          }
        //      });
        //      console.log('Successfully clicked Sign Out link');

        //      // Wait for and click OK button in confirmation dialog
        //      try {
        //          await page.evaluate(() => {
        //              const okButton = document.querySelector('button.qg-left');
        //              if (okButton && okButton.textContent.trim() === 'OK') {
        //                  okButton.click();
        //                  console.log("Successfully clicked ok button");
        //              }
        //          });
        //      } catch (fallbackError) {
        //          console.error('Failed to click OK button:', fallbackError);
        //      }
        //  } catch (error) {
        //      console.error('Failed during sign out process:', error);
        //  }

        // Final delay to ensure logout completes
        // await delay(5000);
    } catch (err) {
        console.error(
            'Failed during form filling or button clicking:',
            err.message
        );
        throw err;
    }
};

// Retry helper function
const retry = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';

    const today = new Date();
    const birth = new Date(dateOfBirth);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birth.getDate())) {
        years--;
        months += 12;
    }

    if (today.getDate() < birth.getDate()) {
        months--;
        if (months < 0) {
            months = 11;
            years--;
        }
    }

    return {
        years: years,
        months: months,
    };
};

let browser;
const accessOutSide = async (studentInfo, targetInfo) => {
    if (studentInfo.gender === 'true') {
        studentInfo.gender = '50'; // male
    } else {
        studentInfo.gender = '51'; // female
    }

    const age = calculateAge(studentInfo.dateOfBirth);
    if (age.years < 2 || age.years > 22 || (age.years >= 6 && age.years < 12)) {
        const result_links = {
            link_basc: '',
            link_vineland: '',
        };
        return {
            link: result_links,
            protocol: 'Qglobal',
        };
    }

    // if (targetInfo.sendTo === "parent") {
    //     if (age.years >= 12  && age.years < 22) {
    //         studentInfo.age = "2596";
    //     }
    //     else if (age.years >= 2 && age.years < 6) {
    //         studentInfo.age = "2600";
    //     }
    // } else if (targetInfo.sendTo === "teacher") {
    //     if (age.years >= 12  && age.years < 22) {
    //         studentInfo.age = "2608";
    //     } else if (age.years >= 6 && age.years < 12) {
    //         studentInfo.age = "2610";
    //     } else if (age.years >= 2 && page.years < 6) {
    //         studentInfo.age = "2612";
    //     }
    // }

    studentInfo.dateOfBirth = moment(studentInfo.dateOfBirth).format(
        'MM/DD/YYYY'
    );

    try {
        browser = await pt.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                //  `--proxy-server=${PROXY_CONFIG.host}:${PROXY_CONFIG.port}`
            ],
            defaultViewport: null,
        });

        const [page] = await browser.pages();

        // Authenticate with the proxy
        //  await page.authenticate({
        //      username: PROXY_CONFIG.username,
        //      password: PROXY_CONFIG.password
        //  });

        await retry(() =>
            page.goto('https://qglobal.pearsonassessments.com/qg/login.seam', {
                waitUntil: 'networkidle0',
                timeout: 30000,
            })
        );

        await signIn(page);
        const result_links = await Action(page, studentInfo, targetInfo);
        const result = {
            link: result_links,
            protocol: 'Qglobal',
        };
        console.log(result_links);
        return result;
    } catch (err) {
        console.error('Script failed:', err.message);
        if (browser) await browser.close();
    }

    //  sendEmailWithDoc(targetInfo);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
    if (browser) browser.close();
});

module.exports = accessOutSide;
