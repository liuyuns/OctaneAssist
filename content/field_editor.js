(async function(){


  var toolbar = null;
  while (!toolbar){
    await waitForMillis(500);
    toolbar = document.querySelector("div[data-aid=toolbar]");
  }


  var top = toolbar.getBoundingClientRect().top;

  var target_top = top - 50;

  var div = document.createElement("div");

  var users = ["Shuhui Fu", "Bo Tian", "Yun-Sheng", "Xiao-Ming", "Yi-Bin"];

  var html = "";
  users.map(function(v, i){
    html += `<button ext-field='owner'>${v}</button>`;
  });

  div.innerHTML = `<span>Q Owner: </span>${html}`;

  div.style.position = "absolute";
  div.style.top = `${target_top}px`;
  div.style.right = "20px";

  document.body.appendChild(div);

  async function waitForMillis(ms){
    var p = new Promise((resolve, reject)=>{
      window.setTimeout(()=>resolve(), ms);
    });

    return p;
  }

  document.addEventListener("click", async function(e){
    var extId = e.target.getAttribute("ext-field");

    if (!extId){
      return;
    }

    console.log("click on " + e.target);

    var textToType = e.target.textContent.trim();

    var phaseField = document.querySelectorAll(`div.selected[field-name~=${extId}]`)[0];

    phaseField.click();
    console.log(`Click '${extId}' field ${Date()}`);

    const timeout = 1000;
    const waitPeriod = 300;
    var waitedTime = 0;


    while (waitedTime < timeout){
      await waitForMillis(waitPeriod);
      waitedTime += waitPeriod;

      var editor = document.querySelector('smart-editor');
      if (!!editor){
        break;
      }
    }

    console.log(`Smart Editor is shown @ ${Date()}`);

    chrome.runtime.sendMessage({greeting: textToType}, function(response) {
      console.log(response.farewell);
    });

    console.log(`Typed ${textToType} @ ${Date()}`);

    // var spans = document.querySelectorAll("span");
    // spans.forEach(function(s){
    //   if (s.innerText == "In Progress"){
    //     s.click();
    //   }
    // });

  }, true);


})()