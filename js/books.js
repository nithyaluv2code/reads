`use strict`;

const searchParams = new URLSearchParams(window.location.search);

let bodyElement = document.querySelector("body");
let enteredToken = "";
let annualReads = 0;
let yearOfReading = searchParams.get("year");
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
if (yearOfReading == null) yearOfReading = currentYear;

let booksReadData = [];
let xaxisCategories = [];
const mainHeaderElement = document.getElementById("main-header-year");
mainHeaderElement.textContent = "Between the Pages: Nithya's Reads";
const titleElement = document.querySelector("title");
titleElement.textContent = "Between the Pages: Nithya's Reads";
var x = window.matchMedia("(max-width: 575px)");
/*
x.addEventListener("change", function () {
  getTopics();
});
*/
let formatPage = function (formatedData) {
  let prevMonth = "00";
  let currentMonthInteger = 0;
  let skippedMonths = 0;
  const bookListElement = document.getElementById("book-list");
  for (const element of formatedData) {
    let yearToBeConsidered = filterByYear(element);

    if (yearToBeConsidered == yearOfReading) {
      let currentMonth = element.dateOfReading.substring(5, 7);
      if (currentMonth > prevMonth) {
        skippedMonths = parseInt(currentMonth) - parseInt(prevMonth) - 1;
        if (prevMonth != "00") booksReadData.push(currentMonthInteger);
        for (var pushCounter = 0; pushCounter < skippedMonths; pushCounter++) {
          booksReadData.push(0);
        }

        //breakMonth(currentMonth, bookListElement);
        currentMonthInteger = 0;
        prevMonth = currentMonth;
      }
      addBookToPage(element, bookListElement);
      currentMonthInteger = currentMonthInteger + 1;
    }
  }

  booksReadData.push(currentMonthInteger);
  skippedMonths = 0;
  if (booksReadData.length < 12) skippedMonths = 12 - booksReadData.length;
  for (var pushCounter = 0; pushCounter < skippedMonths; pushCounter++) {
    booksReadData.push(0);
  }
  annualReads = booksReadData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
};
const getTopics = function () {
  //fetch(`http://localhost:8080/book-list.json`)
  // For testing with local Json. `https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/master/Librarian%202.0/src/main/resources/book-list.json`
  fetch(
    `https://raw.githubusercontent.com/jeeves1618/Spring-Learnings/master/Librarian%202.0/src/main/resources/read-list.json`
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

const filterByYear = function (book) {
  let yearToBeConsidered;

  if (book.dateOfReading.substring(0, 4) === "0001") {
    if (book.dateOfPurchase.substring(0, 4) === "2024") {
      yearToBeConsidered = "0001";
    } else {
      yearToBeConsidered = book.dateOfPurchase.substring(0, 4);
    }
  } else {
    yearToBeConsidered = book.dateOfReading.substring(0, 4);
  }
  return yearToBeConsidered;
};

const addBookToPage = function (element, bookListElement) {
  //const bookListElement = document.getElementById("book-list");
  //http://127.0.0.1:5501/results.html?token=Must%20Reads
  let linkElement = document.createElement("a");
  linkElement.href = element.shoppingUrl;
  linkElement.target = "_blank";
  //bookListElement.append(linkElement);
  let bookTitleElement = document.createElement("div");
  bookTitleElement.className = "book-title-tile";
  let beforeColon = element.bookTitle;
  if (element.bookTitle.includes(":")) {
    beforeColon = element.bookTitle.split(":")[0];
  }
  bookTitleElement.textContent = beforeColon;
  bookListElement.append(bookTitleElement);

  let bookSectionElement = document.createElement("div");
  bookSectionElement.className = "row section-tile";
  bookListElement.append(bookSectionElement);

  let bookTileElement = document.createElement("div");
  bookTileElement.className = "book-tile";
  bookSectionElement.append(bookTileElement);

  let imageDivElement = document.createElement("div");
  imageDivElement.className = "imageDivElement";
  bookTileElement.append(imageDivElement);
  //imageDivElement.textContent = element.imageFileName;

  let imageElement = document.createElement("img");
  // Set the source of the image
  imageElement.src =
    "http://raw.githubusercontent.com/jeeves1618/Spring-Learnings/refs/heads/master/Librarian%202.0/src/main/resources/static" +
    element.imageFileName;
  // Set the size of the image using REM units
  imageElement.style.width = "90%";
  imageElement.style.height = "23rem";
  imageElement.style.margin = "5%";
  imageElement.style.borderRadius = "1rem";
  imageDivElement.append(imageElement);

  let bookDescElement = document.createElement("div");
  bookDescElement.className = "book-description";
  bookSectionElement.append(bookDescElement);
  let iGoogleIconElement = document.createElement("i");
  iGoogleIconElement.className = "bi bi-vector-pen";

  bookDescElement.append(iGoogleIconElement);
  let detailedTitleParaElement = document.createElement("p");
  detailedTitleParaElement.textContent = element.bookTitle;
  bookDescElement.append(detailedTitleParaElement);
  bookDescElement.append(document.createElement("hr"));
  let authorParaElement = document.createElement("p");
  bookDescElement.append(authorParaElement);

  let authorFnameSpanElement = document.createElement("span");
  authorFnameSpanElement.textContent = assignAuthors(element);
  authorParaElement.append(authorFnameSpanElement);

  let publisherParaElement = document.createElement("p");
  publisherParaElement.textContent = element.publisherName;
  bookDescElement.append(publisherParaElement);

  let readDateParaElement = document.createElement("p");
  readDateParaElement.textContent = element.dateOfReading;
  bookDescElement.append(readDateParaElement);

  const rateElement = [];
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    rateElement[i] = document.createElement("span");
    rateElement[i].className = "glyphicon glyphicon-star";
  }
  for (let i = 0; i < element.ratingOfUsefulness; i++) {
    bookDescElement.append(rateElement[i]);
    //orderedListElement.append(starElement[i]);
  }
};

const scrollManager = function () {
  let nextYear = Number(yearOfReading) + 1;
  let prevYear = Number(yearOfReading) - 1;

  let prevRefElement = document.createElement("a");
  prevRefElement.href = "/reads/myreads.html?year=" + prevYear;

  bodyElement.append(prevRefElement);
  let prevLinkElement = document.createElement("span");
  prevLinkElement.textContent = "<-- " + prevYear;
  prevLinkElement.id = "prev-year";
  console.log(prevLinkElement);
  prevRefElement.append(prevLinkElement);

  let nextRefElement = document.createElement("a");
  nextRefElement.href = "/reads/myreads.html?year=" + nextYear;
  bodyElement.append(nextRefElement);
  let nextLinkElement = document.createElement("span");
  nextLinkElement.textContent = nextYear + " -->";
  nextLinkElement.id = "next-year";
  if (Number(yearOfReading) < currentYear)
    nextRefElement.append(nextLinkElement);
};

const breakMonth = function (currentMonth, bookListElement) {
  console.log("Month : " + currentMonth + " Element : " + bookListElement);
  if (currentMonth == undefined) {
    console.log("Undefined");
  } else {
    let imageElement = document.createElement("img");
    imageElement.src = "img/months/" + currentMonth + ".jpg";
    imageElement.className = "center";
    imageElement.id = "month_image";
    bookListElement.append(imageElement);
  }
  //<img src="img/months/jan.jpg" class="center" />
};

const breakElement = function () {
  let blankSpace = document.createTextNode("\u00A0");
  let doubleSpace = document.createTextNode("\u00A0\u00A0");
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
  bodyElement.append(document.createElement("br"));
};

const assignAuthors = function (book) {
  let authorsString = " By " + book.authorFirstName + " " + book.authorLastName;
  if (book.authorsFirstName2 != " ") {
    if (book.authorsFirstName3 == " ") {
      authorsString =
        authorsString +
        " and " +
        book.authorsFirstName2 +
        " " +
        book.authorsLastName2;

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
    return authorsString;
  }
  return authorsString;
};
const lineSeperator = function () {
  bodyElement.append(document.createElement("hr"));
};

getTopics();
lineSeperator();
scrollManager();
breakElement();

let pageWidth = window.innerWidth || document.body.clientWidth;
let treshold = Math.max(5, Math.floor(0.3 * pageWidth));
let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;

const limit = Math.tan(((45 * 1.5) / 180) * Math.PI);
const gestureZone = document.getElementById("modalContent");

gestureZone.addEventListener(
  "touchstart",
  function (event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
  },
  false
);

gestureZone.addEventListener(
  "touchend",
  function (event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesture(event);
  },
  false
);

function handleGesture(e) {
  let x = touchendX - touchstartX;
  let y = touchendY - touchstartY;
  let xy = Math.abs(x / y);
  let yx = Math.abs(y / x);
  if (Math.abs(x) > treshold || Math.abs(y) > treshold) {
    if (yx <= limit) {
      if (x < 0) {
        let nextYear = Number(yearOfReading) + 1;
        if (Number(yearOfReading) < currentYear)
          document.querySelector("#next-year").click();
        console.log("left");
      } else {
        document.querySelector("#prev-year").click();
        console.log("right");
      }
    }
    if (xy <= limit) {
      if (y < 0) {
        console.log("top");
      } else {
        console.log("bottom");
      }
    }
  } else {
    console.log("tap");
  }
}
