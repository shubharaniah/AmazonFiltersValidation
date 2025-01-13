const { test, expect } = require('@playwright/test');

test('To verify filters', async ({ page }) => {
    test.setTimeout(1000000)
    await page.goto('https://www.amazon.de/');
    await page.waitForLoadState("domcontentloaded")
    await page.reload()
    await page.waitForLoadState("domcontentloaded")
    await page.waitForTimeout(5000)
    //expect(page.locator("//*[@id='sp-cc-accept']")).toBeVisible()

    await page.locator("//*[@id='sp-cc-accept']").click()
    await page.locator("//div[@role='alertdialog']//span[child::span[contains(text(),'Dismiss')]]/input").click()
    await page.locator("//*[@id='nav-hamburger-menu']").click()

    await page.waitForTimeout(4000);
    await page.locator("//ul[@class='hmenu hmenu-visible']//a[child::div[text()='Electronics & Computers']]").click()

    await page.waitForTimeout(2000);
    await page.locator("(//a[text()='Phones & Accessories'])[2]").click()
    await page.waitForLoadState('domcontentloaded')

    await page.waitForTimeout(2000);
    await page.locator("//a[text()='Smartphones']").click()
    await page.waitForLoadState('domcontentloaded')

    await page.waitForTimeout(2000);
    expect(page.locator("//input[@aria-labelledby='Samsung']//following-sibling::i")).toBeVisible()
    await page.locator("//input[@aria-labelledby='Samsung']//following-sibling::i").click()
    await page.waitForLoadState('domcontentloaded')

    await page.waitForTimeout(2000)
    expect(page.locator("//a[contains(@aria-label,'Remove the filter') and child::span[text()='Samsung']]")).toBeVisible()
    await page.locator("//a[child::span[text()='New']]").click()
    await page.waitForLoadState('domcontentloaded')

    await page.waitForTimeout(6000)
    expect(page.locator("//span[text()='New' and contains(@class,'text-bold')]")).toBeVisible()
    const locator = page.locator("label[for$='p_36/range-slider_slider-item_upper-bound-slider'] span"); 
    await locator.evaluate((el, text) => {
        el.textContent = '€350';
        }, '€350');

    await page.locator("//input[@type='submit' and following-sibling::span[child::span[text()='Go']]]").click()
    await page.waitForLoadState('domcontentloaded')

    for(let index=1; index<=4; index++){
        await page.waitForTimeout(6000);
        await page.locator("(//div//div[@role='listitem'])["+index+"]//a[contains(@class,'text-normal')]").first().click()
        await page.waitForLoadState('domcontentloaded')

        const header = await page.locator("//*[@id='productTitle']").textContent()
        console.log("Product Title: "+header)
        expect(header.toLowerCase()).toContain('samsung')

        try{
            let value = await page.locator("//div[@id='corePriceDisplay_desktop_feature_div']//span[@class='a-price-whole']").allInnerTexts()

            let exactValue = parseInt(value.slice(0, 3))
            console.log(exactValue)
            if(exactValue <= 350)
                console.log("Price: "+exactValue+" \n is within 350 Euros")
            else
                console.log("Price: "+exactValue+" \n is NOT within 350 Euros")
        }catch(error){
            console.log("Price: not available")
        }
        
        await page.goBack()
        await page.waitForLoadState('domcontentloaded')
        //await page.waitForTimeout(3000)

        const locator = page.locator("label[for$='p_36/range-slider_slider-item_upper-bound-slider'] span"); 
        await locator.evaluate((el, text) => {
            el.textContent = '€350';
            }, '€350');

        await page.locator("//input[@type='submit' and following-sibling::span[child::span[text()='Go']]]").click()
        await page.waitForLoadState('domcontentloaded')
    }
    //await page.close()
  });