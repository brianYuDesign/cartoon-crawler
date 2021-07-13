import cheerio from "cheerio";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";

// 模仿登入操作

import puppeteer from "puppeteer";

const loginAction = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1024,
      height: 20000
    }
  });
  const page = await browser.newPage();
  await page.goto("https://www.toomics.com.tw/tc/webtoon/episode/toon/5123");
  await page.click("#toggle-login");
  await page.click(".section_sns_sign_wrap01>button");

  await page.$eval("#user_id", el => (el.value = "brian831121@gmail.com"));
  await page.$eval("#user_pw", el => (el.value = "a0961134525"));

  await Promise.all([
    page.click("#login_fieldset>button[type=submit]"),
    page.waitForNavigation({ waitUntil: "networkidle2" })
  ]);

  const $ = cheerio.load(await page.content());
  const title = $(".title_content>h1").text();
  const cartoonDetails = [];

  $(".normal_ep>a").map(async (i, link) => {
    try {
      cartoonDetails.push({
        url: retrieveLink(link.attribs["onclick"]),
        ecc: getEcc(link.attribs)
      });
    } catch (error) {
      console.log(error);
    }
  });

  return { page, title, details: cartoonDetails };
};

(async () => {
  const { page, title, details } = await loginAction();
  console.log("登入完成", title, details.length);
  const cookies = await page.cookies();
  let cookieStr = "";

  cookies.forEach(i => {
    cookieStr += `${i.name}=${i.value}; `;
  });

  console.log(cookieStr);

  for (const detail of details) {
    const url = getAdultValidUrl(detail.url);
    await page.goto(url, { waitUntil: "networkidle2" });

    const body = await page.content();

    const $ = cheerio.load(body);
    const destFolder =
      "cartoons/" + $("a[title='目錄']").text().replace(/\s/g, "");
    const findImages = $("img[id^=set_]");
    if (findImages.length === 0) {
      console.log(destFolder, "沒有圖片");
      continue;
    }

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }

    findImages.map(async (i, link) => {
      const path = link.attribs["src"];
      const fileName = path.substring(path.lastIndexOf("/") + 1);
      await https.get(
        path,
        {
          headers: {
            cookie: cookieStr,
            referer: "https://www.toomics.com.tw/"
          }
        },
        response => {
          response.pipe(fs.createWriteStream(`${destFolder}/${fileName}`));
        }
      );

      return link.attribs["src"];
    });
  }

  await browser.close();
})();

function extractItems() {
  const extractedElements = document.querySelectorAll("img[id^=set_]");
  const items = [];
  for (let element of extractedElements) {
    items.push(element.innerText);
  }
  return items;
}

async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitFor(scrollDelay);
    }
  } catch (e) {}
  return items;
}

// TODO: 測試only cookie env 是否work
// TODO: 找尋18禁cookie(OK)

// 取得影片清單
const baseUrl = "https://www.toomics.com.tw";

const retrieveLink = str => {
  if (str.includes("location.href=")) {
    return str.substring(str.lastIndexOf("=") + 1).replace(/'/g, "");
  }
  return str.split(",")[2].replace(/'/g, "").replace(/\s/g, "");
};

const getEcc = obj => {
  let key = "";
  if (!key) {
    key = obj["data-e"] + "|" + obj["data-c"] + "|" + obj["data-v"];
  }
  return encodeURIComponent(key);
};

const getAdultValidUrl = returnUrl => {
  return baseUrl + "/index/set_display/?display=A&return=" + returnUrl;
};