function getRandomIntInclusive(min, max) {
  const Newmin = Math.ceil(min);
  const Newmax = Math.floor(max);
  return Math.floor(Math.random() * (Newmax - Newmin + 1) + Newmin);
}

function injectHTML(list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list');
  target.innerHTML = '';

  const listEl = document.createElement('ol');
  target.appendChild(listEl);

  list.forEach((item) => {
    const el = document.createElement('li');
    el.innerText = item.name;
    listEl.appendChild(el);
  });
  /*
      ## JS and HTML Injection
        There are a bunch of methods to inject text or HTML into a document using JS
        Mainly, they're considered "unsafe" because they can spoof a page pretty easily
        But they're useful for starting to understand how websites work
        the usual ones are element.innerText and element.innerHTML
        Here's an article on the differences if you want to know more:
        https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innertext

      ## What to do in this function
        - Accept a list of restaurant objects
        - using a .forEach method, inject a list element into your index.html for every el
        - Display the name of that restaurant and what category of food it is
    */
}

function processRestaurants(list) {
  console.log('fired restaurants list');
  const range = [...Array(15).keys()];
  const newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length);
    return list[index];
  });
  return newArray;
}

function filterList(array, filterInputValue) {
  return array.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = filterInputValue.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

async function mainEvent() {
  /*
## Main Event
    Separating your main programming from your side functions will help you organize your thoug
    When you're not working in a heavily-commented "learning" file, this also is more legible
    If you separate your work, when one piece is complete, you can save it and trust it
*/

  // the async keyword means we can make API requests
  const form = document.querySelector('.main_form'); // get your main form so you can do JS with it
  const submit = document.querySelector('#get-resto'); // get a reference to your submit button
  const loadAnimation = document.querySelector('.lds-ellipsis');
  submit.style.display = 'none'; // let your submit button disappear

  /*
    Let's get some data from the API - it will take a second or two to load
    This next line goes to the request for 'GET' in the file at /server/routes/foodServiceRoutes.
    It's at about line 27 - go have a look and see what we're retrieving and sending back.
    */
  const results = await fetch('/api/foodServicePG');
  const arrayFromJson = await results.json(); // here is where we get the data from our request as J

  /*
    Below this comment, we log out a table of all the results using "dot notation"
    An alternate notation would be "bracket notation" - arrayFromJson["data"]
    Dot notation is preferred in JS unless you have a good reason to use brackets
    The 'data' key, which we set at line 38 in foodServiceRoutes.js, contains all 1,000 records we
    */
  // console.table(arrayFromJson.data);

  // in your browser console, try expanding this object to see what fields are available to work w
  // for example: arrayFromJson.data[0].name, etc
  console.log(arrayFromJson.data[0]);

  // this is called "string interpolation" and is how we build large text blocks with variables
  console.log(`${arrayFromJson.data[0].name} ${arrayFromJson.data[0].category}`);

  // This IF statement ensures we can't do anything if we don't have information yet
  if (arrayFromJson.data?.length > 0) {
    submit.style.display = 'block'; // let's turn the submit button back on by setting it to display as a block when we have data available

    loadAnimation.classList.remove('lds-ellipsis');
    loadAnimation.classList.add('lds-ellipsis_hidden');

    let currentlist = [];

    form.addEventListener('input', (event) => {
      console.log(event.target.value);
      const filteredList = filterList(currentlist, event.target.value);
      injectHTML(filteredList);
    });

    form.addEventListener('submit', (submitEvent) => {
      // This is needed to stop our page from changing to a new URL even though it heard a GET req
      submitEvent.preventDefault();

      // This constant will have the value of your 15-restaurant collection when it processes
      currentlist = processRestaurants(arrayFromJson.data);
      // And this function call will perform the "side effect" of injecting the HTML list for you
      injectHTML(currentlist);

      // By separating the functions, we open the possibility of regenerating the list
      // without having to retrieve fresh data every time
      // We also have access to some form values, so we could filter the list based on name
    });
  }
}
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
