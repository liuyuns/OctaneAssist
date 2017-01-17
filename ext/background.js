(
    function () {
        var isDebugging = false;
        var re = /saas.hp(.*).com\/agm/;

        function isAgmSite(url){
            return re.test(url);
        }

        function onCopyClicked(tab) {
            var re = /saas.hp(.*).com\//;
            if (!isAgmSite(tab.url)) {
                console.log("Nothing to copy, since the URL does not look like AGM site, URL: " + tab.url);
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
            if (!isAgmSite(tab.url)) {
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
