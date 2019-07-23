'use strict';
/*global $ bookmark store*/

const api = function () {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jessica/bookmarks/';

  //sends a GET request to fetch all items from the API
  //returns JSON array of objects with keys {id, title, url, rating, desc}
  const getItems = function () {
    return fetch(BASE_URL)
      .then(res => {if (!res.ok) {
        throw new Error (res.status);
      } return res.json();
      })
      .catch(err => alert(err.message));
  };
  
  //sends a POST request to add a new item to the API. 
  //Takes an object with keys {title, url, rating, desc}
  //returns JSON object with keys {id, title, url, rating, desc}
  const addItem = function (item) {
    const newItem = JSON.stringify (item);
    return fetch(BASE_URL, {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'}, 
      body : newItem
    })
      .then(res => {if (!res.ok) {
        throw new Error (res.status);
      } return res.json();
      })
      .catch(err => alert(err.message));

  };

  //sends a DELETE request to delete an item with a given "id" from the API
  const deleteItem = function (id) {
    return fetch(`${BASE_URL}/${id}`, {
      method : 'DELETE',
      headers : {'Content-Type' : 'application/json'}
    })
      .then(res => {if (!res.ok) {
        throw new Error (res.status);
      } return res.json();
      })
      .catch(err => alert(err.message));

  };

  return {
    getItems,
    addItem,
    deleteItem,
  };

}();