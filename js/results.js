`use strict`;
const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");

let enteredToken = "";

let searchToken = searchParams.get("token");
if (searchToken == null) searchToken = "None";
if (searchToken.toUpperCase().includes("FICTION")) searchToken = "Novel";
if (searchToken.toUpperCase().includes("FICTION")) searchToken = "Novel";
if (searchToken.toUpperCase().includes("SECURITIES")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("MUTUAL")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("BUSINESS")) searchToken = "Management";
if (searchToken.toUpperCase().includes("ACCOUNTING")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("STOCK")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("EQUIT")) searchToken = "Finance";
if (searchToken.toUpperCase().includes("MARKETS")) searchToken = "ECONOMICS";
if (searchToken.toUpperCase().includes("MUST READS"))
  searchToken = "MUST-READS";
if (searchToken.toUpperCase().includes("MUST READ")) searchToken = "MUST-READS";
const titleElement = document.querySelector("title");
const headerOneElement = document.querySelector("h1");
if (searchToken === "MUST-READS") {
  titleElement.textContent = "Your Must Reads!";
  headerOneElement.textContent = "Your Must Reads!";
} else titleElement.textContent = "Search Results";

const lineSeperator = function () {
  bodyElement.append(document.createElement("hr"));
};

const homeScreen = function () {
  let divHomeRefElement = document.createElement("div");
  divHomeRefElement.id = "home-link-div";
  bodyElement.append(divHomeRefElement);

  let homeRefElement = document.createElement("a");
  homeRefElement.href = "myreads.html";
  homeRefElement.textContent = "Home";
  homeRefElement.id = "home-link";
  divHomeRefElement.append(homeRefElement);
};

const getTopics = function () {
  console.log("Get Topics Invoked");
  fetch(
    `https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/master/Librarian%202.0/src/main/resources/book-list.json`
  )
    .then(function (ajaxResponse) {
      //ajaxResponse can't be read since it is a readstream.
      //So, you have to use a json method, which itself is an async function returning a promisr
      return ajaxResponse.json();
    })
    .then(function (formatedData) {
      for (const book of formatedData) {
        if (book.dateOfReading == "0001-01-01")
          book.dateOfReading = book.dateOfPurchase;
      }
      //Sorting based on date last read and passing it to format page function
      formatPage(
        formatedData.sort((b1, b2) =>
          b1.dateOfReading < b2.dateOfReading
            ? -1
            : b1.dateOfReading > b2.dateOfReading
            ? 1
            : 0
        )
      );
    });
};

let formatPage = function (formatedData) {
  let countOfBooksSelected = 0;
  let searchTokens = searchToken.toUpperCase().split(" ");
  let bookListElement = document.getElementById("book-list");
  for (const element of formatedData) {
    let bookFound = searchEngine(
      element,
      searchToken.toUpperCase(),
      bookListElement
    );
    if (bookFound) countOfBooksSelected++;
  }

  if (countOfBooksSelected == 0 && searchTokens.length > 1) {
    console.log("Two tokens?");
    for (const element of formatedData) {
      for (const token of searchTokens) {
        let bookFound = searchEngine(
          element,
          token.toUpperCase(),
          bookListElement
        );
        if (bookFound) countOfBooksSelected++;
      }
    }
  }

  if (countOfBooksSelected == 0) {
    bookListElement.append(
      (document.createElement("strong").textContent =
        "Sorry, I do not have any books matching your criteria! Please try again.")
    );
  }
};

const searchEngine = function (element, searchToken, bookListElement) {
  let countOfBooksSelected = 0;
  if (searchToken === "MUST-READS") {
    if (element.allTimeGreatIndicator.toUpperCase().includes("YES")) {
      addBookToPage(element, bookListElement);
      countOfBooksSelected++;
    }
  }
  if (element.bookGenre.toUpperCase().includes(searchToken)) {
    addBookToPage(element, bookListElement);
    countOfBooksSelected++;
  } else if (element.bookTitle.toUpperCase().includes(searchToken)) {
    addBookToPage(element, bookListElement);
    countOfBooksSelected++;
  } else if (assignAuthors(element).toUpperCase().includes(searchToken)) {
    addBookToPage(element, bookListElement);
    countOfBooksSelected++;
  } else {
    console.log("Token " + searchToken + " not matched");
  }
  if (countOfBooksSelected > 0) return true;
};
const addBookToPage = function (element, bookListElement) {
  //const bookListElement = document.getElementById("book-list");
  //http://127.0.0.1:5501/results.html?token=Must%20Reads
  let linkElement = document.createElement("a");
  linkElement.href = element.shoppingUrl;
  linkElement.target = "_blank";
  //bookListElement.append(linkElement);
  let orderedListElement = document.createElement("li");
  bookListElement.append(orderedListElement);
  //linkElement.append(orderedListElement);
  // Create an image element
  let imageElement = document.createElement("img");
  // Set the source of the image
  imageElement.src =
    "http://raw.githubusercontent.com/jeeves1618/Spring-Learnings/refs/heads/master/Librarian%202.0/src/main/resources/static" +
    element.imageFileName;
  // Set the size of the image using REM units
  imageElement.style.width = "4rem";
  imageElement.style.height = "6rem";
  imageElement.style.marginRight = "2rem";

  // 3. Create a table with 1 row and 2 columns
  const table = document.createElement("table");
  table.style.border = "none"; // Remove table border

  const row = document.createElement("tr");

  // Create the first column for the image
  const imgCell = document.createElement("td");

  imgCell.appendChild(imageElement); // Insert image into the first cell
  // Create the second column for random text
  const textCell = document.createElement("td");
  textCell.style.width = "100%"; // Extend to fill the rest of the screen space

  // Add the image to the DOM, for example to the body
  let bookNameElement = document.createElement("strong");
  bookNameElement.textContent = element.bookTitle;
  if (element.allTimeGreatIndicator === "Yes") {
    let allTimelinkElement = document.createElement("a");
    allTimelinkElement.href = "/Learnings/results.html?token=Must%20Reads";
    textCell.appendChild(allTimelinkElement);
    //orderedListElement.append(allTimelinkElement);
    console.log("Yes, " + element.bookTitle + " is all time great");
    let allTimeGreatTextElement = document.createElement("sup");
    allTimeGreatTextElement.className = "highlight-sup";
    allTimeGreatTextElement.textContent = "Must Read!";
    allTimelinkElement.append(allTimeGreatTextElement);
  }
  linkElement.append(bookNameElement);

  textCell.appendChild(linkElement);
  //orderedListElement.append(linkElement);
  const spaceTextElement = document.createElement("span");
  spaceTextElement.textContent = "   ";
  textCell.appendChild(spaceTextElement);
  //orderedListElement.append("  ");
  if (element.readingNotesUrl != null && element.readingNotesUrl > " ") {
    let notesLinkElement = document.createElement("a");
    notesLinkElement.href = element.readingNotesUrl;
    notesLinkElement.target = "_blank";
    let notesElement = document.createElement("span");
    notesElement.className = "glyphicon glyphicon-comment glyphicon-color";
    notesLinkElement.style.margin = "0 0 0 1rem";
    notesLinkElement.append(notesElement);

    textCell.appendChild(notesLinkElement);
    //orderedListElement.append(notesLinkElement);
  }
  let authorNameElement = document.createElement("em");
  authorNameElement.textContent = assignAuthors(element);
  textCell.appendChild(authorNameElement);
  //orderedListElement.append(authorNameElement);
  textCell.appendChild(spaceTextElement);
  //orderedListElement.append("  ");
  const starElement = [];
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    starElement[i] = document.createElement("span");
    starElement[i].className = "glyphicon glyphicon-star";
  }
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    textCell.appendChild(starElement[i]);
    //orderedListElement.append(starElement[i]);
  }

  // Append both cells to the row
  row.appendChild(imgCell);
  row.appendChild(textCell);

  // Append the row to the table
  table.appendChild(row);

  // Add the table to the list item
  orderedListElement.appendChild(table);
  //orderedListElement.append(imageElement);
};
const assignAuthors = function (book) {
  let authorsString = " By " + book.authorFirstName + " " + book.authorLastName;
  if (book.authorsFirstName2 != " ") {
    console.log(book.authorFirstName + " " + book.authorsFirstName2);
    if (book.authorsFirstName3 == " ") {
      authorsString =
        authorsString +
        " and " +
        book.authorsFirstName2 +
        " " +
        book.authorsLastName2;
      console.log("Step 1 : " + authorsString);
      return authorsString;
    } else {
      authorsString =
        authorsString +
        " , " +
        book.authorsFirstName2 +
        " " +
        book.authorsLastName2;
    }
  } else {
    return authorsString;
  }

  if (book.authorsFirstName4 == " " && book.authorsFirstName3 != " ") {
    authorsString =
      authorsString +
      " and " +
      book.authorsFirstName3 +
      " " +
      book.authorsLastName3;
    console.log("Step 2 : " + authorsString);
    return authorsString;
  } else {
    authorsString =
      authorsString +
      " , " +
      book.authorsFirstName3 +
      " " +
      book.authorsLastName3;
  }
  if (book.authorsFirstName4 != " ") {
    authorsString =
      authorsString +
      " and " +
      book.authorsFirstName4 +
      " " +
      book.authorsLastName4;
    console.log("Step 3 : " + authorsString);
    return authorsString;
  }
  return authorsString;
};

const breakElement = function () {
  let blankSpace = document.createTextNode("\u00A0");
  let doubleSpace = document.createTextNode("\u00A0\u00A0");
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
};

lineSeperator();
homeScreen();
getTopics();
breakElement();

document.querySelector("#search-button").addEventListener("click", function () {
  const searchToken = document.querySelector(".form-control");
  console.log("Search requested for " + searchToken.value);
  location.href = "results.html?token=" + searchToken.value;
});

document
  .querySelector("#search-input")
  .addEventListener("keypress", function (event) {
    console.log("Search requested for " + enteredToken);
    if (event.key === "Enter") {
      event.preventDefault();
      location.href = "results.html?token=" + enteredToken;
    }
    enteredToken = enteredToken + event.key;
  });
