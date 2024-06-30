import { expect } from 'expect';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as puppeteer from 'puppeteer';

const feature = loadFeature('./__test__/e2e/features/signup.feature');
const baseUrl = 'http://localhost:3000/signup';

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
    beforeEach(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch()
            : await puppeteer.launch({ headless: false, slowMo: 50 });
        page = await browser.newPage();
        await page.goto(baseUrl, { waitUntil: "networkidle0" });
    });

    afterEach(async () => {
        await browser.close();
    });

    // test('Successful signup', ({ given, when, then }) => {
    //     given('a user fills out the registration form correctly', async () => {
    //         await page.waitForSelector('#username', { visible: true });
    //         await page.type('#username', 'newuser');
    //         await page.type('#password', 'StrongPass123!');
    //         await page.type('#confirmPassword', 'StrongPass123!');
    //         await page.type('//*[@id=":r3:"]', '01-01-2000');
    //     });

    //     when('the user submits the form', async () => {
    //         await page.click('#signupButton');
    //     });

    //     then('they should see a success message and be redirected to login', async () => {
    //         await page.waitForFunction(() => document.querySelectorAll('.swal2-container').length > 0);
    //         const swalText = await page.$eval('.swal2-html-container', el => el.textContent);
    //         expect(swalText).toContain('Cuenta creada');
    //         await page.waitForNavigation();
    //         expect(page.url()).toContain('/login');
    //     });
    // });

    test('Failed signup due to validation errors', ({ given, when, then }) => {
        given('a user fills out the registration form incorrectly', async () => {
            await page.waitForSelector('#username', { visible: true });
            await page.type('#username', 'user');
            await page.type('#password', '123');
            await page.type('#confirmPassword', '1234');
        });

        when('the user submits the form', async () => {
            await page.click('#signupButton');
        });

        then('they should see error messages', async () => {
            await page.waitForSelector('#password', { visible: true });
            const passwordError = await page.$eval('#password', el => el.textContent);
            expect(passwordError).toContain('error');
        });
    });
});
