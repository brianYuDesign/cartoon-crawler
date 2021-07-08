import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";
import https from "https";

// TODO: 取得影片清單
const baseUrl = "https://www.toomics.com.tw";
const cartoonCategoryUrl =
  "https://www.toomics.com.tw/tc/webtoon/episode/toon/5022";

const cookie =
  "content_lang=zh_tw; GTOOMICS_ext_id=t.1.1625631502.60e52b0e2d34c; GTOOMICScountry=country%3DTW%26time_zone%3D%2B08%3A00; GTOOMICSpidIntro=1; GTOOMICSpid_join=pid%3DdefaultPid%26subpid%3DdefaultSubPid%26subpid2%3DdefaultSubPid%26subpid3%3DdefaultSubPid%26channel%3DdefaultChannel; GTOOMICSpid_last=pid%3DdefaultPid%26subpid%3DdefaultSubPid%26subpid2%3DdefaultSubPid%26subpid3%3DdefaultSubPid%26channel%3DdefaultChannel; _gcl_au=1.1.435493541.1625631505; _ga=GA1.3.989027803.1625631506; _gid=GA1.3.571323431.1625631506; __lt__cid=bf7edc59-e408-4b0a-b35a-556c7cf68273; _ts_yjad=1625631506767; _rdt_uuid=1625631507403.046691be-f1dd-4efc-a2ba-6666479156c4; _pin_unauth=dWlkPU1XTXpaVEpsTm1NdE1tSmpNQzAwWVRZeExXRmhZV010WWpFMVlXRXdPRGswTVRObQ; first_open_episode=loading_bg; _scid=de262cb7-4597-4a55-a4d8-8f1159df5bb5; _sctr=1|1625587200000; __lt__sid=7f3aa3fc-f84921c4; GTOOMICSslave=sdb1; GTOOMICScisession=a%3A9%3A%7Bs%3A10%3A%22session_id%22%3Bs%3A32%3A%22e6e8a366ce9e88146e9f5650c5b6ecb3%22%3Bs%3A10%3A%22ip_address%22%3Bs%3A12%3A%2249.216.71.15%22%3Bs%3A10%3A%22user_agent%22%3Bs%3A120%3A%22Mozilla%2F5.0+%28Macintosh%3B+Intel+Mac+OS+X+10_15_7%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F91.0.4472.114+Safari%2F537.3%22%3Bs%3A13%3A%22last_activity%22%3Bi%3A1625675407%3Bs%3A7%3A%22display%22%3Bs%3A1%3A%22A%22%3Bs%3A11%3A%22family_mode%22%3Bs%3A1%3A%22N%22%3Bs%3A4%3A%22lang%22%3Bs%3A6%3A%22taiwan%22%3Bs%3A8%3A%22lang_seg%22%3Bs%3A2%3A%22tc%22%3Bs%3A10%3A%22tw_adultYN%22%3Bs%3A19%3A%222021-07-08+01%3A22%3A30%22%3B%7D001a0a82bc9489bce12698491eb5db6cfc030438; GTOOMICSnonlogin_view_list=4954%7C103304%7C2021-07-07+13%3A18%3A42%7C1%2C5022%7C99759%7C2021-07-07+13%3A18%3A56%7C1%2C5123%7C102492%7C2021-07-07+13%3A26%3A22%7C1%2C5183%7C107321%7C2021-07-07+13%3A26%3A41%7C1%2C5238%7C112387%7C2021-07-07+13%3A27%3A00%7C1%2C5238%7C112387%7C2021-07-07+13%3A30%3A40%7C1%2C5238%7C112388%7C2021-07-07+13%3A46%3A54%7C2%2C5238%7C112387%7C2021-07-07+13%3A57%3A06%7C1%2C5238%7C112388%7C2021-07-07+13%3A57%3A39%7C2%2C5238%7C112388%7C2021-07-07+16%3A36%3A34%7C2%2C5238%7C112387%7C2021-07-07+16%3A36%3A46%7C1%2C5238%7C112387%7C2021-07-07+18%3A28%3A45%7C1%2C5238%7C112387%7C2021-07-07+18%3A28%3A57%7C1%2C5123%7C103088%7C2021-07-07+18%3A30%3A02%7C0%2C5123%7C103088%7C2021-07-07+18%3A43%3A24%7C0%2C5123%7C103088%7C2021-07-07+18%3A43%3A25%7C0%2C5123%7C103088%7C2021-07-07+18%3A43%3A39%7C0%2C5123%7C103088%7C2021-07-07+19%3A05%3A58%7C0%2C5123%7C103088%7C2021-07-07+19%3A06%3A08%7C0%2C5123%7C103088%7C2021-07-07+19%3A15%3A48%7C0%2C5238%7C112387%7C2021-07-08+01%3A22%3A31%7C1%2C5238%7C112387%7C2021-07-08+01%3A22%3A37%7C1%2C5238%7C112388%7C2021-07-08+01%3A27%3A02%7C2%2C5238%7C112388%7C2021-07-08+01%3A30%3A07%7C2%2C; _gat_UA-114646527-1=1; backurl=https%3A//www.toomics.com.tw/tc/webtoon/detail/code/112388/ep/3/toon/5238; _uetsid=62947280deda11eb904f3bd6e59b3c24; _uetvid=6294ccc0deda11ebb0df05578db78817; ecc=NTIzOA%3D%3D%7CMTEyMzg3%7CMQ%3D%3D; cp=490%7C845";

fetch(cartoonCategoryUrl)
  .then(res => res.text())
  .then(html => {
    const $ = cheerio.load(html);
    const title = $(".title_content>h1").text();

    const cartoonDetails = [];

    $(".normal_ep>a").map((i, link) => {
      cartoonDetails.push({
        uri: retrieveLink(link.attribs["onclick"]),
        ecc: getEcc(link.attribs)
      });
    });
    return cartoonDetails;
  })
  .then(cartoonDetails => {
    console.log(cartoonDetails);
  });

const retrieveLink = str => {
  if (str.includes("location.href=")) {
    return baseUrl + str.substring(str.lastIndexOf("=") + 1).replace(/'/g, "");
  }
  return baseUrl + str.split(",")[2].replace(/'/g, "").replace(/\s/g, "");
};

const getEcc = obj => {
  let key = "";
  if (!key) {
    key = obj["data-e"] + "|" + obj["data-c"] + "|" + obj["data-v"];
  }
  return encodeURIComponent(key);
};

// TODO:單部影片
// const url =
//   "https://www.toomics.com.tw/tc/webtoon/detail/code/109431/ep/0/toon/5183";

// fetch(url, {
//   headers: {
//     cookie: cookie,
//     referer:
//       "https://www.toomics.com.tw/tc/webtoon/detail/code/112388/ep/3/toon/5238"
//   }
// })
//   .then(res => res.text())
//   .then(html => {
//     const $ = cheerio.load(html);

//     const findImages = $("img[id^=set_]");

//     if (findImages.length === 0) {
//       console.log("沒有圖片");
//       return;
//     }

//     const destFolder = 'cartoons/'+$("a[title='目錄']").text().replace(/\s/g, "");
//     console.log(destFolder);

//     if (!fs.existsSync(destFolder)) {
//       fs.mkdirSync(destFolder);
//     }

//     const images = findImages.map((i, link) => {
//       const path = link.attribs["data-src"];

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
//   });
