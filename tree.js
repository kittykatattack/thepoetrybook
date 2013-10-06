/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.tree = (function () {
  "use strict";
  
  var documentsLoaded = 0,
    //The loaded markdown document
    markdown = "",
    markdownDocuments,
    poetry;
  
  //Set the markdown converter options
  marked.setOptions({gfm: true, breaks: true, tables: true});
  
  //A function to capitalize the first letter of a string
  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  //Make strings lowercase, remove space and punctuation
  function normalizeText(string) {
    //Remove punctuation
    string = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    //Remove spaces
    string = string.replace(/\s+/g, '');
    //Make lowercase
    string = string.toLowerCase();
    return string;
  }
  
  function replaceString(oldS, newS, fullS) {
    return fullS.split(oldS).join(newS);
  }
  
  function findHTagsInDocument() {
    var headings = [];
    var i;
    for (i = 1; i < 7; i++) {
      var testHeading = document.querySelectorAll("h" + i);
      if (testHeading.length !== 0) {
        testHeading = Array.prototype.slice.call(testHeading);
        headings.push(testHeading);
      } else {
        break;
      }
    }
    return headings;
  }
  
  function makeHeadingTextClassAndID(headingTags, index) {
    headingTags.forEach(function (headingTag) {
      //1. Create the heading title, id, and class
      var tagText = headingTag.innerHTML;
      //Find the position of the square brackets  
      var firstBracket = tagText.indexOf("[", 0);
      var secondBracket = tagText.indexOf("]", 0);
      //Get a string that matches the square bracket string
      var squareBrackets = tagText.slice(firstBracket, secondBracket + 1);
      //Slice the square bracket string from the original string
      var newTagText = replaceString(squareBrackets, "", tagText);
      //Remove any double spaces
      newTagText = newTagText.replace(/\s{2,}/g, ' ');
      newTagText = newTagText.trim();
      //Remove the square brackets from the inner string
      var classText = squareBrackets.replace(/[\[\]']+/g, '');
      classText = classText.trim();
      //Assign the new heading text to the heading tag and set its class and id attribtes
      headingTag.innerHTML = newTagText;
      if (classText !== "") {
        headingTag.className = normalizeText(classText);
        //Add a category attribute to the heading
        headingTag.setAttribute("category", classText);
      }
      //Set a heirarchyLevel attribute to the heading. This will be section0 to section6
      //Depending on the level's heirarchy. This to help us create <section> tags with
      //the class names that match that heirarchy. This makes it easy to hide or display
      //levels of content depending on user interaction and navigation.
      headingTag.setAttribute("heirarchyLevel", "section" + index);
    });
  }
  
  function makeSections(headingTags, index) {
    headingTags.forEach(function (headingTag) {
      //Create the <section> tag
      //Give it the same id and class name as the heading
      var section = document.createElement("section");
      section.id = normalizeText(headingTag.innerHTML);
      if (headingTag.className !== "x") {
        section.className = headingTag.getAttribute("heirarchyLevel");
      } else {
        section.setAttribute("class", "x " + headingTag.getAttribute("heirarchyLevel") );
      }
      if (index !== 0) {
        //Insert the section just before the current heading tag
        headingTag.parentNode.insertBefore(section, headingTag);
      } else {
        //If this is the first section, insert it as the first child of the body
        document.body.insertBefore(section, document.body.firstChild);
      }
      //Figure out what should be in that section.
      //Make an array to temporarily store the section content
      var sectionContent = [];
      //Push all the sibling nodes into the array until you find
      //a node that matches the current heading.
      //That will be the end of the section
      sectionContent.push(headingTag);
      var sibling = headingTag.nextElementSibling;
      while (sibling && sibling.tagName !== headingTag.tagName) {
        sectionContent.push(sibling);
        sibling = sibling.nextElementSibling;
      }
      //Add the array contents to the <section> tag
      sectionContent.forEach(function (element) {
        section.appendChild(element);
      });
    });
  }
  
  function buildNavigation(headingTags) {
    //console.log("***");
    //Loop through each heading level and find it
    //<section> tag children. These will be the navigation index items
    headingTags.forEach(function (headingTag) {
      var parent = headingTag.parentNode;
      var sections = parent.children;
      if (sections.length !== 0) {
        sections = Array.prototype.slice.call(sections);
        sections = sections.filter(function (tag) {
          if (tag.tagName === "SECTION") {
            //console.log(headingTag.id + ": " + tag.id);
            return tag;
          }
        });
        //Add a navigation bar to the top of the section, 
        //if it contains more than one sub-heading
        if (sections.length > 1) {
          var nav = document.createElement("nav");
          var categoryClasses = [];
          var categoryStrings = [];
          var spanTags = [];
          var aTags = [];
          parent.insertBefore(nav, parent.firstChild);
          //Find out if there are navigation categories
          //and, if there are, build a categories array
          sections.forEach(function (sectionTag) {
            var headingTag = sectionTag.firstChild;
            //Find out if the heading has a category and add it to 
            //the categories array
            if (headingTag.className !== "") {
              //Only add a new category to the array
              //if it hasn't already been added in a previous iteration of the loop
              if (categoryClasses.indexOf(headingTag.className) === -1) {
                if(headingTag.className !== "x")
                {
                  categoryClasses.push(headingTag.className);
                  categoryStrings.push(headingTag.getAttribute("category"));
                }
              }
            }
          });
          if (categoryClasses.length > 0) {
            categoryClasses.sort();
            //console.log(categoryClasses);
            //Create <span> tags for each category
            if (categoryClasses.length !== 0) {
              categoryClasses.sort();
              categoryStrings.sort();
              categoryClasses.forEach(function (category, index) {
                var span = document.createElement("span");
                span.setAttribute("category", category);
                span.innerHTML = categoryStrings[index];
                spanTags.push(span);
                nav.appendChild(span);
              });
            }
          }
          //Build the navigation bar items based on the section items
          sections.reverse();
          sections.forEach(function (sectionTag) {
            var headingTag = sectionTag.firstChild;
            //Create an <a> tag for each heading and append it to the <nav> tag
            var aTag = document.createElement("a");
            aTag.innerHTML = headingTag.innerHTML;
            aTag.href = "#" + sectionTag.id;
            if (headingTag.className !== "") {
              if (headingTag.className !== "x") {
                //aTag.className = headingTag.className;
                aTag.setAttribute("category", headingTag.className);
                aTag.className = "unselected";
              } else {
                aTag.setAttribute("category", headingTag.className);
                aTag.className = "x";
              }
            }
            aTags.push(aTag);
          });
          aTags.forEach(function (aTag) {
            if (aTag.getAttribute("category") !== null) {
              spanTags.forEach(function (spanTag) {
                if (spanTag.getAttribute("category") === aTag.getAttribute("category")) {
                  //Insert new <a> tag after the catefory <span> tag 
                  spanTag.parentNode.insertBefore(aTag, spanTag.nextSibling);
                }
              });
            } else {
              nav.insertBefore(aTag, nav.firstChild);
            }
          });
          //console.log(spanTags.length);
        }
      //console.log("*");
      }
    });
  }
  function addIdAttributeToImgTags() {
    var imgTags = document.querySelectorAll("img");
    imgTags = Array.prototype.slice.call(imgTags);
    imgTags.forEach(function(imgTag) {
      var altText = imgTag.getAttribute("alt");
      if (altText !== null) {
        altText = normalizeText(altText);
        imgTag.setAttribute("id", altText);
      }
    });
  }
  function makeTableOfContents() {
    //Create a <div id="contents">
    var toc = document.createElement("div");
    toc.id = "toc";
    //Add it as the firt child to the body
    document.body.insertBefore(toc, document.body.firstChild);
    
    //Thank you!:https://github.com/matthewkastor/html-table-of-contents
    function htmlTableOfContents(documentRef) {
      var toc = documentRef.getElementById('toc');
      var headings = [].slice.call(documentRef.body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      headings.forEach(function (heading, index) {
        var anchor = documentRef.createElement('a');
        anchor.setAttribute('name', 'toc' + index);
        anchor.setAttribute('id', 'toc' + index);
        
        var link = documentRef.createElement('a');
        link.setAttribute('href', '#toc' + index);
        link.textContent = heading.textContent;
        
        var div = documentRef.createElement('div');
        div.setAttribute('class', heading.tagName.toLowerCase());
        
        div.appendChild(link);
        toc.appendChild(div);
        heading.parentNode.insertBefore(anchor, heading);
      });
    }
    htmlTableOfContents(document);
  }
  function makeHeaderSection() {
    var h1 = document.querySelector("h1");
    var header = document.createElement("header");
    h1.parentNode.insertBefore(header, h1);
    header.appendChild(h1);
  }
  
  function makeHTMLpage() {
    //Copy the loaded markdown into the body
    document.body.innerHTML += markdown;
    //Find all the "h" tags (<h1> to <h6>) in the document and push them into an array
    var headings = findHTagsInDocument();
    //Create the heading text, class and ids
    headings.forEach(makeHeadingTextClassAndID);
    //Add id attributes to any image tags. The id's will match the alt text
    addIdAttributeToImgTags();
    //Make <section> tags that wrap each section of content defined by a heading
    headings.forEach(makeSections);
    //Create <nav> tags for level of headings, if they contain sub-sections
    headings.forEach(buildNavigation);
    //Insert the <h1> tag into a <header> tag 
    //(Do this near the end so that we don't mess up the HTML stucture)
    makeHeaderSection();
    //Build the table of contents
    makeTableOfContents();
    
    //Run the poetry callback function in the poet.js file to tell it that
    //the HTML has been built
    if (poetry !== undefined) {
      poetry();
    }
  }
  
  function loadFile(fileName) {
    var reader = new XMLHttpRequest();
    reader.open("get", fileName, true);
    reader.addEventListener("readystatechange", function () {
      if (reader.readyState === 4) {
        //Convert the markdown to HTML text inside the <section id="book"> tag
        markdown += (marked(reader.responseText));
        documentsLoaded += 1;
        //Build the HTML Dom tree if all the markdown documents have been loaded
        if (documentsLoaded === markdownDocuments.length) {
          makeHTMLpage();
        }
      }
    }, false);
    reader.send(null);
  }
  
  function makeHTMLFromMarkdown(documents, callBackFunction) {
    //Load the markdown files
    markdownDocuments = documents;
    //A callback function to alert poet.js that the HTML has been built
    poetry = callBackFunction;
    markdownDocuments.forEach(loadFile);
  }
  
  //Pulic API
  return {
    makeHTMLFromMarkdown: makeHTMLFromMarkdown
  };
  
}());
