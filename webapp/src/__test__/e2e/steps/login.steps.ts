import { expect } from 'expect';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as puppeteer from 'puppeteer';

const feature = loadFeature('./src/__test__/e2e/features/login.feature');
const baseUrl = 'http://localhost:3000/login';

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
    beforeEach(async () => {
        browser = process.env.GITHUB_ACTIONS
            ? await puppeteer.launch()
            : await puppeteer.launch({ headless: false, slowMo: 50 });
        page = await browser.newPage();
        await page.goto(baseUrl, {
            waitUntil: "networkidle0",
        });
    });

    afterEach(async () => {
        await browser.close();
    });

    test('Successful login with a registered user', ({ given, when, then }) => {
        given('a registered user', async () => {
        });

        when('I fill in the form data and press submit', async () => {
            await page.waitForSelector('#username', { visible: true });
            await page.type('#username', 'test');
            await page.type('#password', 'Nueva1234-');
            await page.click('#loginButton');
        });

        then('I should be redirected to the logged-in page', async () => {
            await page.waitForSelector('table', { visible: true });
            expect(page.url()).toContain('/logued');
        });
    });

    test('Login attempt with an unregistered user', ({ given, when, then }) => {
        given('an unregistered user', async () => {
        });

        when('I fill in the form data and press submit', async () => {
            await page.waitForSelector('#username', { visible: true });
            await page.type('#username', 'fake_user');
            await page.type('#password', 'fake_password');
            await page.click('#loginButton');
        });

        then('an error message should appear', async () => {
            await page.waitForFunction(
                'document.querySelector("#username-error").innerText.includes("error")'
            );
            const errorMessage = await page.$eval('#username-error', el => el.textContent);
            expect(errorMessage).toMatch(/error/i);
        });
    });
});
