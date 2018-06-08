(function() {
  function formatItem(id, name) {
    return `#${id}: ${name}`;
  }

  function getIndex(row) {
    var regex = /item-index-([0-9]+)/;
    var match = regex.exec(row.className);
    return !!match && match.length > 1 && parseInt(match[1]);
  };

  function getOctaneItemsText() {

    var singleHeader = document.querySelector('div[class*=alm-entity-form-header]');
    if (!!singleHeader) {
      // Single item.
      var idSpan = document.querySelector('span[class*=entity-form-document-view-header-entity-id-container]')
      var id = idSpan.textContent;

      var nameLabel = document.querySelector("label[data-field-name='name']");
      var title = nameLabel && nameLabel.textContent.trim();
      if (!title) {
        var input = nameLabel.querySelector("input");
        title = !!input && input.value && input.value.trim();
      }

      return formatItem(id, title);
    }

    console.log("List mode");

    // List view.
    var rowsList = document.querySelectorAll("div[class*=slick-row]");
    var rows = Array.prototype.map.call(rowsList, x => x);

    rows.every(row => {
      row.indexX = getIndex(row);
      return true;
    });

    rows.sort((rowx, rowy) => rowx.indexX - rowy.indexX);

    var selectedItems = [];
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (!row.querySelector("div[class*=selected]")) {
        continue;
      }

      var cellx = row.querySelector(
        "div[class*=grid__entity-initials-label__box]"
      );
      var titleCell = cellx.parentElement.children[1];
      var idCell = row.querySelector("a[class*=alm-entity-grid-id-column]");

      if (!!idCell && !!titleCell) {
        var id = idCell.textContent;
        var title = titleCell.textContent;

        var item = formatItem(id, title);
        selectedItems.push(item);
      }
    }

    return selectedItems.join("\r\n");
  }

  function getAGMItemsText() {
    var url = document.URL;
    var id;
    var matches = url.match(/entityId=(\d+)/);
    if (matches) {
      id = matches[1];
    }

    if (!!id) {
      var title = "";
      var h2 = document.getElementById("gwt-debug-cell-name");
      if (h2) {
        title = h2.textContent.trim();
      }
      return id && title ? formatItem(id, title) : "";
    }

    var selected = document.querySelectorAll(".x-grid3-row-selected");
    var items = [];
    for (var i = 0; i < selected.length; i++) {
      var row = selected[i];
      var idCol = row.querySelector("#gwt-debug-col-id-id");
      var nameCol = row.querySelector("#gwt-debug-col-id-name");
      if (!!idCol && !!nameCol) {
        items.push(
          formatItem(idCol.textContent.trim(), nameCol.textContent.trim())
        );
      }
    }

    return items.join("\r\n");
  }

  function prompt(text) {
    var divId = "__agm_assist_prompt";

    var remove = function() {
      var d = document.getElementById(divId);
      if (d) {
        document.body.removeChild(d);
      }
    };

    remove();

    function htmlToElements(html) {
      var template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childNodes;
    }

    var outerDivHtml = `<div id='${divId}' style='position:fixed; margin-top:100px; z-index:10000; left:30%; right:30%; background:lightyellow; white-space:pre-line'></div>`;
    var innerDivHtml = `<div style='text-align:left; color:green; margin: 10px; line-height:1.5; font-size: 120%'></div>`;

    var outerDiv = htmlToElements(outerDivHtml)[0];
    var innerDiv = htmlToElements(innerDivHtml)[0];
    outerDiv.appendChild(innerDiv);

    innerDiv.textContent = !!text
      ? `Following copied to clipboard: \n ${text}`
      : `Nothing copied`;

    document.body.insertBefore(outerDiv, document.body.children[0]);

    window.setTimeout(function() {
      remove();
    }, 3000);
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.action) {
      case "copy":
        console.log("content side got copy request");

        var text = isOctaneSite(document.URL)
          ? getOctaneItemsText()
          : getAGMItemsText();

        console.log("send back: " + text);

        sendResponse({ data: text });

        prompt(text);

        break;
      default:
        break;
    }
  });
})();
