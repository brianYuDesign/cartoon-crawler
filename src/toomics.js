import cheerio from "cheerio";
import fs from "fs";
import https from "https";
import puppeteer from "puppeteer";

const baseUrl = "https://www.toomics.com.tw";

const loginAction = async browser => {
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
  const urlList = [];

  $(".normal_ep>a").map(async (i, link) => {
    try {
      urlList.push(getAdultValidUrl(retrieveLink(link.attribs["onclick"])));
    } catch (error) {
      console.log(error);
    }
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
  const cookies = await page.cookies();
  let cookieStr = "";

  cookies.forEach(i => {
    cookieStr += `${i.name}=${i.value}; `;
  });

  console.log(cookieStr);

  for (const url of urlList) {
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

// 取得影片清單

const retrieveLink = str => {
  if (str.includes("location.href=")) {
    return str.substring(str.lastIndexOf("=") + 1).replace(/'/g, "");
  }
  return str.split(",")[2].replace(/'/g, "").replace(/\s/g, "");
};

const getAdultValidUrl = returnUrl => {
  return baseUrl + "/index/set_display/?display=A&return=" + returnUrl;
};
