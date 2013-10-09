/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";

  //List the markdown documents you want to load into the array
  var markdownDocuments = ["../book.markdown"],
    sections,
    aTags,
    currentLocation,
    previousLocation;

  function selectSection() {
    //Find the level at which the selection is happening
    var sectionLevel;
    sections.some(function(section) {
      //Is there one that has an id that matches the url hash location?
      if (window.location.hash === "#" + section.id) {
        //Figure out the section level (0, 1, 2 etc.) by looking at last character
        //of the section's class name
        sectionLevel = parseInt(section.parentNode.className.slice(-1));
        return true;
      }
    });
    sections.forEach(function(section) {;
      var selectedParent
      //Is the <section> at the same navigation level as the selected section?
      if (parseInt(section.parentNode.className.slice(-1)) === sectionLevel) {
        //Is there one that has an id that matches the url hash location?
        if (window.location.hash === "#" + section.id) {
          //If there is, select it, and it's parent
          section.setAttribute("state", "selected");
          section.parentNode.setAttribute("state", "selected");
          selectedParent = section.parentNode;
          //Set any <section> tags in the parent's level to "unselected"
          sections.forEach(function(parentSection) {
            if (parseInt(parentSection.parentNode.className.slice(-1)) === sectionLevel - 1) {
             if (parentSection !== selectedParent) {
               parentSection.setAttribute("state", "unselected");
             } 
            }
          });
        } else {
            section.setAttribute("state", "unselected");
        }
      }
    });
    aTags.forEach(function(aTag) {
      var sectionAnchor
      //Is the <a> tag at the same navigation level as the selected section?
      if (parseInt(aTag.parentNode.parentNode.className.slice(-1)) === sectionLevel) {
        //Is there one that has an id that matches the url hash location?
        if (window.location.hash === aTag.href.slice(aTag.href.indexOf("#"))) {
          //If there is, select it
          aTag.setAttribute("state", "selected");
          //Also select the section's anchor <a> tag, if it exists
          var searchString = "[href=\"#" + aTag.parentNode.parentNode.id + "\"]";
          sectionAnchor = document.querySelector(searchString);
          if(sectionAnchor !== null) {
            sectionAnchor.setAttribute("state", "selected");
            //If there is a section anchor, deselect any other anchors on the
            //parent section level
            aTags.forEach(function(parentATag) {
              if (parseInt(parentATag.parentNode.parentNode.className.slice(-1)) === sectionLevel - 1) {
                if (parentATag !== sectionAnchor) {
                  parentATag.setAttribute("state", "unselected");
                } 
              }
            });
          }
        } else {
          //Unselect any <a> tags only their parent is currently selected
          //(This allows us to maintain <a> selection hightlight states 
          //for currently unselected sections)
          if(aTag.parentNode.parentNode.getAttribute("state") === "selected") {
            aTag.setAttribute("state", "unselected");
          }
        }
      }
    });
  }
  
  function update() {
    requestAnimationFrame(update);
    //This function runs every 1/60th of a second and watches for changes
    //in the url location hash. If it changes, the selectSection function finds the
    //new selected sections and also selects the matching <a> tags
    //Find the currenly url hash location
    currentLocation = window.location.hash;
    if (currentLocation !== previousLocation) {
      selectSection();
    }
    //Remember the previous url hash location
    previousLocation = currentLocation;
  }
  
  function poetry() {

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
      var sectionFound = sections.some(function(section) {
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
  POETRYBOOK.tree.makeHTMLFromMarkdown({files: markdownDocuments, callback: poetry});

}());