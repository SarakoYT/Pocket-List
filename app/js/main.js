var removeSVG = '<svg id="removetodo" fill="#c0cecb" x="0px" y="0px" viewBox="0 0 22 22"><g><g><path class="st0" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="st0" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="st0" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="st0" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
var completeSVG = '<svg fill="#2ecc71" id="addtodo" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
var completeList = document.getElementById('complete');
var todo = document.getElementById('todo');
var file = document.getElementById('preview');

time();

// Basically a clock
function time () {
  var date = new Date();
  var hours = date.getHours();
  var minute = date.getMinutes();
  if (minute < 10) {
    minute = '0' + minute;
}
  console.log(hours + ":" + minute);
}

var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')):{
  todo: [],
  complete: []
};

// Generates Todo List on Startup
function generateTodoList() {
  if (!data.todo.length && !data.complete.length) return;

  for (var i = 0; i < data.todo.length; i++) {
    var value = data.todo[i];
    addItem(value);
  }

  for (var j = 0; j < data.complete.length; j++) {
    var value = data.complete[j];
    addItem(value, true);
  }
}

// Gets the Local Storage Array and Generates the todo and complete list
generateTodoList();
progress();
focus();

// Focuses on the text box when starting up the app, this removes a click the user would have to make to add a new item
function focus() {
  document.getElementById('item').focus();
}

// Grabs the value and then pushes it to dom and local storage
// Checks if there is a value and if the value is not a space, if there is a space it alerts the user that that's invalid.
function createItem() {
  var value = document.getElementById('item').value;
      if (value && value.replace(/\s/g, "")) {
        addItem(value.trim());
        document.getElementById('item').value = "";
        data.todo.push(value.trim());
        dataObject();
      } else {
        document.getElementById('item').value = "";
        alert('Error: Invalid entry, please add text to your entry!');
    }
}

// Event Listner For The Button Click
  document.getElementById('add').addEventListener('click', function () {
    createItem();
    previewFileOff();
  })

  // Event Listner For Enter and checks for active element
  document.addEventListener('keypress', function(event)  {
    var item = document.getElementById('item');
    if (document.activeElement === item) {
      if (event.keyCode == '13') {
        createItem();
        previewFileOff();
      }
    }
  });

// Upload file system
document.getElementById('upload').onchange = function uploadFile() {
  var upload = document.getElementById('upload');
  var fileType = this.files[0]['type'];
  var fileValue = fileType.split('/')[0];

// Changes the file to base64 information
  var fileReader = new FileReader();
  fileReader.readAsDataURL(this.files[0]);
  fileReader.onload = function() {
    base64 = fileReader.result;
    file.src = base64;
  }

// If the file is an image is previews the image like how the image should be previewed
  if(fileValue == 'image') {
      previewFileOff();
    //  var url = URL.createObjectURL(this.files[0]);
    //  file.src = url;
      previewImage();
    } else {
      previewFileOff();
  //    file.src = "Icons/file.svg";
      previewFile();
  }

  // Remove the previewed file
  file.addEventListener('click', function () {
      previewFileOff();
      console.log('Removed file!');
  })
}

function dataObject() {
  localStorage.setItem('todoList', JSON.stringify(data));
}

// Add List Object To the DOM
function addItem(text, complete) {
  var todo = (complete) ? document.getElementById('complete'):document.getElementById('todo');

  var newItem = document.createElement('li');
  newItem.innerHTML = text;

  var buttons = document.createElement('div');
  buttons.classList.add('buttons');

  var complete = document.createElement('svg');
  complete.innerHTML = completeSVG;

  var remove = document.createElement('svg');
  remove.innerHTML = removeSVG;

  var label = document.createElement('div');
  label.setAttribute('id', 'label');

  var paragraph = document.createElement('p');
  paragraph.setAttribute('id', 'paragraph');
  paragraph.innerText = "Add some notes!"

  var clickBox = document.createElement('div');
  clickBox.setAttribute('id', 'click-box');

// Checks if preview has an image attached, if yes then it creates an image, div and link to download said image
  if (document.getElementById('preview').src) {
    var fileName = document.getElementById('upload').value.split('\\')[2];

    var newImage = new Image();
    newImage.src = document.getElementById('preview').src;
    newImage.setAttribute('id', 'img-file');

    var container = document.createElement('div');
    container.setAttribute('id', 'img-container');

    var link = document.createElement('a');
    link.href = newImage.src;
    link.setAttribute('download', fileName);
    link.setAttribute('id', 'link');
// Append Child of parent nodes
    buttons.appendChild(complete);
    buttons.appendChild(remove);
    newItem.appendChild(label);
    newItem.appendChild(buttons);
    newItem.appendChild(clickBox);
    newItem.appendChild(paragraph);
    todo.prepend(newItem);
    link.appendChild(newImage);
    container.appendChild(link);
    newItem.appendChild(container);
  } else {
  // Append Child of parent nodes
    buttons.appendChild(complete);
    buttons.appendChild(remove);
    newItem.appendChild(label);
    newItem.appendChild(buttons);
    newItem.appendChild(clickBox);
    newItem.appendChild(paragraph);
    todo.prepend(newItem);
  }
// Event Listeners
  remove.addEventListener('click', removeItem);

  complete.addEventListener('click', completeItem);

  label.addEventListener('click', colourPicker);

  clickBox.addEventListener('click', expandList);
  progress();
}

// Remove Item
function removeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;
// Remove item from local storage
  if (id === 'todo') {
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    data.complete.splice(data.complete.indexOf(value), 1);
  }
  dataObject();
// Remove Item From DOM
  item.remove();

  progress();
}

function completeItem() {
  var item = this.parentNode.parentNode;
  var parent = item.parentNode;
  var id = parent.id;
  var value = item.innerText;
  var label = this.parentNode.previousSibling;
// Remove from current array / list and move to the other array / list
if (id === 'todo') {
  data.todo.splice(data.todo.indexOf(value), 1);
  data.complete.push(value);
  label.style = "background-color: #2ecc71;"
} else {
  data.complete.splice(data.complete.indexOf(value), 1);
  data.todo.push(value);
  label.style = "";
}
  dataObject();

  // Complete Toggle
  var target = (id === 'todo') ? completeList:todo;
  item.remove();
  target.insertBefore(item, target.childNodes[0]);
  progress();
}

// Gets progress of your todo list with some math
function progress() {
  var todoItems = todo.children.length;
  var completedItems = completeList.children.length;
  var progress = Math.round((completedItems/(completedItems + todoItems)*100))

  function mathStuff() {
    var r = 146.5;
    var circumference = r * 2 * Math.PI;
    var percentage = (progress / 100);
    var bar = document.getElementById('progress-bar');
    var barPercentage = Math.round(circumference * (1 - percentage));
    bar.setAttribute("stroke-dashoffset", barPercentage);
    document.getElementById('progress-percentage').innerHTML = progress + "%";
  }
// 0 / 0 is not a number, this fixes that.
  if (todoItems === 0 & completedItems === 0) {
    progress = 0;
    mathStuff();
  } else {
    mathStuff();
  }
}

// Navigation Button Event Listener
document.getElementById('navButton').addEventListener('click', function () {
  openNavigation();
})

  // Close navigation Button Event Listener
document.getElementById('close').addEventListener('click', function () {
  close();
})

  // If clicking anything but the navigation or the close button
document.getElementById('overlay').addEventListener('click', function() {
  close();
})

function openNavigation() {
  document.getElementById('navigation').style = "width: 90%;";
  document.getElementById('container').style = "filter:blur(5px);";
  document.getElementById('Gradient-Thing').style = "width: 90%;";
  document.getElementById('Basic-Footer').style = "width: 90%;";
  document.getElementById('overlay').style = "position: fixed; z-index: 80; width: 100%; height: 100%; background-color: #000; opacity: 0.2;";
}
  // Style Reset
function close() {
  document.getElementById('navigation').style = "";
  document.getElementById('container').style = "";
  document.getElementById('overlay').style = "";
  document.getElementById('Gradient-Thing').style = "";
  document.getElementById('Basic-Footer').style = "";
}



// Event Listener For Clicking on the add button
document.getElementById('add-list').addEventListener('click', function () {
  createNewList();
})

// Event Listner for clicking enter
document.addEventListener('keypress', function(event)  {
  var input = document.getElementById('List-Input');
  if (document.activeElement === input) {
    if (event.keyCode == '13') {
      createNewList();
    }
  }
});

// Creates a new list in the navigation
function createNewList() {
  var value = document.getElementById('List-Input').value;
  if (value && value.replace(/\s/g, "")) {
    addList(value.trim());
    document.getElementById('List-Input').value = "";
  } else {
    document.getElementById('item').value = "";
    alert('Error: Invalid entry, please add text to your entry!');
  }
}

// Add Item For the Lists
function addList(text) {
  var listOfLists = document.getElementById('todo-lists');
  var newItem = document.createElement('li');
  newItem.innerHTML = text;
  listOfLists.append(newItem);
}

// Colour Picker Thing
function colourPicker() {
  // element is the label intially clicked on
    var element = this;
    var list = element.parentNode.parentNode;
    var todo = document.getElementById('todo');

    if (list === todo) {
      document.getElementById('colorPopUp').style = "display: block;";
      document.getElementById('overlay').style = "position: fixed; z-index: 100; width: 100%; height: 100%; background-color: #000; opacity: 0.2;";
      document.getElementById('container').style = "filter:blur(5px);";

      var red = document.getElementById('red');
      var blue = document.getElementById('blue');
      var green = document.getElementById('green');
      var orange = document.getElementById('orange');
      var yellow = document.getElementById('yellow');
      var purple = document.getElementById('purple');
      var black = document.getElementById('black');
      var grey = document.getElementById('grey');
      var white = document.getElementById('white');

      red.addEventListener('click', function () {
        element.style = "background-color: #e74c3c;"
          repetition();
      })

      blue.addEventListener('click', function () {
        element.style = "background-color: #30a0ff;"
          repetition();
      })

      green.addEventListener('click', function () {
        element.style = "background-color: #2ecc71;"
          repetition();
      })

      orange.addEventListener('click', function () {
        element.style = "background-color: #e67e22;"
          repetition();
      })

      yellow.addEventListener('click', function () {
        element.style = "background-color: #f1c40f;"
          repetition();
      })

      purple.addEventListener('click', function () {
        element.style = "background-color: #9b59b6;"
          repetition();
      })

      black.addEventListener('click', function () {
        element.style = "background-color: #000;"
        repetition();
      })

      grey.addEventListener('click', function () {
        element.style = "background-color: #95a5a6;"
        repetition();
      })

      white.addEventListener('click', function () {
        element.style = "background-color: #ecf0f1;"
        repetition();
      })

      document.getElementById('overlay').addEventListener('click', function() {
        repetition();
      })

      document.getElementById('closeMenu').addEventListener('click', function() {
        repetition();
      })

      document.getElementById('color').onchange = function customColor() {
        var color = document.getElementById('color');
        var value = color.value;

        if (value) {
          element.style.backgroundColor = value;
          value = "";
          repetition();
        }
      }

      function repetition() {
          document.getElementById('colorPopUp').style = "";
          document.getElementById('overlay').style = "";
          document.getElementById('container').style = "";
          element = "I could put literally anything here to stop this bug except null for some reason, weird.";
      }
    }
}

// Swipe Gesture
window.onload = function() {
  var touchstartX = 0;
  var touchendX = 0;

  var gestureZone = document.getElementById('container');

  gestureZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
  }, false);

  gestureZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    handleGesture();
  }, false);

  function handleGesture() {
    if (touchendX >= touchstartX) {
      openNavigation();
      }
      if (touchstartX >= touchendX) {
        close();
    }
  }
}

// Function that runs when a list is clicked on.
function expandList() {
  var li = this.parentNode;
  var list = li.parentNode;
  var todo = document.getElementById('todo');
  var liText = li.innerText;
  var text = li.childNodes[0];
  var label = li.childNodes[1];
  var buttons = li.childNodes[2];
  var complete = buttons.childNodes[0];
  var remove = buttons.childNodes[1];
  var clickBox = document.getElementById('click-box');
  var paragraph = document.getElementById('paragraph');
  var overlay = document.getElementById('overlay');
  var uploadSVG = '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>';
  var closeSVG = '<svg fill="#000000" height="48" id="closebutton" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
  var img = document.getElementById('img-container');
  var link = document.getElementById('link');
// Expand it.
  if (list === todo) {
// Checks for an image and resizes accordingly.
    if (img) {
      li.style = "width: 90%; height: 50%; position: fixed; box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2); z-index: 1000; left: 50%; transform: translate(-50%, 0);";
      expansion();
    } else {
      li.style = "width: 90%; height: 12%; position: fixed; box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.2); z-index: 1000; left: 50%; transform: translate(-50%, 0);";
      expansion();
    }
  }

function expansion() {
  clickBox.style = "display: block;";
  paragraph.style = "display: block;";
  label.style = "position: fixed; overflow-y: auto;";
  overlay.style = "position: fixed; z-index: 100; width: 100%; height: 100%; background-color: #000; opacity: 0.2;";
  complete.innerHTML = uploadSVG;
  // BUG:  Idk why this doesn't work (Below)! 
  remove.style = closeSVG;
  complete.removeEventListener('click', completeItem);
  remove.removeEventListener('click', removeItem);

  remove.addEventListener('click', removeExpansion);

  paragraph.setAttribute('contenteditable', 'true');

  if (img) {
    link.removeAttribute('download');
    link.addEventListener('click', expandImage);
  }
}

// Remove the expansion
  document.getElementById('overlay').addEventListener('click', removeExpansion);


  function removeExpansion() {
    li.style = "";
    clickBox.style = "";
    paragraph.style = "";
    overlay.style = "";
    label.style = "";
    // Restore everything to normal including all event listeners
  }

  function expandImage() {
      // Display none the container and expand image fully
      // Create a close button
      // Blur the background by dynamically creating an element to blur the background

  }

  function uploadImage() {
    // Upload a new image creating all containers and stuff again.
    // This will have to result in the expansion changing to the image expansion size
  }
}


// Change styling stuff
function previewImage() {
    file.style = "visibility: visible; display:block;";
    document.getElementById('upload-contain').style = "width:calc(100% - 34px); float: right;";
    document.getElementById('header').style = "height:190px;";
    document.getElementById('item').style = "padding: 20px 0px 131px 0px;";
    document.getElementById('todo').style = "top: 200px;";
    document.getElementById('complete').style = "top:200px;";
    document.getElementById('upload-label').style = "mix-blend-mode: difference;"
  }
// Preview File
function previewFile() {
    file.style = "visibility: visible; display: block; width: 30px; height: 30px;";
    document.getElementById('upload-contain').style = "visibility: visible; display: block; width: 30px; height: 30px; bottom: 25pt; float: right; margin-right:0;";
  }

// Reseting changed styling
function previewFileOff() {
  file.style = "";
  file.removeAttribute('src');
  document.getElementById('upload-contain').style = "";
  document.getElementById('header').style = "";
  document.getElementById('item').style = "";
  document.getElementById('todo').style = "";
  document.getElementById('complete').style = "";
  document.getElementById('upload-label').style = "";
}


// FIXME: Forgot to add a remove option for todo lists lol.
// BUG: When adding image then removing that image and trying to add it again, it won't work. You have to select a different image for some reason.
// BUG: Microsoft Edge Event Listener Bugs

// HACK: Notification System

// HACK: Local Storage Redesign for more than just text values

/* HACK: Requires a expand option when clicking on a list item itself. This shows more options
including notes and addition information, uploading a file otption and more.*/

/* HACK: Requires a way to clear the completed items after 24 hours of real time. This value
should be able to be changed by the user, in app settings and should be able to be turned off. */
