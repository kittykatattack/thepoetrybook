/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
/* This file loads the markdown documents and passes them to the tree.js file, which turns them into HTML. List your markdown documents in the markdownDocuments array, like this:

var markdownDocuments = ["../book.markdown", "../anotherDocument.markdown"]

When tree.js has built the, it runs a callback funtion in this file called poetry. The job of poetry is to display the first section that that the viewer should see. It then runs the update function that watches for changes in the url location hash. When the has changes, it runs the selectSection function which figures out which <section> tags and their matching <a> tags should have their "state" attributes set to "selected" or "unselected". This maintains a general, all-purpose seclection state that can be used with css to selectively display sections. For example, if you want <section> tags belonging to the section1 class to be visible when only when they're selected, use some css like this:

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
*/

var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";

  //List the markdown documents you want to load into the array
  var markdownDocuments = ["../example3.markdown"],
    //Variables we'll need
    sections,
    aTags,
    currentLocation,
    previousLocation;

  function selectSection() {
    //Find the level at which the selection is happening
    var sectionLevel;
    sections.some(function (section) {
      //Is there a <section> that has an id that matches the url hash location?
      if (window.location.hash === "#" + section.id) {
        //Figure out the section level (0, 1, 2 etc.) by looking at last character
        //of the section's class name
        sectionLevel = parseInt(section.parentNode.className.slice(-1));
        return true;
      }
    });
    //Select the correct <section> tags
    sections.forEach(function (section) {
      var selectedParent;
      //Is the <section> at the same navigation level as the selected section?
      if (parseInt(section.parentNode.className.slice(-1)) === sectionLevel) {
        //Is there a <section> that has an id that matches the url hash location?
        if (window.location.hash === "#" + section.id) {
          //If there is, select it, and it's parent
          section.setAttribute("state", "selected");
          section.parentNode.setAttribute("state", "selected");
          selectedParent = section.parentNode;
          //Set any <section> tags in the parent's level to "unselected",
          //Except the parent itself
          sections.forEach(function (parentSection) {
            if (parseInt(parentSection.parentNode.className.slice(-1)) === sectionLevel - 1) {
              if (parentSection !== selectedParent) {
                parentSection.setAttribute("state", "unselected");
              }
            }
          });
        } else {
          //Unselect any <section> tags only if their parent is currently selected.
          //(This allows us to maintain <section> selection states inside
          //other currently unselected sections)
          if (section.parentNode.getAttribute("state") === "selected") {
            section.setAttribute("state", "unselected");
          }
        }
      }
    });
    //Select the correct matching <a> tags for each section
    aTags.forEach(function (aTag) {
      var sectionAnchor;
      //Is the <a> tag at the same navigation level as the selected section?
      if (parseInt(aTag.parentNode.parentNode.className.slice(-1)) === sectionLevel) {
        //Is there one that has an id that matches the url hash location?
        if (window.location.hash === aTag.href.slice(aTag.href.indexOf("#"))) {
          //If there is, select it
          aTag.setAttribute("state", "selected");
          //Also select the section's anchor <a> tag, if it exists
          var searchString = "[href=\"#" + aTag.parentNode.parentNode.id + "\"]";
          sectionAnchor = document.querySelector(searchString);
          if (sectionAnchor !== null) {
            sectionAnchor.setAttribute("state", "selected");
            //If there is a section anchor, deselect any other anchors on the
            //parent section level, except the parent itself
            aTags.forEach(function (parentATag) {
              var parent = parentATag.parentNode.parentNode;
              var parentSectionLevel = parseInt(parent.className.slice(-1));
              if (parentSectionLevel === sectionLevel - 1) {
                if (parentATag !== sectionAnchor) {
                  parentATag.setAttribute("state", "unselected");
                }
              }
            });
          }
        } else {
          //Unselect any <a> tags only if their parent is currently selected
          //(This allows us to maintain <a> selection hightlight states 
          //inside currently unselected sections)
          if (aTag.parentNode.parentNode.getAttribute("state") === "selected") {
            aTag.setAttribute("state", "unselected");
          }
        }
      }
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
          while (section && section.className !== "section1") {
            section = section.parentNode;
          }
          window.location.hash = "#" + section.id;
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
    files: markdownDocuments,
    callback: poetry
  });

}());