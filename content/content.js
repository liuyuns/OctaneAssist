(function () {

    function getAGMItemsText() {
        function formatItem(id, name) {
            return `#${id}: ${name}`;
        }

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
            return (id && title) ? formatItem(id, title) : "";
        }

        var selected = document.querySelectorAll('.x-grid3-row-selected');
        var items = [];
        for (var i = 0; i < selected.length; i++) {
            var row = selected[i];
            var idCol = row.querySelector('#gwt-debug-col-id-id');
            var nameCol = row.querySelector('#gwt-debug-col-id-name');
            if (!!idCol && !!nameCol) {
                items.push(formatItem(idCol.textContent.trim(), nameCol.textContent.trim()));
            }
        }

        return items.join('\r\n');
    }


    function prompt(text) {
        var divId = "__agm_assist_prompt";

        var remove = function () {
            var d = document.getElementById(divId);
            if (d) {
                document.body.removeChild(d);
            }
        };

        remove();

        function htmlToElements(html) {
            var template = document.createElement('template');
            template.innerHTML = html;
            return template.content.childNodes;
        }

        var outerDivHtml = `<div id='${divId}' style='position:fixed; margin-top:100px; z-index:10000; left:30%; right:30%; background:lightyellow; white-space:pre-line'></div>`;
        var innerDivHtml = `<div style='text-align:left; color:green; margin: 10px; line-height:1.5; font-size: 120%'></div>`;

        var outerDiv = htmlToElements(outerDivHtml)[0];
        var innerDiv = htmlToElements(innerDivHtml)[0];
        outerDiv.appendChild(innerDiv);

        innerDiv.textContent = !!text ? `Following copied to clipboard: \n ${text}` : `Nothing copied`;

        document.body.insertBefore(outerDiv, document.body.children[0]);

        window.setTimeout(function () {
            remove();
        }, 3000);

    }

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.action) {
            case "copy":
                console.log("content side got copy request");

                var text = getAGMItemsText();

                console.log("send back: " + text);

                sendResponse({ data: text });

                prompt(text);

                break;
            default:
                break;
        }
    });
})();
