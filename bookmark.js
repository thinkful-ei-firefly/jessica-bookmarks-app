'use strict';
/*global $ store api*/

const bookmark = function () {

  //generates HTML data from the store and re-renders the header and body with generated content
  const render = function () {
    console.log('bookmark.render ran!');
    let bookmarks = store.bookmarks;
    bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.minRating);
    
    let listHtml = generateBookmarkList(bookmarks);
    $('ul#bookmarkList').html(listHtml);
    
    let headerHtml = generateHeader();
    $('section#addNew').html(headerHtml);

  };


  //creates & returns HTML for all items in store.bookmarks
  const generateBookmarkList = function (bookmarks) {
    let bookmarkHtml = [];
    bookmarks.forEach(function(bookmark){
      let html = generateBookmark(bookmark);
      bookmarkHtml.push(html);
    });
    return bookmarkHtml;
  };


  //creates & returns HTML for one bookmark object
  const generateBookmark = function (bookmark) {
    const stars = generateStars(bookmark.rating);
    if (bookmark.expanded) {
      return `
      <li class="expanded" data-id="${bookmark.id}">
        <div class="listItem">
          <div class="itemHeader">
            <h2 class="title">${bookmark.title}</h2>
            <span class="rating">${stars}</span>
            <button type="button" class="toggleSize">Condense</button>
          </div>
          <p class="url"><a href="${bookmark.url}">${bookmark.url}</a></p>
          <p class="description">${bookmark.desc}</p>
          <button type="button" class="delete">Delete</button>
        </div>
      </li>
      `;
    } else {
      return `
      <li class="" data-id="${bookmark.id}">
        <div class="listItem">
          <div class="itemHeader">
            <h2 class="title">${bookmark.title}</h2>
            <span class="rating">${stars}</span>
            <button type="button" class="toggleSize">Expand</button>
          </div>
        </div>
      </li>
      `;
    }
  };

  const generateStars = function (rating) {
    switch (rating) {
    case 1:
      return '<i class="fas fa-star"></i>';
    case 2:
      return '<i class="fas fa-star"></i><i class="fas fa-star"></i>';
    case 3:
      return '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
    case 4:
      return '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
    case 5:
      return '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';

    }

  };


  //creates & returns HTML for section#addNew in header
  const generateHeader = function () {
    if (store.adding) {
      return `
      <form id="addNewForm">

        <label for="newTitle">Page Title:</label>
        <input type="text" name="title" id="newTitle" required>
        <br>
        
        <label for="newUrl">URL:</label>
        <input type="url" name="url" id="newUrl" required>
        <br>

        <label for="newRating">Rating:</label>
        <select id="newRating" name="rating">
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
        </select>
        <br>

        <label for="newDesc">Description:</label>
        <br>
        <textarea name="desc" id="newDesc" wrap="soft"></textarea>
        <br>

        <button type="button" id="addNewToggle">Cancel</button>
        <button type="submit" id="addNewSubmit">Submit</button>

      </form>
      `;
    } else {
      return `
      <button type="button" id="addNewToggle">Add New</button>
      `;
    }
  };


  //listens for changes to minRating, updates value of "minRating" in store, re-renders
  const handleFilter = function () {
    $('select#minRating').on('click', event => {
      console.log('bookmark.handleFilter ran!');
      const val = $(event.currentTarget).val();
      store.minRating = val;
      render();

    });
    

  };


  //listens for click on "Add New" or "Cancel" buttons, updates value of "adding" in store, re-renders
  const handleAdding = function () {
    console.log('bookmark.handleAdding ready!');
    $('#addNew').on('click', '#addNewToggle', function () {
      console.log('bookmark.handleAdding ran!');
      store.toggleAdding();
      render();
    });
  };



  //listens for click on "Add New -> Submit" button, extracts form values
  //sends POST request to API, then adds item to the store & re-renders
  const handleAddNewSubmit = function () {
    $('section#addNew').on('submit', 'form#addNewForm', event => {
      event.preventDefault();
      console.log('bookmark.handleAddNewSubmit ran!');
      let form = document.getElementById('addNewForm');
      let formData = new FormData(form);
      let object = {};
      formData.forEach((value, key) => {object[key] = value;});
      if (!object.desc) {object.desc = 'No description';}
      
      api.addItem(object)
        .then (res => {
          store.addItem(res);
          bookmark.render();
        });

    });
  };


  //listens for click on "Expand" or "Condense" buttons, toggles "expanded" value on item, re-renders
  const handleExpandCondense = function () {
    console.log('bookmark.handleExpandCondense ready!');
    $('#bookmarkList').on('click', '.toggleSize', event => {
      console.log('bookmark.handleExpandCondense ran!');
      const id = getIdFromBookmark(event.currentTarget);
      store.toggleExpanded(id);
      render();

    });
  };
  
  //listens for click on "Delete" buttons, sends DELETE request to API
  //then empties and refills the store from the API and re-renders
  const handleDelete = function () {
    $('#bookmarkList').on('click', '.delete', event => {
      const id = getIdFromBookmark(event.currentTarget);
      event.preventDefault();
      api.deleteItem(id)
        .then(res => {
          console.log(res);
          store.deleteItem(id);
          render();
        });

    });
  };


  //gets the id value of the clicked bookmark item
  function getIdFromBookmark(item) {
    return $(item)
      .closest('li')
      .data('id');
  }

  const bindAllListeners = function () {
    handleFilter();
    handleAdding();
    handleAddNewSubmit();
    handleExpandCondense();
    handleDelete();
  };


  return {
    render,
    bindAllListeners,

  };

}();