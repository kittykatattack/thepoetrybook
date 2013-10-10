/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
/* This file loads the markdown documents and passes them to the tree.js file, which turns them into HTML. List your markdown documents in the documents.js file array, like this:

POETRYBOOK.documents = (function () {
  return ["../book.markdown", "../anotherBook.markdown"];
}());

When tree.js has built the HTML, it runs a callback function in this file called poetry. The job of poetry is to display the first section that the viewer should see. It then runs the update function that watches for changes in the url location hash. When the hash changes, it runs the selectSection function which figures out which <section> tags and their matching <a> tags should have their "state" attributes set to "selected" or "unselected". This maintains a general, all-purpose selection state that can be used with css to selectively display sections. For example, if you want <section> tags belonging to the section1 class to be visible when only when they're selected, use some css like this:

section .section1[state=selected] {
  opacity: 1;
  z-index: 1;
}
section .section1[state=unselected] {
  z-index: 0;
  opacity: 0;
}

You can create a hightlight effect for selected sections like this:

}
nav a[state=selected] {
  color: #eee8aa;
}
nav a[state=unselected] {
  color: white;
}

By default, the poetry function in this file intializes the first sub-section of each section as "selected". This is helpful because it means that each first section can also be the first visible one.
*/

var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";

  //List the markdown documents you want to load into the array
  var sections,
    aTags,
    currentLocation,
    previousLocation;

  function selectSection() {

    //Set selection states on sections
    function select(section) {
      if (section && section.tagName === "SECTION") {
        section.setAttribute("state", "selected");
        //Find the navigation level of the current section
        var sectionLevel = parseInt(section.className.slice(-1));
        //Unselect other sections on the same level
        sections.forEach(function (testSection) {
          var testSectionLevel = parseInt(testSection.className.slice(-1));
          if (sectionLevel === testSectionLevel) {
            if (section !== testSection) {
              //Only deselect if the section's parent is currently selected
              if (testSection.parentNode.getAttribute("state") === "selected") {
                testSection.setAttribute("state", "unselected");
              }
            }
          }
        });
        //Recursively select the section's parent nodes
        select(section.parentNode);
      }
    }
    sections.some(function (section) {
      if (window.location.hash === "#" + section.id) {
        //Select a section if its id matches the url location hash
        select(section);
        section.scrollIntoView(true);
        return true;
      }
    });
    //Select the correct matching <a> tags for each section
    aTags.forEach(function (aTag) {
      sections.some(function (section) {
        if (aTag.getAttribute("href") === "#" + section.id) {
          aTag.setAttribute("state", section.getAttribute("state"));
          return true;
        }
      });
    });
  }

  //This function runs every 1/60th of a second and watches for changes
  //in the url location hash. If it changes, the selectSection function finds the
  //new selected sections and also selects the matching <a> tags
  //Find the currenly url hash location

  function update() {
    requestAnimationFrame(update);
    //Get the current url location hash
    currentLocation = window.location.hash;
    //Check whether it has changed from the previous frame
    if (currentLocation !== previousLocation) {
      //If it has, select new sections
      selectSection();
    }
    //Remember the previous url hash location
    previousLocation = currentLocation;
  }

  //The poetry function runs as soon as the tree.js file has built the HTML.
  //It initialized the first section and starts the update function running

  function poetry() {
    //Get refrences to the <sections> tags and all <a> tags inside <nav> blocks
    sections = document.querySelectorAll("section");
    sections = Array.prototype.slice.call(sections);
    aTags = document.querySelectorAll("nav a");
    aTags = Array.prototype.slice.call(aTags);

    //Intialize the first sub-sections of each main section to state "selected"
    sections.forEach(function (section) {
      if (section.parentNode.className !== section.className) {
        var firstSubSection = section.parentNode.querySelector("section:first-of-type");
        if (firstSubSection.getAttribute("state") === "unselected") {
          firstSubSection.setAttribute("state", "selected");
        }
      }
    });
    //First figure out which section to load first. This should be
    //a <section> tag that belongs to the section1 class
    //Load the first section1 tag if the url hash location is empty
    if (window.location.hash === "") {
      window.location.hash = "#" + sections[1].id;
    } else {
      //If the url hash isn't empty, load the section that matches it.
      //If it's not a section1 class <section>, move up in the hierarchy 
      //until you hit one
      var sectionFound = sections.some(function (section) {
        if (window.location.hash === "#" + section.id) {
          selectSection();
          return true;
        }
      });
      //If there's still no match, just load the first section
      if (!sectionFound) {
        window.location.hash = "#" + sections[1].id;
      }
    }
    //Now that the first section has been loaded,
    //start listening for changes in the url hash
    update();
  }
  //Tell the tree.js to build the HTML tree structure from the markdown documents
  POETRYBOOK.tree.makeHTMLFromMarkdown({
    files: POETRYBOOK.documents,
    callback: poetry
  });

}());