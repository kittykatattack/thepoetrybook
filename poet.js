/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.poet = (function () {
  "use strict";
  
  //List the markdown documents you want to load into the array
  var markdownDocuments = ["test.markdown"];
  
  //The tree.js function runs this callback when the HTML tree has been built
  function poetry() {
    
  }
  //Tell the tree.js to build the HTML tree structure from the markdown documents
  POETRYBOOK.tree.makeHTMLFromMarkdown(markdownDocuments, poetry);
  
}());