/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true  */
(function () {
  "use strict";
  
  //List the markdown documents you want to load as elements in this array
  var markdownDocuments = ["test.markdown"],
    //A counter for the document loader
    documentsLoaded = 0,
    //The loaded markdown document
    markdown = "",
    parentNode = document.body,
    //A an object to store information about each section
    sectionObject = {
      headingTag: null,
      sectionTag: null,
    };
  
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
    for(var i = 1; i < 7; i++) {
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
  
  function makeHeadingTextClassAndID(headingTags) {
    headingTags.forEach(function(headingTag) {
      //1. Create the heading title, id, and class
      var tagText = headingTag.innerHTML;
      //Find the position of the square brackets  
      var firstBracket = tagText.indexOf("[", 0);
      var secondBracket = tagText.indexOf("]", 0);
      //Get a string that matches the square bracket string
      var squareBrackets = tagText.slice(firstBracket, secondBracket + 1);
      //slice the square bracket string from the original string
      var newTagText = replaceString(squareBrackets, "", tagText);
      //Remove any double spaces
      newTagText = newTagText.replace(/\s{2,}/g, ' ');
      newTagText = newTagText.trim();
      //Remove the square brackets from the inner string
      var classText = squareBrackets.replace(/[\[\]']+/g, '');
      classText = classText.trim();
      //Assign the new heading text to the heading tag and set its class and id attribtes
      headingTag.innerHTML = newTagText;
      headingTag.id = normalizeText(newTagText)
      if(classText !== "") {
        headingTag.className = normalizeText(classText);
        //Add a category attribute to the heading
        headingTag.setAttribute("category", classText);
      }
    });
  }
  
  function makeSections(headingTags) {
    headingTags.forEach(function(headingTag) {
      //Create the <section> tag
      //Give it the same id and class name as the heading
      var section = document.createElement("section");
      section.id = headingTag.id;
      if (headingTag.className) {
        section.className = headingTag.className;
      }
      //Insert the section just before the current heading tag
      headingTag.parentNode.insertBefore(section, headingTag);
      //Figure out what should be in that section.
      //Make an array to temporarily store the section content
      var sectionContent = [];
      //Push all the sibling nodes into the array until you find
      //a node that matches the current heading.
      //That will be the end of the section
      sectionContent.push(headingTag);
      var sibling = headingTag.nextElementSibling;
      while (sibling && sibling.tagName !== headingTag.tagName) {
        sectionContent.push(sibling)
        sibling = sibling.nextElementSibling;
      }
      //Add the array contents to the <section> tag
      sectionContent.forEach(function(element) {
        section.appendChild(element);
      });  
    });
  }
  
  function buildNavigation(headingTags) {
    console.log("***");
    //Loop through each heading level and find it
    //<section> tag children. These will be the navigation index items
    headingTags.forEach(function(headingTag) {
      var parent = headingTag.parentNode;
      var sections = parent.children;
      var categories = [];
      if (sections.length !== 0) {
        sections = Array.prototype.slice.call(sections);
        sections = sections.filter(function(tag) {
          if (tag.tagName === "SECTION") {
            //console.log(headingTag.id + ": " + tag.id);
            return tag
          }
        });
        //Add a navigation bar to the top beginning of the section, 
        //if it contains more than one sub-heading
        if(sections.length > 1) {
          var nav = document.createElement("nav");
          //console.log(parent);
          parent.insertBefore(nav, parent.firstChild);
        
          //Build the navigation bar items based on the section items
          sections.forEach(function(sectionTag) {
            var headingTag = sectionTag.firstChild;
            //Find out if the heading has a category and add it to 
            //the categories array
            if (headingTag.className !== "") {
              //Only add a new category to the array
              //if it hasn't already been added in a previous iteration of the loop
              if (categories.indexOf(headingTag.className) === -1) {
                categories.push(headingTag.className);
              }
            }
            //console.log(headingTag.innerHTML);
            console.log(categories);
            //Create an <a> tag for each heading and append it to the <nav> tag
            var aTag = document.createElement("a");
            aTag.innerHTML = headingTag.innerHTML;
            aTag.href = headingTag.id;
            aTag.className = headingTag.className;
            nav.appendChild(aTag);
          });
          
        }
      //console.log(parent.firstChild);
      console.log("*");
      }
    });
  
    //Create a navgation tag
    //
    //Add it as the first child to the enclosing section tag
    //parent.insertBefore(nav, parent.firstChild);
  }
  
  function makeHTMLpage() {
    //Copy the loaded markdown into the body
    document.body.innerHTML += markdown;
    //Find all the "h" tags (<h1> to <h6>) in the document and push them into an array
    var headings = findHTagsInDocument();
    //Create the heading text, class and ids
    headings.forEach(makeHeadingTextClassAndID);
    //Make <section> tags that wrap each section of content defined by a heading
    headings.forEach(makeSections);
    //Create <nav> tags for level of headings, if they contain sub-sections
    headings.forEach(buildNavigation);
    //console.log(document.querySelector("#thepoetrybook").children);
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
  
  //Load the markdown files
  markdownDocuments.forEach(loadFile);
}());
