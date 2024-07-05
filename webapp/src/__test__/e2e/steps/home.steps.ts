import { expect } from 'expect';
import { defineFeature, loadFeature } from 'jest-cucumber';
import * as puppeteer from 'puppeteer';

const feature = loadFeature('./src/__test__/e2e/features/home.feature');
const baseUrl = 'http://localhost:3000';

let page: puppeteer.Page;
let browser: puppeteer.Browser;

defineFeature(feature, (test) => {
    test('User can access the home page and click on the join button', ({ given, when, then }) => {
        beforeAll(async () => {
            browser = process.env.GITHUB_ACTIONS
                ? await puppeteer.launch()
                : await puppeteer.launch({ headless: false, slowMo: 50 });
            page = await browser.newPage();

            await page
                .goto(baseUrl, {
                    waitUntil: "networkidle0",
                })
                .catch(() => { });
        });

        afterAll(async () => {
            browser.close()
        })

        given('a guest user', () => {
            // No hay acciones necesarias para este paso, se asume que el usuario es un invitado.
        });

        when('the user accesses the home page', async () => {
            const headingText = await page.$eval('h1', element => element.textContent);
            expect(headingText).toMatch('¡Bienvenido a BidMon Universe!');
        });


        then('the user can click on the join button and be redirected to signup', async () => {
            // Obtener el texto del botón
            const buttonText = await page.$eval('button.btn', el => el.textContent);
            expect(buttonText).toMatch('¡Únete ahora!');

            await page.click('button.btn'); // Hacer clic en el botón ¡Únete ahora!

            // Verificar que la URL ha cambiado a /signup después del clic
            await page.waitForSelector('form', { visible: true });
            expect(page.url()).toContain('/signup');
        });

    });
});