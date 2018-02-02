chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("got message");
    if (message.message === "init") {
        console.log("In init courses");
        var response = {
            success: true
        };
        chrome.storage.local.get({
            courses: []
        }, function (items) {
            response.courses = items;
            chrome.storage.local.get({
                hidden: []
            }, function (items2) {
                response.hidden = items2;
                sendResponse(response);
                return true;
            })
        })
    }
    else if (message.message === "update") {
        chrome.storage.local.set({
            "all": message.courses,
            "hidden": message.hidden_courses
        }, function () {
            sendResponse({
                success: true
            })
        })
    }
    else sendResponse({
            success: false
        })
});