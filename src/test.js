// NOT GOOD
// import Crawler from "simplecrawler";
// import url from "url";
// const crawler = new Crawler(baseUrl);
// var jar = request.jar();

// request(baseUrl + "/tc", { jar: jar }, function (error, response, body) {
//   crawler.cookies.addFromHeaders(response.headers["set-cookie"]);
//   const $ = cheerio.load(body);
//   const formDefaults = {
//     user_id: "brian831121@gmail.com",
//     user_pw: "a0961134525"
//   };

//   request.post(
//     baseUrl + "/tc/auth/layer_login",
//     {
//       headers: {
//         origin: "https://www.toomics.com.tw",
//         referer: "https://www.toomics.com.tw/tc",
//         ["content-type"]: "application/x-www-form-urlencoded; charset=UTF-8"
//       },
//       // We can't be sure that all of the input fields have a correct default
//       // value. Maybe the user has to tick a checkbox or something similar in
//       // order to log in. This is something you have to find this out manually
//       // by logging in to the site in your browser and inspecting in the
//       // network panel of your favorite dev tools what parameters are included
//       // in the request.
//       form: {
//         user_id: "brian831121@gmail.com",
//         user_pw: "a0961134525",
//         save_user_id: 1,
//         keep_cookie: 1,
//         returnUrl: "/tc",
//         direction: "N",
//         vip_chk: "Y"
//       },
//       // We want to include the saved cookies from the last request in this
//       // one as well
//       jar: jar
//     },
//     function (error, response, body) {
//       console.log(response);
//       // That should do it! We're now ready to start the crawler
//       crawler.start();
//     }
//   );
// });

for (let index = 0; index < details.length; index++) {
  setTimeout(async () => {
    const url = getAdultValidUrl(details[index].url);
    await Promise.all([
      page.goto(url),
      page.waitForNavigation({ waitUntil: "load" })
    ]);

    const body = await page.content();

    const $ = cheerio.load(body);
    const findImages = $("img[id^=set_]");
    if (findImages.length === 0) {
      console.log("沒有圖片");
      return;
    }

    const destFolder =
      "cartoons/" + $("a[title='目錄']").text().replace(/\s/g, "");
    console.log(destFolder);

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }

    const images = [];
    findImages.map((i, link) => {
      const path = link.attribs["src"];
      images.push(path);
    });

    console.log(images);

    // request(
    //   url,
    //   {
    //     headers: {
    //       "set-cookie": ""
    //     }
    //   },
    //   function (error, response, body) {
    //     if (response.headers["set-cookie"]) {
    //       const $ = cheerio.load(body);
    //       const findImages = $("img[id^=set_]");
    //       if (findImages.length === 0) {
    //         console.log("沒有圖片");
    //         return;
    //       }

    //       const destFolder =
    //         "cartoons/" + $("a[title='目錄']").text().replace(/\s/g, "");
    //       console.log(destFolder);

    //       if (!fs.existsSync(destFolder)) {
    //         fs.mkdirSync(destFolder);
    //       }

    //       const images = findImages.map((i, link) => {
    //         const path = link.attribs["data-src"];

    //         const fileName = path.substring(path.lastIndexOf("/") + 1);
    //         const imageCookie =
    //           "content_lang=zh_tw; GTOOMICSslave=sdb3; GTOOMICS_ext_id=t.1.1625653025.60e57f21bdb98; GTOOMICScountry=country%3DTW%26time_zone%3D%2B08%3A00; GTOOMICSpidIntro=1; GTOOMICSpid_join=pid%3DdefaultPid%26subpid%3DdefaultSubPid%26subpid2%3DdefaultSubPid%26subpid3%3DdefaultSubPid%26channel%3DdefaultChannel; GTOOMICSpid_last=pid%3DdefaultPid%26subpid%3DdefaultSubPid%26subpid2%3DdefaultSubPid%26subpid3%3DdefaultSubPid%26channel%3DdefaultChannel; _gcl_au=1.1.740452786.1625653029; _fbp=fb.2.1625653029308.2013081743; backurl=; first_open_episode=loading_bg; _ga=GA1.3.2056601460.1625653030; _gid=GA1.3.1878925468.1625653030; _ts_yjad=1625653029899; _scid=2fe0d0e2-c757-4895-8cf0-080ac36c8dd4; _rdt_uuid=1625653030341.28296fa8-58c2-4b61-a518-f1b945439708; _pin_unauth=dWlkPU9URXpaRGszWVRJdE5ETTNPUzAwTlRFeUxXSTJNbVl0TWpJME1XWmtZVGt6Tm1NMw; GTOOMICScisession=a%3A7%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%225645a5d301d3824847fecf60aa87c7f6%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A12%3A%2249.216.71.15%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A120%3A%22Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_15_7%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F91.0.4472.114+Safari%2F537.3%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1625674382%3Bs%3A11%3A%22family_mode%22%3Bs%3A1%3A%22Y%22%3Bs%3A4%3A%22lang%22%3Bs%3A6%3A%22taiwan%22%3Bs%3A8%3A%22lang_seg%22%3Bs%3A2%3A%22tc%22%3B%7D649dcba243192216946639927a036c9cf1d656a2; _gat_UA-114646527-1=1; GTOOMICSnonlogin_view_list=5123%7C103088%7C2021-07-07+19%3A17%3A05%7C0%2C5123%7C103088%7C2021-07-08+00%3A55%3A52%7C0%2C5123%7C103088%7C2021-07-08+01%3A13%3A02%7C0%2C5123%7C103088%7C2021-07-08+01%3A13%3A33%7C0%2C5123%7C103088%7C2021-07-08+01%3A13%3A44%7C0%2C; _uetsid=7d2d3ed0df0c11eb9827c56fd75f2e7a; _uetvid=7d2da600df0c11eb814827a6e7720240";
    //         https.get(
    //           path,
    //           {
    //             headers: {
    //               cookie: imageCookie,
    //               referer: "https://www.toomics.com.tw/"
    //             }
    //           },
    //           response => {
    //             response.pipe(
    //               fs.createWriteStream(`${destFolder}/${fileName}`)
    //             );
    //           }
    //         );

    //         return link.attribs["src"];
    //       });
    //     }
    //   }
    // );

    // for (let index = 0; index < details.length; index++) {
    //   setTimeout(async () => {
    //     await Promise.all([
    //       page.goto(getAdultValidUrl(details[index].url)),
    //       page.waitForNavigation()
    //     ]);

    //     const body = await page.content();

    //     const $ = cheerio.load(body);
    //     const findImages = $("img[id^=set_image]");

    //     if (findImages.length === 0) {
    //       console.log("沒有圖片");
    //       return;
    //     }

    //     const destFolder =
    //       "cartoons/" + $("a[title='目錄']").text().replace(/\s/g, "");
    //     console.log(destFolder);

    //     if (!fs.existsSync(destFolder)) {
    //       fs.mkdirSync(destFolder);
    //     }

    //     const images = findImages.map((i, link) => {
    //       const path = link.attribs["data-src"];
    //       console.log(link.attribs);
    //       const fileName = path.substring(path.lastIndexOf("/") + 1);
    //       const imageCookie =
    //         "content_lang=zh_tw; GTOOMICSslave=sdb3; GTOOMICS_ext_id=t.1.1625653025.60e57f21bdb98; GTOOMICScountry=country%3DTW%26time_zone%3D%2B08%3A00; GTOOMICSpidIntro=1; GTOOMICSpid_join=pid%3DdefaultPid%26subpid%3DdefaultSubPid%26subpid2%3DdefaultSubPid%26subpid3%3DdefaultSubPid%26channel%3DdefaultChannel; GTOOMICSpid_last=pid%3DdefaultPid%26subpid%3DdefaultSubPid%26subpid2%3DdefaultSubPid%26subpid3%3DdefaultSubPid%26channel%3DdefaultChannel; _gcl_au=1.1.740452786.1625653029; _fbp=fb.2.1625653029308.2013081743; backurl=; first_open_episode=loading_bg; _ga=GA1.3.2056601460.1625653030; _gid=GA1.3.1878925468.1625653030; _ts_yjad=1625653029899; _scid=2fe0d0e2-c757-4895-8cf0-080ac36c8dd4; _rdt_uuid=1625653030341.28296fa8-58c2-4b61-a518-f1b945439708; _pin_unauth=dWlkPU9URXpaRGszWVRJdE5ETTNPUzAwTlRFeUxXSTJNbVl0TWpJME1XWmtZVGt6Tm1NMw; GTOOMICScisession=a%3A7%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%225645a5d301d3824847fecf60aa87c7f6%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A12%3A%2249.216.71.15%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A120%3A%22Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_15_7%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F91.0.4472.114+Safari%2F537.3%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1625674382%3Bs%3A11%3A%22family_mode%22%3Bs%3A1%3A%22Y%22%3Bs%3A4%3A%22lang%22%3Bs%3A6%3A%22taiwan%22%3Bs%3A8%3A%22lang_seg%22%3Bs%3A2%3A%22tc%22%3B%7D649dcba243192216946639927a036c9cf1d656a2; _gat_UA-114646527-1=1; GTOOMICSnonlogin_view_list=5123%7C103088%7C2021-07-07+19%3A17%3A05%7C0%2C5123%7C103088%7C2021-07-08+00%3A55%3A52%7C0%2C5123%7C103088%7C2021-07-08+01%3A13%3A02%7C0%2C5123%7C103088%7C2021-07-08+01%3A13%3A33%7C0%2C5123%7C103088%7C2021-07-08+01%3A13%3A44%7C0%2C; _uetsid=7d2d3ed0df0c11eb9827c56fd75f2e7a; _uetvid=7d2da600df0c11eb814827a6e7720240";
    //       https.get(
    //         path,
    //         {
    //           headers: {
    //             cookie: imageCookie,
    //             referer: "https://www.toomics.com.tw/"
    //           }
    //         },
    //         response => {
    //           response.pipe(fs.createWriteStream(`${destFolder}/${fileName}`));
    //         }
    //       );

    //       return link.attribs["src"];
    //     });
    // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    // await scrapeInfiniteScrollItems(page, extractItems, 100);

    // page.on("response", async response => {
    //   const url = response.url();
    //   if (
    //     response.request().resourceType() === "image" &&
    //     url.includes("contents")
    //   ) {
    //     console.log(url);
    //   }
    // });
  }, index * 3000);
}

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
