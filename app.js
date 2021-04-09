//Storage Controller
const StorageCtrl = (function () {
  //Public Methods
  return {
    storeItem: function (item) {
      let items;
      //check if any items in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        //push new Item
        items.push(item);
        //Set LS
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        //Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        //Push new Item
        items.push(item);

        //Re set LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
        //
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    },
  };
})();

//!Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //
  //
  //Data Structure /State
  const data = {
    // items: [
    //   { id: 0, name: 'Salmon Fillets', calories: 300 },
    //   { id: 1, name: 'Crumble Eggs', calories: 200 },
    //   { id: 2, name: 'White Pitta', calories: 175 },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };
  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //Create Id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //Calories to Number
      calories = parseInt(calories);
      //Create new Item

      newItem = new Item(ID, name, calories);
      //Add to Items array
      data.items.push(newItem);

      return newItem;
    },

    getItemById: function (id) {
      let found = null;
      //loop thru the items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      //Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      //Get the id's
      const ids = data.items.map(function (item) {
        return item.id;
      });

      //Get index
      const index = ids.indexOf(id);
      //Remove Item
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurremtItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      //Loop thrugh Items an add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });

      //Set total cal in data structure

      data.totalCalories = total;

      //Return total
      return data.totalCalories;
    },

    logData: function () {
      return data;
    },
  };
})();

//
//
//!Ui Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  };
  //Public Methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
             <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
             <a href="#" class="secondary-content">
               <i class="edit-item fas fa-pencil-alt"></i>
             </a>
           </li> `;
      });

      //Insert List Items on Index
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
    addListItem: function (item) {
      // Show Te list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      //Create li ellement
      const li = document.createElement('li');
      //Add Class
      li.className = 'collection-item';
      //Add ID
      li.id = `item-${item.id}`;

      //Add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
         <a href="#" class="secondary-content">
           <i class="edit-item fas fa-pencil-alt"></i>
         </a>`;
      //Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn Nodelist int Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fas fa-pencil-alt"></i>
          </a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurremtItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurremtItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //Turn Nodelist into array
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      });
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

//
//
//App Controller
const AppCtrl = (function (ItemCtrl, StorageCtrl, UICtrl) {
  //Load Even Listeners
  const LoadEventListeners = function () {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item Event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on enter

    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit icon click Event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update item Event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Deleteitem Event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Back Button Event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //Clear items Event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  };

  //Add item submit
  const itemAddSubmit = function (e) {
    //Get form input from UI controller
    const input = UICtrl.getItemInput();

    //Check for name and Calorie Input
    if (input.name !== '' && input.calories !== '') {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add Item to UI List
      UICtrl.addListItem(newItem);

      //Get total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in LocalStorage
      StorageCtrl.storeItem(newItem);

      //Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Click edit Item
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //Get list item id (item-0,item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break int an array
      const listIdArr = listId.split('-');

      //Get the actual Id
      const id = parseInt(listIdArr[1]);

      //Get item

      const itemToEdit = ItemCtrl.getItemById(id);

      //Set current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add Item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  //Update item Submit
  const itemUpdateSubmit = function (e) {
    //Get item input
    const input = UICtrl.getItemInput();

    //update Item

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    //Update Ui
    UICtrl.updateListItem(updatedItem);

    //Get total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //Update LocalStorage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  //Delete button

  const itemDeleteSubmit = function (e) {
    //Get current Item
    const currentItem = ItemCtrl.getCurremtItem();

    //Delete From Data Structure
    ItemCtrl.deleteItem(currentItem.id);

    //Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  //Clear Items Event
  const clearAllItemsClick = function () {
    //Delete all items from data structure

    ItemCtrl.clearAllItems();

    //Get total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    //Remove From UI #
    UICtrl.removeItems();

    //Clear from Local Storage
    StorageCtrl.clearItemsFromStorage();

    //Hide UL
    UICtrl.hideList();
  };

  //Public Methods
  return {
    init: function () {
      //Clear Editstatt/ set initial state
      UICtrl.clearEditState();

      //Fetch Items from data structure
      const items = ItemCtrl.getItems();

      //Check if any Items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate List with Items
        UICtrl.populateItemList(items);
      }
      //Get total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      LoadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

//!Initialize App
AppCtrl.init();
