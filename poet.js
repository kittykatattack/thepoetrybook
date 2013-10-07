/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";
  
  //List the markdown documents you want to load into the array
  var markdownDocuments = ["book.markdown"],
    contentSections,  
    currentlyDisplayedSection,
    currentLocation,
    previousLocation,
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
  
  //This function maintains the correct selection state 
  //for each level of sub-navigation
  //It works when you click on a <nav> section link or use the browser
  //back and forward buttons
  function highlightSelectedLink() {
    //Find out from which navigation bar the click came from
    //var currentNavSection = event.target.parentNode.parentNode.id;
    //console.log(currentNavSection);
    var currentNavSection,
      navSectionFound = false,
      target;
    
    function makeNewNavSection(currentNavSection) {
      var newNavSection = Object.create(navSection);
      newNavSection.name = currentNavSection;
      newNavSection.oldSelection = undefined;
      newNavSection.newSelection = target;
      newNavSection.newSelection.className = "selected";
      navSections.push(newNavSection);
      navSectionFound = true;
    }
    
    //Find the <a> tag in the <nav> sections that match the location hash.
    //When it's been found, set it as the target get the id name of its section parent
    navATags.some(function(navATag) {
      if (navATag.href.slice(navATag.href.indexOf("#")) === window.location.hash) {
        currentNavSection = navATag.parentNode.parentNode.id;
        target = navATag;
        return true;
      } else {
        return false;
      }
    });
    
    //If there aren't any navigation sections create a new one
    //(There won't be any the first time the page loads)
    if (navSections.length === 0) {
      makeNewNavSection(currentNavSection);
    } else {
      //If there are navigation sections, find ot whether any of their
      //names match the currentNavSection 
      navSections.some(function(navSection) {
        if(navSection.name === currentNavSection) {
          //console.log(currentNavSection);
          //console.log(navSection.name);
          navSection.oldSelection = navSection.newSelection
          navSection.oldSelection.className = "unselected";
          navSection.newSelection = target;
          navSection.newSelection.className = "selected";
          navSectionFound = true;
          return true;
        } 
      });
      if(!navSectionFound) {
        //If there's no match, start tracking a new nav section
        makeNewNavSection(currentNavSection);
      }
    }
  }
  
  //This makes sure the section displays
  function update() {
    requestAnimationFrame(update);
    
    //Check whether the current url location is the same as it was in
    //the previous frame. If it isn't, update the display
    currentLocation = window.location.hash;
    if(currentLocation !== previousLocation)
    {
      contentSections.some(display);
      highlightSelectedLink();
    }
    previousLocation = currentLocation;
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
      //navATag.addEventListener("mousedown", highlightSelectedLink, false);
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