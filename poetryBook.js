/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true  */
(function () {
  "use strict";

  /* Variables */
  
  var currentPage = null, //The currently displayed page
    previousPage = null, //The previous page
    reader = new XMLHttpRequest(), //An XMLHttpRequest object to read the markdown file
    //An obect to represent an article
    articleObject = {
      articleTag: null,
      aTag: null,
      title: undefined,
      url: undefined,
      classAttribute: null
    },
    //The article objects
    articles = [],
    //All the article categories
    categories = [],
    //The url in the browser
    url = window.location.href,
    //Last segment of the url
    pageName = url.split('/').pop(),
    //Used in the checkAnchorSoThatBackButtonWorks function to help implement the back button
    currentPageHash = null,
    //Prevent page load conflict between navigation link click and back button
    linkClicked = false,
    //DOM elements we need to reference
    articlesInDOM = [],
    aTagsInArticles,
    h1,
    nav,
    h2Tags,
    h3Tags,
    pTags,
    imgTags,
    allTagsInDocument,
    title,
    book,
    bookTitleDiv;
  
  /* Functions */

  //A function to capitalize the first letter of a string
  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  //Set linkClicked back to false so checkAnchorSoThatBackButtonWorks can 
  //check the browser back button
  function resetLinkClickedToFalse() {
    linkClicked = false;
  }
  
  function switchArticle(article) {
    if (currentPage !== null) {
      currentPage.articleTag.style.opacity = "0";
      currentPage.articleTag.style.zIndex = "0";
      if (currentPage.aTag !== null) {
        currentPage.aTag.setAttribute("class", "unselected");
      }
      previousPage = currentPage;
    }
    currentPage = article;
    currentPage.articleTag.style.opacity = "1";
    currentPage.articleTag.style.zIndex = "1000";
    currentPage.aTag.setAttribute("class", "selected");
  }
  
  //A mousedown handler which is attached to the <a> tags.
  //It displays the article that matches the link's href value
  function mousedownHandler(event) {
    event.preventDefault();
    var currentLink = event.target,
      href = currentLink.getAttribute("href");
    //Check if the link is a named anchor, and force its url in the address bar if it is.
    //This makes the checkAnchorSoThatBackButtonWorks function work properly with all named anchors.
    //It also makes sure that previous pages won't reload if the 
    //mouse button is held down over links.
    if (href.indexOf("#") === 0) {
      window.location.hash = event.target.getAttribute("href");
    }
    //Set linkClicked to true so that checkAnchorSoThatBackButtonWorks doesn't 
    //try and reload article
    linkClicked = true;
    setTimeout(resetLinkClickedToFalse, 500);
    articles.some(function (article) {
      //Only check this for articles that are in the navigation (not with class="x")
      if (article.classAttribute !== "x") {
        if (article.aTag !== null) {
          if (currentLink.href === article.aTag.href) {
            //Display the newly selected article
            switchArticle(article);
            //match found, stop checking
            return true;
          } else {
            //match not found, continue checking
            return false;
          }
        }
      }
    });
  }
  
  //Find out how this next function works: http://stackoverflow.com/questions/18967526/
  function wrapPageContentInArticleTags(bookContentContainer) {
    var article, sibling, toDelete = [], i, h2,
      h2s = document.getElementsByTagName("H2");
    for (i = 0; i < h2s.length; i++) {
      h2 = h2s[i];
      article = document.createElement("article");
      sibling = h2.nextElementSibling;
      article.appendChild(h2.cloneNode(true));
      while (sibling && sibling.tagName !== "H2") {
        article.appendChild(sibling.cloneNode(true));
        toDelete.push(sibling);
        sibling = sibling.nextElementSibling;
      }
      articlesInDOM.push(article);
    }
    while (toDelete.length > 0) {
      toDelete[toDelete.length - 1].parentNode.removeChild(toDelete[toDelete.length - 1]);
      toDelete.pop();
    }
    while (h2s.length > 0) {
      h2s[0].parentNode.removeChild(h2s[0]);
    }
    for (i = 0; i < articlesInDOM.length; i++) {
      article = articlesInDOM[i];
      bookContentContainer.appendChild(article);
    }
  }
  
  function makeArticleObjects(articleInDOM) {
    var article = Object.create(articleObject);
    article.articleTag = articleInDOM;
    article.title = articleInDOM.firstElementChild.innerHTML;
    //Get the catefory name from the h2 tag (the article's first child)
    article.classAttribute = articleInDOM.firstElementChild.getAttribute("class");
    if (article.classAttribute !== null) {
      article.articleTag.setAttribute("class", article.classAttribute);
    }
    //Convert the classAttribute to lower case to simplify things
    if (article.classAttribute !== null) {
      article.classAttribute = article.classAttribute.toLowerCase();
    }
    //Remove the white spaces from the title name and make it lower case to create a link
    article.url = article.title.replace(/\s+/g, '');
    article.url = article.url.toLowerCase();
    //Add an id attribute to the article so that it can be targetted with css.
    //The id will be the same as the url
    article.articleTag.setAttribute("id", article.url);
    //Return the article so that it can be store in the articles array
    return article;
  }
 
  function makeH2Tags(classAttribute) {
    if (classAttribute !== "x") {
      var h2 = document.createElement("h2"),
        headingText = classAttribute,
        lowerCaseClassAttribute = classAttribute.toLowerCase();
      //Convert the classAttribute to lower case
      headingText = capitaliseFirstLetter(headingText);
      h2.innerHTML = headingText;
      h2.setAttribute("class", lowerCaseClassAttribute);
      nav.appendChild(h2);
    }
  }
  
  function addIdAttributeToImgTags(imgTag) {
    var altText = imgTag.getAttribute("alt");
    if (altText !== null) {
      //Remove the white spaces
      altText = altText.replace(/\s+/g, '');
      altText = altText.toLowerCase();
      imgTag.setAttribute("id", altText);
    }
  }
  
  function makeATags(article) {
    //All the h2 tags in the navigation bar
    var headingsInNav = document.querySelectorAll("nav h2"),
      //Create an a <a> tag, set its innerHTML property
      aTag;
    //Only create <a> tags in the navigation if the article class is not "x"
    //"x" class articles are hidden content for complex UIs that could be displayed
    //somewhere else on the page or revealed based on user intereaction.
    if (article.classAttribute !== "x") {
      aTag = document.createElement("a");
      //Convert the headingsInNav DOM node list into a real array
      headingsInNav = Array.prototype.slice.call(headingsInNav);
      //Build the <a> tags that will become the navigation links
      //Set their attributes and add a mousedown handler
      aTag.innerHTML = article.title;
      aTag.setAttribute("href", "#" + article.url);
      aTag.setAttribute("class", "unselected");
      aTag.addEventListener("mousedown", mousedownHandler, false);
      //Assign the <a> tag to the current article object's aTag property so we can 
      //easily reference it later
      article.aTag = aTag;
    
      //Insert the new <a> tag after a heading that matches its classAttribute
      if (article.classAttribute !== null) {
        headingsInNav.forEach(function (heading) {
          if (heading.getAttribute("class") === article.classAttribute) {
            //Insert new <a> tag after the heading (This is confusing, but don't worry about it!)
            heading.parentNode.insertBefore(aTag, heading.nextSibling);
          }
        });
      } else {
        //Insert links that don't have a classAttribute.
        //They'll appear right at the top of the navigation, before the headings
        nav.insertBefore(aTag, nav.firstChild);
      }
    }
  }
  
  function displayCurrentPage() {
    if (pageName.indexOf("#") === -1) {
      //Make the first article visible and set it as the current content
      articles[0].articleTag.style.opacity = '1';
      articles[0].articleTag.style.zIndex = '1000';
      window.location.hash = articles[0].url;
      //Highlight the navigation link
      if (articles[0].aTag !== null) {
        articles[0].aTag.setAttribute("class", "selected");
      }
      currentPage = articles[0];
    } else {
      //Get the last section of the url after the # and load the corresponding article
      pageName = url.split('#').pop();
      articles.forEach(function (article) {
        if (article.url === pageName && article.classAttribute !== "x") {
          article.articleTag.style.opacity = '1';
          article.articleTag.style.zIndex = '1000';
          //Highlight the navigation link
          article.aTag.setAttribute("class", "selected");
          currentPage = article;
        }
      });
    }
  }
  
  function createClassNames(h2Tag) {
    var h2TagText,
      firstBracket,
      secondBracket,
      squareBrackets,
      newH2TagText,
      h2TagClassText;
    
    function replaceString(oldS, newS, fullS) {
      return fullS.split(oldS).join(newS);
    }
    
    h2TagText = h2Tag.innerHTML;
    //Find the position of the square brackets  
    firstBracket = h2TagText.indexOf("[", 0);
    secondBracket = h2TagText.indexOf("]", 0);
    //Get a string that matches the square bracket string
    squareBrackets = h2TagText.slice(firstBracket, secondBracket + 1);
    //slice the square bracket string from the original string
    newH2TagText = replaceString(squareBrackets, "", h2TagText);
    //Remove any double spaces
    newH2TagText = newH2TagText.replace(/\s{2,}/g, ' ');
    newH2TagText = newH2TagText.trim();
    //Remove the square brackets from the inner string
    h2TagClassText = squareBrackets.replace(/[\[\]']+/g, '');
    h2TagClassText = h2TagClassText.trim();
      
    //Assign the new heading text to the <h2> tag and set its class attribte
    h2Tag.innerHTML = newH2TagText;
    h2Tag.setAttribute("class", h2TagClassText);
  }
  
  //A function to make the browser's back button work, called by setInterval
  //in the convertMarkdownToHTML function
  function checkAnchorSoThatBackButtonWorks() {
    //Only check this if a navigation link hasn't been clicked
    if (!linkClicked) {
      currentPageHash = window.location.hash;
      if (currentPageHash !== null) {
        if (currentPageHash !== "#" + currentPage.url) {
          //Only do this if the current link isn't a named anchor
          //from an article with <h3> subheadings (those are indicated by "/" characters)
          if (currentPageHash.indexOf("/") !== -1) {
            currentPageHash = currentPageHash.slice(0, currentPageHash.indexOf("/"));
          }
          articles.some(function (article) {
            if (currentPageHash === "#" + article.url) {
              switchArticle(article);
              return true;
            } else {
              return false;
            }
          });
        }
      }
    }
  }
  
  function makeSubNavFromH3Tags(article) {
    var h3Tags,
      h2Tag,
      h2ATag,
      h2ATagLink,
      navTag;
    h3Tags = article.articleTag.querySelectorAll("h3");
    h3Tags = Array.prototype.slice.call(h3Tags);
    h2Tag = article.articleTag.querySelector("h2");
    
    //Only do this if there are any <h3> headings in the article
    if (h3Tags.length !== 0) {
      //Create the <nav> tag
      navTag = document.createElement("nav");
      //Add it as the first child to the enclosing article tag
      article.articleTag.insertBefore(navTag, article.articleTag.firstChild);
      
      //Create <a> tags to act as anchors and add them before each <h3> tag
      //inside the <article> tag
      h3Tags.forEach(function (h3Tag) {
        var aTag,
          aTagLink;
        aTag = document.createElement("a");
        aTagLink = h3Tag.innerHTML.replace(/\s+/g, '');
        aTagLink = aTagLink.toLowerCase();
        aTag.setAttribute("id", article.url + "/" + aTagLink);
        h3Tag.parentNode.insertBefore(aTag, h3Tag);
      });
      //Reverse the array so that headings display from top to bottom in
      //the correct order
      h3Tags.reverse();
      //Create the sub-navigation bar inside the article
      h3Tags.forEach(function (h3Tag) {
        var aTag,
          aTagLink;
        aTag = document.createElement("a");
        aTag.innerHTML = h3Tag.innerHTML;
        aTagLink = aTag.innerHTML.replace(/\s+/g, '');
        aTagLink = aTagLink.toLowerCase();
        aTag.setAttribute("href", "#" + article.url + "/" + aTagLink);
        //aTag.addEventListener("mousedown", mousedownHandler, false);
        //Assign the <a> tag to the current article object's aTag property so we can 
        //easily reference it later
        //article.aTag = aTag;
        navTag.insertBefore(aTag, navTag.firstChild);
      });
      //Repeat these steps for the single <h2> tag
      //Make a sub-navigation link for based for the article's <h2> heading
      h2ATag = document.createElement("a");
      h2ATag.innerHTML = h2Tag.innerHTML;
      h2ATagLink = h2ATag.innerHTML.replace(/\s+/g, '');
      h2ATagLink = h2ATagLink.toLowerCase();
      h2ATag.setAttribute("href", "#" + article.url + "/" + "heading:" + h2ATagLink);
      //Add it to the <nav> tag
      navTag.insertBefore(h2ATag, navTag.firstChild);
      //Create an <a> anchor link for the article's <h2> heading
      //inside the <article> tag
      //Reset the previous variables so that we can reuse them
      h2ATag = null;
      h2ATagLink = null;
      h2ATag = document.createElement("a");
      h2ATagLink = h2Tag.innerHTML.replace(/\s+/g, '');
      h2ATagLink = h2ATagLink.toLowerCase();
      h2ATag.setAttribute("id", article.url + "/" + "heading:" + h2ATagLink);
      h2Tag.parentNode.insertBefore(h2ATag, h2Tag);
    }
  }
  
  //Load the markdown content, convert it to HTML, and attach it to the body
  function makeHTMLpage() {
    //This function creates the HTML page structure and navigation 
    //based on the loaded markdown document
    
    //It first loops through the all the content in the book section tag and wraps
    //each part beginning with <h2> in an <article> tag. This lets us structure
    //each page as a section that begins 
    //with <h2> (secondary headings in the markdown document)
    wrapPageContentInArticleTags(book);
    
    //Get references to the HTML elements we need
    h1 = document.querySelector("h1");
    h2Tags = document.querySelectorAll("h2");
    pTags = document.querySelectorAll("p");
    allTagsInDocument = document.body.childNodes;
    title = document.querySelector("title");
    bookTitleDiv = document.querySelector("#bookTitle");
    nav = document.querySelector("nav");
    aTagsInArticles = document.querySelectorAll("article a");
    imgTags = document.querySelectorAll("img");
    
    //Convert the DOM node lists into an ordinary arrays
    articlesInDOM = Array.prototype.slice.call(articlesInDOM);
    aTagsInArticles = Array.prototype.slice.call(aTagsInArticles);
    h2Tags = Array.prototype.slice.call(h2Tags);
    allTagsInDocument = Array.prototype.slice.call(allTagsInDocument);
    imgTags = Array.prototype.slice.call(imgTags);
    
    //Move he h1 tag into a containing <div> with the id "bookTitle" 
    //This will let us position the title with the css: #booktitle 
    bookTitleDiv.appendChild(h1);
    
    //Set the website title to be same as the book title
    title.innerHTML = h1.innerHTML;
    
    //Loop through all the <h2> tags and extract the class names from the
    //text inside their square brackets
    h2Tags.forEach(createClassNames);
    
    //Loop through all the articles in the article DOM nodes, create
    //article objects from them and return them into the articles array
    articles = articlesInDOM.map(makeArticleObjects);
    
    //Find all the <h2> classAttributes and push them into an array 
    //so that we can use them to make navigation headings
    articles.forEach(function (article) {
      if (article.classAttribute !== null) {
        //Only add a new classAttribute to the array
        //if it hasn't already been added in a previous iteration of the loop
        if (categories.indexOf(article.classAttribute) === -1) {
          categories.push(article.classAttribute);
        }
      }
    });
    
    /* SORT CATEGORIES HERE */
    //The sort() method sorts them alphabetically.  
    //Optionally, sort them manually to fine tune their order
    categories.sort();
    
    //The next sections of code make <h2> and <a> tags inside the <nav> element
    //This is what builds the navigation bar.
    
    //Make <h2> tags in the navigation using their class names and attach them to the nav element 
    categories.forEach(makeH2Tags);
  
    //Make <a> tags for the navigation.
    //Loop through the articles in reverse so that articles at the top
    //of the page appear before articles at the bottom
    articles.reverse();
    articles.forEach(makeATags);
    articles.reverse();
    
    //Attach a mousedown handler to all the <a> tag links in the articles.
    //This is important so that you can have internal links between pages to
    //change the selected article when the user clicks a navigation link
    aTagsInArticles.forEach(function (aTag) {
      aTag.addEventListener("mousedown", mousedownHandler, false);
    });
    
    //Add id attributes to all the image tags so that we can target them
    //with css if we need to.
    imgTags.forEach(addIdAttributeToImgTags);
    
    //If there are <article> tags with <h3> headings, make a subnavigation
    //bar for them.
    articles.forEach(makeSubNavFromH3Tags);
    
    //Now that the page structure has been built, we can display a page
    //Load the first article if a sub-page hasn't been requested
    //(Sub-pages will have a # symbol in their name)
    displayCurrentPage();
  }
  
  function convertMarkdownToHTML() {
    if (reader.readyState === 4) {
      //Convert the markdown to HTML text inside the <section id="book"> tag
      book = document.querySelector("#book");
      marked.setOptions({gfm: true, breaks: true, tables: true});
      book.innerHTML += (marked(reader.responseText));
      //Check to see if the back button was pressed so that the previous article can be displayed
      setInterval(checkAnchorSoThatBackButtonWorks, 300);
      //Build the HTML Dom tree
      makeHTMLpage();
      
    }
  }
  function loadFile(fileName) {
    reader.open("get", fileName, true);
    reader.addEventListener("readystatechange", convertMarkdownToHTML, false);
    reader.send(null);
  }
  
  //Load the markdown file and convert it to HTML.
  //When it's finished, the makeHTMLpage function will run
  loadFile("book.markdown");
}());
