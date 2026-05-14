import { remote } from 'webdriverio';
import fs from 'fs';
import pino from 'pino';


const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',
  'appium:appPackage': 'com.shoptagr.test',
  'appium:appActivity': 'com.shoptagr.MainActivity',
};

const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'silent',
  capabilities,
};

if (!fs.existsSync('sessions')) {
  fs.mkdirSync();
}

/** @type {import('webdriverio').Browser} */
var driver;
var error;

/** @type {pino.Logger} */
var logger;

async function runTest() {
  driver = await remote(wdOpts);
  try {
    logger = pino(
      {
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: { colorize: true }
            },
            {
              target: 'pino/file',
              options: { destination: `sessions/${driver.sessionId}` }
            }
          ]
        }
      }
    );

    await driver.startRecordingScreen();

    const steps = Object.entries(scrollProfilePlan()).sort(([step]) => step);
    for (var [step, statement] of steps) {
      logger.info(`${step}`);
      await statement();
    }

    return;
  } catch (err) {
    error = err;
    logger.error(err);
  } finally {
    await driver.pause(2000);

    const video = await driver.stopRecordingScreen();
    if (error) {
      fs.writeFileSync(`sessions/${driver.sessionId}.mp4`, Buffer.from(video, "base64"));
    }

    await driver.deleteSession();
  }
}

function plan() {
  const steps = {
    "1. Click on 'I agree to our...'": async () => {
      await clickOn({ description: 'I agree' });
    },

    "2. Click on guest account (guestButton)": async () => {
      await clickOn({ description: 'guestButton' });
    },

    "3. Click on allow notifications": async () => {
      await clickOn({ description: 'Turn on Push Notifications' });
    },

    "4. Tap on 'Allow' (System Dialog)": async () => {
      await clickOn({ text: 'Allow', strict: true });
    },

    "5. Claim daily streak": async () => {
      await clickOn({ description: 'Claim daily streak' });
    },

    "6. Click on I'm committed": async () => {
      await clickOn({ description: "Commited" });
    },

    "7. Tap on 'Skip'": async () => {
      // Skip button in single view
      await driver.tap({ x: 1173, y: 235 });
    },

    "8. Scroll down (1 sec) and then up (1 sec)": async () => {
      await driver.pause(1000);
      await scroll('down', 'up');

    },

    "9. Tap on 'Shop' tab": async () => {
      await driver.pause(4000);
      await changeTab('Shop');
    },

    "10. Scroll down 3x (1 sec)": async () => {
      await scroll('down', 'down', 'down');
    },

    "11. Scroll up (1 sec)": async () => {
      await scroll('up');
    },

    "12. Click on bookmark of product (1 sec)": async () => {
      await clickOn({ description: 'enabledHeartButton' });
    },

    "13. Click on product": async () => {
      await clickOn({ description: 'product' });
    },

    "14. Scroll down (1 sec)": async () => {
      await scroll('down');
    },

    "15. Click on Favorites, Gifts, New Fits": async () => {
      await clickOn({ text: 'Favorites' });
      await clickOn({ text: 'Gifts' });
      await clickOn({ text: 'New Fits' });
    },

    "16. Click on 'View on ...'": async () => {
      await clickOn({ text: 'View on' });
    },

    "17. Click on X (wait 4 sec)": async () => {
      await clickOn({ description: 'close' });
      await driver.pause(4000);
    },

    "18. Scroll down 2x (1 sec)": async () => {
      await scroll('down', 'down');
    },

    "19. Scroll up": async () => {
      await scroll('up');
    },

    "20. Tap on search": async () => {
      await clickOn({ description: 'search' });
    },

    "21. Type Nike (wait 3 sec)": async () => {
      const input = await waitFor({ description: 'search' });
      await input.setValue('Nike');
      await driver.pause(3000);
    },

    "22. Scroll down (1 sec) and then scroll up (1 sec)": async () => {
      await scroll('down', 'up');
    },

    "23. Click on 'Items' subtab": async () => {
      await clickOn({ text: 'Items', strict: true });
    },

    "24. Scroll down (1 sec)": async () => {
      await scroll('down');
    },

    "25. Click on bookmark of 3 products (1 sec)": async () => {
      await clickOn({ description: 'bookmark' });
      await clickOn({ description: 'bookmark' });
      await clickOn({ description: 'bookmark' });
    },

    "26. Scroll down (1 sec)": async () => {
      await scroll('down');
    },

    "27. Click on bookmark of product (1 sec)": async () => {
      await clickOn({ description: 'bookmark' });
    },

    "28. Scroll up (0.5 sec)": async () => {
      await scroll('up');
    },

    "29. Click on X in search bar": async () => {
      await clickOn({ description: 'close' });
    },

    "30. Scroll up 2x (1 sec)": async () => {
      await scroll('up', 'up');
    },

    "31. Click on 'Wishlist' tab": async () => {
      await changeTab('Wishlist');
    },

    "32. Scroll down and up (1 sec)": async () => {
      await scroll('down', 'up');
    },

    "33. Click on 'New Fits' (1 sec)": async () => {
      await clickOn({ text: 'New Fits' });
    },

    "34. Click on 'Gifts' (1 sec)": async () => {
      await clickOn({ text: 'Gifts' });
    },

    "35. Click on 'Favorites' (1 sec)": async () => {
      await clickOn({ text: 'Favorites' });
    },

    "36. Click on filter icon (1 sec)": async () => {
      await clickOn({ description: 'filter' });
    },

    "37. Click outside bottom sheet": async () => {
      await driver.touchAction({
        action: 'tap',
        x: 10,
        y: 10,
      });
    },

    "38. Click on filter icon": async () => {
      await clickOn({ description: 'filter' });
    },

    "39. Click on 'Price: high to low": async () => {
      await clickOn({ text: 'Price: high to low' });
    },

    "40. Click on 'Apply' (2 sec)": async () => {
      await clickOn({ text: 'Apply', strict: true });
      await driver.pause(2000);
    },

    "41. Scroll down and up (1 sec)": async () => {
      await scroll('down', 'up');
    },

    "42. Click on profile icon": async () => {
      await clickOn({ description: 'profile' });
    },

    "43. Click on lists item": async () => {
      await clickOn({ text: 'lists' });
    },

    "44. Click on + icon": async () => {
      await clickOn({ description: 'add' });
    },

    "45. Click on list name input": async () => {
      await clickOn({ description: 'list name' });
    },

    "46. Type Hello": async () => {
      const input = await waitFor({ description: 'list name' });
      await input.setValue('Hello');
    },

    "47. Click on save list (3 sec)": async () => {
      await clickOn({ text: 'save' });
      await driver.pause(3000);
    },

    "48. Click on back arrow": async () => {
      await clickOn({ description: 'back' });
    },

    "49. Scroll down and up (1 sec)": async () => {
      await scroll('down', 'up');
    },

    "50. Click edit profile label": async () => {
      await clickOn({ text: 'Edit Profile' });
    },

    "51. Click first name input": async () => {
      await clickOn({ description: 'first name' });
    },

    "52. Type Hello": async () => {
      const input = await waitFor({ description: 'first name' });
      await input.setValue('Hello');
    },

    "53. Click last name input": async () => {
      await clickOn({ description: 'last name' });
    },

    "54. Type World": async () => {
      const input = await waitFor({ description: 'last name' });
      await input.setValue('World');
    },

    "55. Click on save": async () => {
      await clickOn({ text: 'Save', strict: true });
    },

    "56. Scroll down": async () => {
      await scroll('down');
    },
  };

  return steps;
}

function scrollProfilePlan() {
  const steps = {
    "1. Click on 'I agree to our...'": async () => {
      await clickOn({ description: 'I agree' });
    },

    "2. Click on guest account (guestButton)": async () => {
      await clickOn({ description: 'guestButton' });
    },

    "3. Click on allow notifications": async () => {
      await clickOn({ description: 'Turn on Push Notifications' });
    },

    "4. Tap on 'Allow' (System Dialog)": async () => {
      await clickOn({ text: 'Allow', strict: true });
    },

    "5. Claim daily streak": async () => {
      await clickOn({ description: 'Claim daily streak' });
    },

    "6. Click on I'm committed": async () => {
      await clickOn({ description: "Commited" });
    },

    "7. Tap on 'Skip'": async () => {
      // Skip button in single view
      await driver.tap({ x: 1173, y: 235 });
    },

    "8. Click on profile icon": async () => {
      await driver.pause(1000);
      await clickOn({ description: 'avatar' });
    },

    "9. Scroll down": async () => {
      await scroll('down');
    },

    "10. Read user id": async () => {
      const userId = await read({ description: 'User ID:' });
      logger.info(userId);
    },
  };

  return steps;
};

/**
 * Change app tab.
 *
 * @param {'Earn'|'Shop'|'Wishlist'} tab
 * @returns {Promise<void>}
 */
async function changeTab(tab) {
  await clickOn({
    description: tab
  });
}

/**
 * Click an element by visible text or content description.
 *
 * @param {Object} options
 * @param {string} [options.text] - Visible text match.
 * @param {string} [options.description] - Content-desc match.
 * @param {boolean} [options.strict=false] - Use exact match instead of contains().
 *
 * @returns {Promise<void>}
 */
async function clickOn({
  text,
  description,
  strict = false,
}) {
  let selector;

  if (description) {
    selector = strict
      ? `//*[@content-desc="${description}"]`
      : `//*[contains(@content-desc, "${description}")]`;
  } else if (text) {
    selector = strict
      ? `//*[@text="${text}"]`
      : `//*[contains(@text, "${text}")]`;
  } else {
    throw new Error('clickOn requires either text or description');
  }

  const el = await driver.$(selector);

  await el.waitForDisplayed();
  await el.click();
}

/**
 * Read text from an element matched by visible text or content description.
 *
 * @param {Object} options
 * @param {string} [options.text] - Visible text match.
 * @param {string} [options.description] - Content-desc match.
 *
 * @returns {Promise<string>} - Element text or content-desc value
 */
async function read({
  text,
  description,
}) {
  let selector;
  let mode; // tracks how we matched

  if (description) {
    selector = `//*[contains(@content-desc, "${description}")]`;
    mode = 'desc';
  } else if (text) {
    selector = `//*[contains(@text, "${text}")]`;
    mode = 'text';
  } else {
    throw new Error('read requires either text or description');
  }

  const el = await driver.$(selector);
  await el.waitForDisplayed();

  if (mode === 'desc') {
    return await el.getAttribute('content-desc');
  }

  return await el.getText();
}

/**
 * Wait until an element with matching text or content description is visible.
 *
 * @param {Object} options
 * @param {string} [options.text] - Visible text match.
 * @param {string} [options.description] - Content-desc match.
 * @param {boolean} [options.strict=false] - Use exact match instead of contains().
 * @param {number} [options.timeout=10000] - Max wait time in ms.
 *
 * @returns {Promise<WebdriverIO.Element>}
 */
async function waitFor({
  text,
  description,
  strict = false,
  timeout = 10000,
}) {
  let selector;

  if (description) {
    selector = strict
      ? `//*[@content-desc="${description}"]`
      : `//*[contains(@content-desc, "${description}")]`;
  } else if (text) {
    selector = strict
      ? `//*[@text="${text}"]`
      : `//*[contains(@text, "${text}")]`;
  } else {
    throw new Error('waitFor requires either text or description');
  }

  const el = await driver.$(selector);

  await el.waitForDisplayed({ timeout });

  return el;
}

/**
 * Smoothly scroll the screen in one or more directions.
 *
 * @param {...('up'|'down')} directions
 * @returns {Promise<void>}
 */
async function scroll(...directions) {
  const { width, height } = await driver.getWindowRect();

  const centerX = Math.floor(width / 2);

  for (const direction of directions) {
    const isDown = direction === 'down';

    const startY = isDown
      ? Math.floor(height * 0.7)
      : Math.floor(height * 0.3);

    const endY = isDown
      ? Math.floor(height * 0.3)
      : Math.floor(height * 0.7);

    await driver.performActions([
      {
        type: 'pointer',
        id: `finger1`,
        parameters: { pointerType: 'touch' },
        actions: [
          {
            type: 'pointerMove',
            duration: 0,
            x: centerX,
            y: startY,
          },
          {
            type: 'pointerDown',
            button: 0,
          },
          {
            type: 'pause',
            duration: 100,
          },
          {
            type: 'pointerMove',
            duration: 1000, // smooth 1 second scroll
            x: centerX,
            y: endY,
          },
          {
            type: 'pointerUp',
            button: 0,
          },
        ],
      },
    ]);

    await driver.releaseActions();

    // Small pause between chained scrolls
    await driver.pause(300);
  }
}

runTest();
