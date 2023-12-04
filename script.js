const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// show modal , focus on first input

function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// event listenter
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => { modal.classList.remove('show-modal') });
window.addEventListener('click', (e) => { e.target === modal ? modal.classList.remove('show-modal') : false });

// Validate form
function validate(nameValue, urlValue) {
    // expression for cheking thar url is valid
    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    const regex = new RegExp(expression);

    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }

    if(!urlValue.match(regex)){
        alert('Please provide a valid url');
        return false;
    }

    return true;
}

// Build bookmarks dom
function buildBookmarks(){
    // remove all bookmark elements
    bookmarksContainer.textContent = "";
    
    bookmarks.forEach((bookmark) => {
        const {name, url} = bookmark;
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-regular','fa-circle-xmark');
        closeIcon.setAttribute('title', 'delete bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //facicon // link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        
        // append to book marks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// fetch bookmarks from localstorage
function fetchBookmarks() {
    // get bookmarks from localstorage if available 
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        // create bookmarks array in localstorage
        bookmark = {
                name: "Google Example",
                url: "google.com",
            };

        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    buildBookmarks();
}

// delete a bookmark

function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
        }
    });

    // update bookmarks array in localstorage, repopulate the dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }

    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks.push(bookmark);

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//event listener 
bookmarkForm.addEventListener('submit', storeBookmark);
// on load fetch bookmarks
fetchBookmarks();