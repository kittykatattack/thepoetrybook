/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100  */
(function () {
  "use strict";

  /* Variables */
  
  var currentPage = null, //The currently displayed page
    previousPage = null, //The previous page
      
    //An obect to represent an article
    Article = {
      articleTag: null,
      aTag: null,
      title: undefined,
      category: null,
      url: undefined
    },
    articles = [], //The Article objects
    nav = document.querySelector("nav"),  //The nav tag
    categories = [], //All the article categories
    url = window.location.href, //The url in the browser
    pageName = url.split('/').pop(), //Last segment of the url
    //DOM elements we need to reference
    articlesInDOM = document.querySelectorAll("article"),
    aTagsInArticles = document.querySelectorAll("article a"), //All the <a> tags in the articles
    h1 = document.querySelector("h1"),
    title = document.querySelector("title"),
    bookTitleDiv = document.querySelector("#bookTitle");
  
  /* Functions */
  
  //A function to capitalize the first letter of a string
  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  //A mousedown handler which is attached to the <a> tags.
  //It displays the article that matches the links href value
  function mousedownHandler(event) {
    var currentLink = event.target;
    articles.some(function (article) {
      if (currentLink.href === article.aTag.href) {
        if (currentPage !== null) {
          currentPage.articleTag.style.opacity = "0";
          currentPage.articleTag.style.zIndex = "0";
          currentPage.aTag.setAttribute("class", "unselected");
          previousPage = currentPage;
        }
        currentPage = article;
        currentPage.articleTag.style.opacity = "1";
        currentPage.articleTag.style.zIndex = "1000";
        currentPage.aTag.setAttribute("class", "selected");
        //match found, stop checking
        return true;
      } else {
        //match not found, continue checking
        return false;
      }
    });
  }
  
  /* The main program */
  
  //The first and main job of this code is to build the navigation
  //structure and create the links based on the content in
  //the article tags
  
  //Convert the DOM node lists into an ordinary arrays
  articlesInDOM = Array.prototype.slice.call(articlesInDOM);
  aTagsInArticles = Array.prototype.slice.call(aTagsInArticles);
  
  //Move he h1 tag in a containing <div> with the id "bookTitle" 
  //This will let us position the title with the css: #booktitle 
  bookTitleDiv.appendChild(h1);
  
  //Set the website title to be same as the book title
  title.innerHTML = h1.innerHTML;
  
  //Loop through all the articles in the article DOM nodes, create
  //article objects from them and return them into the articles array
  articles = articlesInDOM.map(function (articleInDOM) {
    var article = Object.create(Article);
    article.articleTag = articleInDOM;
    article.title = articleInDOM.firstElementChild.innerHTML;
    //Get the catefory name from the h2 tag (the article's first child)
    article.category = articleInDOM.firstElementChild.getAttribute("category");
    //Convert the category to lower case to simplify things
    if (article.category !== null) {
      article.category.toLowerCase();
    }
    //Remove the white spaces from the title name to create a link
    article.url = article.title.replace(/\s+/g, '');
    //Return the article so that it can be store in the articles array
    return article;
  });
    
  //Find all the article categories and push them into an array 
  //so that we can use them to make navigation headings
  articles.forEach(function (article) {
    if (article.category !== null) {
      //Only add a new category to the array
      //if it hasn't already been added in a previous iteration of the loop
      if (categories.indexOf(article.category) === -1) {
        categories.push(article.category);
      }
    }
  });
  
  /* SORT CATEGORIES HERE */
  //The sort() method sorts them alphabetically.  
  //Optionally, sort them manually to fine tune their order
  categories.sort();
  
  //Make h2 tags using the category names and attach them to the nav element 
  categories.forEach(function (category) {
    var h2 = document.createElement("h2"),
      headingText = category;
    headingText = capitaliseFirstLetter(headingText);
    h2.innerHTML = headingText;
    h2.setAttribute("category", category);
    nav.appendChild(h2);
  });

  //Make A tags.
  //Loop through the articles in reverse so that articles at the top
  //of the page appear before articles at the bottom
  function makeATags(article) {
    var currentArticle = article,
      //All the h2 tags in the navigation bar
      headingsInNav = document.querySelectorAll("nav h2"),
      //Create an a <a> tag, set its innerHTML property
      a = document.createElement("a");
    //Convert the headingsInNav DOM node list into a reall array
    headingsInNav = Array.prototype.slice.call(headingsInNav);
    //Build the <a> tags that will become the navigation links
    //Set their attributes and add a mousedown handler
    a.innerHTML = currentArticle.title;
    a.setAttribute("href", "#" + currentArticle.url);
    a.setAttribute("class", "unselected");
    a.addEventListener('mousedown', mousedownHandler, false);
    //Assign the <a> tag to the current article object's aTag property so we can 
    //easily reference it later
    currentArticle.aTag = a;
    
    //Insert the new <a> tag after a heading that matches its category
    if (currentArticle.category !== null) {
      headingsInNav.forEach(function (heading) {
        if (heading.getAttribute("category") === currentArticle.category) {
          //Insert new <a> tag after the heading (This is confusing, but don't worry about it!)
          heading.parentNode.insertBefore(a, heading.nextSibling);
        }
      });
    } else {
      //Insert links that don't have a category.
      //They'll appear right at the top of the navigation, before the headings
      nav.insertBefore(a, nav.firstChild);
    }
  }
  articles.reverse();
  articles.forEach(makeATags);
  articles.reverse();
  
  //Attach a mousedown handler to all the <a> tag links in the articles.
  //This is important so that you can have internal links between pages
  //Change the selected article when the user clicks a navigation link
  aTagsInArticles.forEach(function (aTag) {
    aTag.addEventListener('mousedown', mousedownHandler, false);
  });
  
  //Now that the page structure has been built, we can display a page
  
  //Load the first article if a sub-page hasn't been requested
  //(Sub-pages will have a # symbol in their name)
  if (pageName.indexOf("#") === -1) {
    //Make the first article visible and set it as the current content
    articles[0].articleTag.style.opacity = '1';
    articles[0].articleTag.style.zIndex = '1000';
    //Highlight the navigation link
    articles[0].aTag.setAttribute("class", "selected");
    currentPage = articles[0];
  } else {
    //Get the last section of the url after the # and load the corresponding article
    pageName = url.split('#').pop();
    articles.forEach(function (article) {
      if (article.url === pageName) {
        article.articleTag.style.opacity = '1';
        article.articleTag.style.zIndex = '1000';
        //Highlight the navigation link
        article.aTag.setAttribute("class", "selected");
        currentPage = article;
      }
    });
  }
  
}());
