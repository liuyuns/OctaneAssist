(
    function () {
        var isDebugging = false;

        window.addEventListener("message", function(msg){
            if (!!msg.data.log){
                console.log(msg.data.log);
            }
        }, true);

        function onCopyClicked(tab) {

            if (!isAgmSite(tab.url) && !isOctaneSite(tab.url)) {
                console.log("Nothing to copy, the URL does not look like either Octane or AGM site, URL: " + tab.url);
                if (!isDebugging){
                    return;
                }
            }

            chrome.tabs.sendMessage(tab.id, { action: "copy" }, function (response) {
                if (response && response.data) {
                    copyText(response.data);
                }
            });
        }

        // show page action for tabs that matches the condition.
        chrome.tabs.onUpdated.addListener(function (tabid, changeInfo, tab) {
            if (!isAgmSite(tab.url) && !isOctaneSite(tab.url)) {
                chrome.pageAction.hide(tabid);
                if (!isDebugging)
                {
                    return;
                }
            }

            chrome.pageAction.show(tabid);

            chrome.pageAction.onClicked.removeListener(onCopyClicked);
            chrome.pageAction.onClicked.addListener(onCopyClicked);
        });

        function copyText(text) {
            var input = document.createElement('textarea');
            document.body.appendChild(input);
            input.value = text;
            input.focus();
            input.select();
            document.execCommand('Copy');
            input.remove();
        };
    })();
