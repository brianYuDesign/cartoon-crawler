import cheerio from "cheerio";
import fs from "fs";
import https from "https";
import dotenv from "dotenv";

// 模仿登入操作

import puppeteer from "puppeteer";

const loginAction = async browser => {
  const page = await browser.newPage();
  await page.goto("https://www.toptoon.net/");

  await page.click(".actionRightMenuBtn");

  await page.click("a[data-alert_page='formLogin/login']");
  await page.waitForTimeout(3000);
  // await page.waitForSelector("#alert", { visible: true });

  await page.type("input[type=email]", "brian831121@gmail.com");
  await page.type("input[type=password]", "a0961134525");

  await Promise.all([
    page.click("input[value='登入']"),
    page.waitForNavigation()
  ]);
  await page.goto("https://www.toptoon.net/comic/epList/80855");

  const $ = cheerio.load(await page.content());

  const title = $(".comicTitle>span[class='txt']").text();
  const urlList = [];

  const baseUrl = "https://www.toptoon.net";

  $(".episodeBox>a").map(async (i, link) => {
    urlList.push(baseUrl + link.attribs["href"]);
  });
  return { page, title, urlList };
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1024,
      height: 20000
    }
  });
  const { page, title, urlList } = await loginAction(browser);
  console.log("登入完成", title, urlList.length);
  console.log(urlList);
  //   console.log("登入完成", title, details.length);
  const cookies = await page.cookies();
  let cookieStr = "";

  cookies.forEach(i => {
    cookieStr += `${i.name}=${i.value}; `;
  });

  console.log(cookieStr);

  // for (const url of urlList) {
  //   await page.goto(url, { waitUntil: "networkidle2" });

  //   const body = await page.content();

  //   const $ = cheerio.load(body);
  //   const destFolder =
  //     "cartoons/" + $("a[title='目錄']").text().replace(/\s/g, "");
  //   const findImages = $("img[id^=set_]");
  //   if (findImages.length === 0) {
  //     console.log(destFolder, "沒有圖片");
  //     continue;
  //   }

  //   if (!fs.existsSync(destFolder)) {
  //     fs.mkdirSync(destFolder);
  //   }

  //   findImages.map(async (i, link) => {
  //     const path = link.attribs["src"];
  //     const fileName = path.substring(path.lastIndexOf("/") + 1);
  //     await https.get(
  //       path,
  //       {
  //         headers: {
  //           cookie: cookieStr,
  //           referer: "https://www.toomics.com.tw/"
  //         }
  //       },
  //       response => {
  //         response.pipe(fs.createWriteStream(`${destFolder}/${fileName}`));
  //       }
  //     );

  //     return link.attribs["src"];
  //   });
  // }

  await browser.close();
})();
