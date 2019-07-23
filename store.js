'use strict';
/*global $ bookmark api*/

const store = function () {

  const bookmarks = [];
  let minRating = 0;
  let adding = false;
  let showError = false;
  let errorMessage = '';


  //calls the API to get all items and adds them to the store, then re-renders the page
  const fill = function () {
    api.getItems()
      .then((array) => {
        array.forEach((object) => store.addItem(object));
        bookmark.render();

      });
  };


  const empty = function () {
    store.bookmarks = [];
  };


  //takes object with keys of {id, title, url, desc, rating}
  //adds a key-value pair of expanded = false, then pushes the result to store.bookmarks
  const addItem = function (object) {
    let obj = object;
    obj.expanded = false;
    store.bookmarks.push(obj);
    
  };


  //toggles the "adding" T/F when called
  const toggleAdding = function () {
    this.adding = !this.adding;
  };

  
  //finds and returns a single bookmark given its id property
  const findById = function(id) {
    return store.bookmarks.find(bookmark => bookmark.id === id);
  };

  
  //toggles the "expanded" property of the bookmark with the given id
  const toggleExpanded = function (id) {
    const bookmark = findById(id);
    bookmark.expanded = !bookmark.expanded;
  };




  return {
    bookmarks,
    minRating,
    adding,
    showError,
    errorMessage,
    fill,
    empty,
    addItem,
    toggleAdding,
    findById,
    toggleExpanded,
  };

}();


