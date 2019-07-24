'use strict';
/*global $ bookmark store*/

const api = function () {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/jessica/bookmarks/';

  //sends a GET request to fetch all items from the API
  //returns JSON array of objects with keys {id, title, url, rating, desc}
  const getItems = function () {
    let res;
    return fetch(BASE_URL)
      .then(response => {
        res = response;
        return response.json();
      })
      .then(data => {if (!res.ok) {
        throw new Error (`${res.status}: ${data.message}`);
      } return data;
      })
      .catch(err => alert(err));
  };
  
  //sends a POST request to add a new item to the API. 
  //Takes an object with keys {title, url, rating, desc}
  //returns JSON object with keys {id, title, url, rating, desc}
  const addItem = function (item) {
    const newItem = JSON.stringify (item);
    let res;
    return fetch(BASE_URL, {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'}, 
      body : newItem
    })
      .then(response => {
        res = response;
        return response.json();
      })
      .then(data => {if (!res.ok) {
        throw new Error (`${res.status}: ${data.message}`);
      } return data;
      })
      .catch(err => alert(err));

  };

  //sends a DELETE request to delete an item with a given "id" from the API
  const deleteItem = function (id) {
    let res;
    return fetch(`${BASE_URL}/${id}`, {
      method : 'DELETE',
      headers : {'Content-Type' : 'application/json'}
    })
      .then(response => {
        res = response;
        return response.json();
      })
      .then(data => {if (!res.ok) {
        throw new Error (`${res.status}: ${data.message}`);
      } return data;
      })
      .catch(err => alert(err));

  };

  return {
    getItems,
    addItem,
    deleteItem,
  };

}();