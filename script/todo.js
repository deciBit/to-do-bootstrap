/*
Javascript exercise November 2019, Lauge Grønhøj.
This .js file will use the following:
Basic JS DOM access.
Variables, if-statements, for-loops, events and arrays.
JSON - combined with the localStorage.
*/

// Global Variables

// Let's get the localStorage, if any. 
var ls = localStorage.getItem('todolist');

// Our todoList: This array will contain the todo element data (as objects)
var todoList = [];

// The list container element
var listContainer = document.getElementById('listContainer');

// Functions

// This function will poupulate the listContainer with todo elements. 
function poupulateList() {
    // Run through the todoList and do stuff
    // First clear out listContainer
    listContainer.innerHTML = '';
    for (i=0; i<todoList.length; i++) {
        createListItem(todoList[i]);
    };
    // Save this in the localStorage
    localStorage.setItem('todolist', JSON.stringify(todoList));
};

// Initialize, do this first. Executed by <body> onload.
function init () {
    if (ls === null) {
        // If ls is null, fill list with random stuff.
        todoList = [{name:'Klippe hækken', text:'Finde klipper, forlænger og vakkelvorn stige', id:'100', status:'incomplete'},{name:'Vaske hund', text:'Våddragt, sæbe og spand.', id:'101', status:'incomplete'}, {name:'Købe ind', text:'Det sædvanlige: Mælk, brød, aftensmad, toiletpapir, russisk t55 tank osv...', id:'102', status:'incomplete'}];
    } else {
        // If there is an ls object then use that instead.
        todoList = JSON.parse(ls);
    };
    poupulateList();
};

// Creates the list item based on name, text and id.
function createListItem (theItem) {
    // Container for the item
    var listElement  = document.createElement('div');
    listElement.setAttribute('id', theItem.id);
    listElement.setAttribute('class', 'listItem');
    // Add class if completed. Get current classes and add one.
    if (theItem.status === 'complete') {
        listElement.setAttribute('class', listElement.getAttribute('class') + ' completedItemBG');
    }
    // Create a div header element for the list item.
    var listElementHeader  = document.createElement('div');
    listElementHeader.setAttribute('class', 'listItemHeader');
    
    // Create the complete button, an img with class, type, data-id and a click handler.
    var listElementComplete = document.createElement('img');
    listElementComplete.setAttribute('class', 'listItemComplete');
    listElementComplete.setAttribute('src', 'images/check-24px.svg');
    listElementComplete.setAttribute('data-id', theItem.id);
    listElementComplete.addEventListener('click', function () {
        // Set this item to completed in array and DOM. Use the data-id as reference.
        completeItem(this.getAttribute('data-id'));
    });
    // Append the button to the header element (div).
    listElementHeader.appendChild(listElementComplete);

    // Create the delete button, an img with class, type, data-id and a click handler.
    var listItemDelete = document.createElement('img');
    listItemDelete.setAttribute('class', 'listItemDelete');
    listItemDelete.setAttribute('src', 'images/clear-24px.svg');
    listItemDelete.setAttribute('data-id', theItem.id);
    listItemDelete.addEventListener('click', function () {
        // Delete this from array and DOM. Use the data-id as reference.
        deleteItem(this.getAttribute('data-id'));
    });
    // Append the button to the header element (div).
    listElementHeader.appendChild(listItemDelete);

    // Append the header to the list element.
    listElement.appendChild(listElementHeader);
    // Use the createElementForListItem function to create name and text.
    createElementForListItem('p', 'listItemName', theItem.name, listElement, theItem.status);
    createElementForListItem('p', 'listItemText', theItem.text, listElement, theItem.status);
    // And finally, append it all to the listContainer.
    listContainer.appendChild(listElement);
};

// Function for creating basic list item elements. 
function createElementForListItem (wantedElement, wantedClass, wantedText, targetElement, targetStatus) {
    let el = document.createElement(wantedElement);
    if (targetStatus == 'complete') {
        wantedClass += " lineThrough";
    }
    el.setAttribute('class', wantedClass);
    // Insert text in the span and add it to the el
    el.appendChild(document.createTextNode(wantedText));
    // Add the el to the targetElement
    targetElement.appendChild(el);
};

// Creates a new item. Pushes it to the itemList array and then we populate the list again.
function newItem() {
    var theNewItem = new Object();
    theNewItem.name = document.getElementById('itemName').value;
    theNewItem.text = document.getElementById('itemText').value;
    theNewItem.id = 'ID' + new Date ().getTime();
    theNewItem.status = 'incomplete';
    // No empty name
    if (theNewItem.name !== "") {
        todoList.unshift(theNewItem);
        localStorage.setItem('todolist', JSON.stringify(todoList));
        resetCreator();
        poupulateList();
    };
};

// Reset the input fields and show the "creator" element.
function resetCreator() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemText').value = '';
    document.getElementById('creator').style.display = 'none';
};

// Set an item to "complete" or "incomplete". Updates status on item in todoList and in DOM.
function completeItem(theId) {
    // Find item in todoList.
    let positionIntodoList = findInArrayWithAttr(todoList, 'id', theId);
    // Update array and DOM
    if (todoList[positionIntodoList].status === 'incomplete') {
        todoList[positionIntodoList].status = 'complete';
        document.getElementById(todoList[positionIntodoList].id).getElementsByClassName('listItemName')[0].classList.add('lineThrough');
        document.getElementById(todoList[positionIntodoList].id).getElementsByClassName('listItemText')[0].classList.add('lineThrough');
        document.getElementById(todoList[positionIntodoList].id).classList.add('completedItemBG');
    } else {
        todoList[positionIntodoList].status = 'incomplete';
        document.getElementById(todoList[positionIntodoList].id).getElementsByClassName('listItemName')[0].classList.remove('lineThrough');
        document.getElementById(todoList[positionIntodoList].id).getElementsByClassName('listItemText')[0].classList.remove('lineThrough');
        document.getElementById(todoList[positionIntodoList].id).classList.remove('completedItemBG');
    }
    // Update the localStorage
    localStorage.setItem('todolist', JSON.stringify(todoList));
};

// Deletes an item. Finds it in the itemList array and then splices it from the itemList array and then we populate the list again.
function deleteItem(theId) {
    todoList.splice(findInArrayWithAttr(todoList, 'id', theId),1);
    poupulateList();
};

// Show the creator, set focus to first input field.
function showCreator() {
    document.getElementById('creator').style.display = "block";
    document.getElementById('itemName').focus();
};


// Clears localStorage and reloads page.
function reset () {
    localStorage.clear();
    location.reload();
};

// Pre ES6: Function for finding a value in array[x].attr. Returns -1 if failed. Returns position in array if success.                                                                              
function findInArrayWithAttr(array, attr, value) {
    // Go through the entire array
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            // If found, return position in array
            return i;
        };
    };
    // Did not find anything. Return -1.
    return -1;
};