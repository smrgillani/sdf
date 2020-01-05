window.onunload = function () {
    removeSessionId(sessionStorage.getItem('page_id'));
    var pageIdList = getPageIdList();

    if (pageIdList.length == 0 && localStorage.getItem('keepMeLoggedIn') == null) {
        localStorage.clear();
    }

    return true;
};

// Broad cast that your're opening a page.
localStorage.openpages = Date.now();
var onLocalStorageEvent = function(e){
    if (e.key == "openpages"){
        // Listen if anybody else opening the same page!
        localStorage.page_available = Date.now();
    }

    if (e.key == "page_available"){
        var pageIdList = getPageIdList();
        
        if (pageIdList.length > 0) {
            var pageId = sessionStorage.getItem('page_id');

            if (sessionExist(pageId) != -1) { // page id is recorded
                 console.log('page already added to list:', pageId);
            } else { // page id is not recorded
                console.log('add new to existing list:', pageId);
                addNewSession();
            }
        } else {
            console.log('list is empty.. add new');
            addNewSession();
        }
    }
};

init();

function init() {
    
    var pageIdList = localStorage.getItem('page_id_list');
    
    if (pageIdList == null) {
        console.log('Session init...');
        addNewSession();
    }
        
}

function addNewSession() {
    var pageIdList = getPageIdList();
    var pageId = getRandomInt(1, 10000);
  
    sessionStorage.setItem('page_id', pageId);
    pageIdList.push(pageId);
    localStorage.setItem('page_id_list', JSON.stringify(pageIdList));

    console.log('adding new page id:', pageId);
    console.log('pageIdList:', localStorage.getItem('page_id_list'));
}

function sessionExist(pageId) { // Returns index
    var pageIdList = getPageIdList();   
    pageId = pageId != null ? parseInt(pageId) : -1;

    if (pageIdList.length > 0 && pageId != -1) {
        return pageIdList.indexOf(pageId);
    }

    return -1;
}

function removeSessionId(pageId) {
    var index = sessionExist(pageId) != -1;
    
    if (index > -1) {
        var pageIdList = getPageIdList();   
        pageIdList.splice(index, 1);
        localStorage.setItem('page_id_list', JSON.stringify(pageIdList));
        return true;
    }

    return false;
}

function getPageIdList() {
    var pageIdList = localStorage.getItem('page_id_list');
    return pageIdList != null && pageIdList.length > 0 ? JSON.parse(pageIdList) : [];   
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener('storage', onLocalStorageEvent, false);