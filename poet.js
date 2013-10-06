/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";
  
  //List the markdown documents you want to load into the array
  var markdownDocuments = ["test.markdown"],
    contentSections,  
    currentlyDisplayedSection,
    navATags,
    navSection = {name: "", newSelection: "", oldSelection: ""},
    navSections = [];
  
  //Display the correct <h2> content section if the section.id matches the url location hash
  function display(section) {
    //Does the location hash match a section id?
    if (window.location.hash === "#" + section.id) {
      //Is the section not the currently selected section?
      if (section !== currentlyDisplayedSection) {
        currentlyDisplayedSection.style.opacity = 0;
        currentlyDisplayedSection.style.zIndex = 0;
        section.style.opacity = 1;
        section.style.zIndex = 1;
        currentlyDisplayedSection = section;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }  
  }
  
  //This function maintains the correct slection state 
  //for each level of sub-navigation
  function highlightSelectedLink(event) {
    
    //Find out from which section level the click game from 
    var currentNavSection = event.target.parentNode.parentNode.className;
    
    function makeNewNavSection(currentNavSection) {
      var newNavSection = Object.create(navSection);
      newNavSection.name = currentNavSection;
      newNavSection.oldSelection = undefined;
      newNavSection.newSelection = event.target;
      newNavSection.newSelection.className = "selected";
      navSections.push(newNavSection);
    }
    
    //If there aren't any navigation sections create a new one
    //(There won't be any the first time the page loads)
    if (navSections.length === 0) {
      makeNewNavSection(currentNavSection);
    } else {
      //If there are navigation sections, find ot whether any of their
      //names match the currentNavSection 
      navSections.some(function(navSection){
        //If they do, select the current link and deselect the old one
        if(navSection.name === currentNavSection) {
          navSection.oldSelection = navSection.newSelection
          navSection.oldSelection.className = "unselected";
          navSection.newSelection = event.target;
          navSection.newSelection.className = "selected";
          return true;
        } else {
          //If they don't, we must be visiting a new navigation section, so
          //create a new one to start tracking it
          makeNewNavSection(currentNavSection);
        }
      });
    }
  }
  
  function update() {
    requestAnimationFrame(update);
    contentSections.some(display);
  }
  
  //The tree.js function runs this callback when the HTML tree has been built
  function poetry() {
    //Find all the <h2> heading sections. They have all belong to the class ".section1"
    contentSections = document.querySelectorAll(".section1");
    contentSections = Array.prototype.slice.call(contentSections);
    //Find all the <a> tags inside the <nav> sections. Add a mousedown listenter to the them
    //to check wether they're the currently selected link, and updated their class names to match.
    navATags = document.querySelectorAll("nav a");
    navATags = Array.prototype.slice.call(navATags);
    navATags.forEach(function(navATag) {
      navATag.addEventListener("mousedown", highlightSelectedLink, false);
    });
    
    //Display the first section content 
    //(this will be the first <h2> heading section in the markdown document)
    if (currentlyDisplayedSection === undefined) {
      //If the index.html page is loaded
      if(window.location.hash === "")
      { 
        currentlyDisplayedSection = contentSections[0];
        window.location.hash = "#" + currentlyDisplayedSection.id;
        currentlyDisplayedSection.style.opacity = 1;
        currentlyDisplayedSection.style.zIndex = 1;
      } else {
        //If a link to a sub-section is loaded, check whether it's an section1 (<h2>) section
        contentSections.some(function(section) {
          if (window.location.hash === "#" + section.id) {
            currentlyDisplayedSection = section;
            currentlyDisplayedSection.style.opacity = 1;
            currentlyDisplayedSection.style.zIndex = 1;
            return true;
          } else {
            return false;
          }
        });
        //... if it's not an <h2> sections, look further...
        if (currentlyDisplayedSection == undefined) {
          var allSections = document.querySelectorAll("section");
          allSections = Array.prototype.slice.call(allSections);
          allSections.some(function(section) {
            if (window.location.hash === "#" + section.id) {
              while (section && section.className !== "section1") {
                section = section.parentNode;
              }
              currentlyDisplayedSection = section;
              currentlyDisplayedSection.style.opacity = 1;
              currentlyDisplayedSection.style.zIndex = 1;
              return true;
            } else {
              return false;
            }
          });
        }
        //if it's still not found after all that, just load the first section
        if (currentlyDisplayedSection === undefined) { 
          currentlyDisplayedSection = contentSections[0];
          window.location.hash = "#" + currentlyDisplayedSection.id;
          currentlyDisplayedSection.style.opacity = 1;
          currentlyDisplayedSection.style.zIndex = 1;
        }
      }
    }
    update();
  }
  
  //Tell the tree.js to build the HTML tree structure from the markdown documents
  POETRYBOOK.tree.makeHTMLFromMarkdown(markdownDocuments, poetry);
  
}());