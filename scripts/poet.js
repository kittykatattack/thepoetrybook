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
    var sectionLevel;
    //Look at the sections
    sections.some(function(section, index) {
      //Is there one that has an id that matches the url hash location?
      if (window.location.hash === "#" + section.id) {
        //If there is, set the section's state attribute to selected
        section.setAttribute("state", "selected");
        //Figure out the section level (0, 1, 2 etc.) by looking at last character
        //of the section's class name
        sectionLevel = section.className.slice(-1);
        //We also want to select the section's matching <a> tag, so the css
        //can create a highlight effect
        //Check all the <a> tags inside <nav> tags
        console.log(section.id);
        console.log(section.getAttribute("state"));
        aTags.forEach(function(aTag) {
          //Do the <a> tag and the <section> have the same parent?
          if(aTag.parentNode.parentNode === section.parentNode) {
            //If they do, does the <a> tag's href match the <section> id?
            if (section.id === aTag.href.slice(aTag.href.indexOf("#") + 1)) { 
              //If yes, set the <a> tag state to selected
              aTag.setAttribute("state", "selected");
            } else {
              //If not, set it to unselected
              aTag.setAttribute("state", "unselected"); 
            }
          }
        });
        return true;
      }
    });
    //We need to deselect sections and <a> tags that aren't currently selected
    sections.some(function(section) {
      var previousSectionLevel = section.className.slice(-1);
      //Check whether the previousLocation matches a <section> id
      if (previousLocation === "#" + section.id) { 
        //If it does, is it in the current selection level? (0, 1, 2 etc.)
        if (previousSectionLevel === sectionLevel) {
          //If it is, unselect it
          section.setAttribute("state", "unselected");
          //Unselect it's matching <a> tag
          aTags.some(function(aTag) {
            if (section.id === aTag.href.slice(aTag.href.indexOf("#") + 1)) { 
              aTag.setAttribute("state", "unselected");
              return true;
            }
          });
          return true;
        }
        //Unselect a section if we're moving further up in the hierarchy
        if (previousSectionLevel > sectionLevel) {
          //section.parentNode.setAttribute("state", "unselected");
        }
      }
    });
  }
  
  function highlightSectionLink() {
    var sectionLevel
    aTags.some(function(aTag) {
      if (window.location.hash === aTag.href.slice(aTag.href.indexOf("#"))) { 
        aTag.setAttribute("state", "selected");
        sectionLevel = aTag.parentNode.parentNode.className.slice(-1);
        console.log("aTag: " + aTag.href.slice(aTag.href.indexOf("#")));
        console.log("sectionLevel: " + sectionLevel);
        return true;
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