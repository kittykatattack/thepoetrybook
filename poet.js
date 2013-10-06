/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";
  
  //List the markdown documents you want to load into the array
  var markdownDocuments = ["test.markdown"],
    contentSections,
    currentlyDisplayedSection;
  
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
        //window.location.hash = "#" + currentlyDisplayedSection.id;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
      //window.location.hash = "#" + currentlyDisplayedSection.id;
    }  
  }
  
  function update() {
    webkitRequestAnimationFrame(update);
    contentSections.some(display);
    //window.location.hash = "#" + currentlyDisplayedSection.id;
  }
  function mouseDownHandler(event) {
    //window.location.hash = "#" + currentlyDisplayedSection.id + this.hash + "/" ;
    //event.preventDefault();
    //update();
    //console.log(window.location.hash);
  }
  //The tree.js function runs this callback when the HTML tree has been built
  function poetry() {
    //Find all the <h2> heading sections. They have all belong to the class ".section1"
    contentSections = document.querySelectorAll(".section1");
    contentSections = Array.prototype.slice.call(contentSections);
    //Get all the <a> tags and attach a mouseEvent listener to them
    
    var aTags = document.querySelectorAll("a");
    aTags = Array.prototype.slice.call(aTags);
    aTags.forEach(function(aTag) {
      aTag.addEventListener("mousedown", mouseDownHandler, false);
    });
    
    //Display the first section content 
    //(this will be the first <h2> heading section in the markdown document)
    if (currentlyDisplayedSection === undefined) {
      currentlyDisplayedSection = contentSections[0];
      window.location.hash = "#" + currentlyDisplayedSection.id;
      currentlyDisplayedSection.style.opacity = 1;
      currentlyDisplayedSection.style.zIndex = 1;
    }
    update();
  }
  //Tell the tree.js to build the HTML tree structure from the markdown documents
  POETRYBOOK.tree.makeHTMLFromMarkdown(markdownDocuments, poetry);
  
}());