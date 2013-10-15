The Poetry Book
===============

What is The Poetry Book? [What?]
--------------------------------

*The Poetry Book* is a fast and easy system for quickly making your own book of poems. You can also use it as the basis for building highly interactive websites, apps or game interfaces. If you want to create your own book of poems that looks like this one, [get the source code](https://github.com/kittykatattack/thepoetrybook) and modify it as much as you like.

![A Painting by William Blake](images/williamBlake.png)
 
All the content for the entire book exists as a single [markdown document](http://daringfireball.net/projects/markdown/basics). Markdown documents are quick and easy to read and write, and don't require any technical skill to create. The Poetry Book uses the markdown document to figure out how the website should be organized. This is all done automatically using JavaScript - you don't have to worry about it. Just drop your markdown file into the Poetry Book's home folder, and the navigation bar and content pages will be automatically created. Fill the content pages with anything you like, as much as you like. Completely change the layout and design with CSS. Drop the Poetry Book project folder into any webserver, and you're done. There's nothing to configure or install, no complex dependant technologies, and no command-line-anything. It's a new way to think about websites and interactive content using the most basic technologies available.

If you like, you can completely customize the css code to create entirely new and original layouts and designs based on this system. It will work on any platform, anywhere. There is only one content file, so it's extremely easy to manage and displays pages instantly. If you keep things simple, this might be all you need to build a small to medium-sized personal website, portfolio gallery or focused app.
  
Or, just make a poetry book.

### What do you need to know? ###

You need to know [how to write a markdown document](http://www.markdowntutorial.com). That's all.

If you want to post your Poetry Book on the internet, you need some kind of website hosting service. You could [use Google Drive](http://chronicle.com/blogs/profhacker/host-a-website-on-google-drive/46737). Or, you could use [Dropbox, in the normal way](http://www.dropboxwiki.com/tips-and-tricks/host-websites-with-dropbox), or [Dropbox, in the fancy way](http://www.makeuseof.com/tag/how-to-host-a-dropbox-website/). Or, you could use your own website hosting company and with your own domain name - there are lots of options.

If you want to change the graphic-design style and behaviour of your Poetry Book, you should know some basic HTML and CSS. If you don't know what those things are, you should learn them first. (There are many resources on the internet that will help you do this. Doing a web search for "HTML and CSS tutorial" is a good place to start. The first chapter of [this book](http://www.apress.com/programming/javascript/9781430247166) is also really good). You need to know HTML and CSS basics so that you can start customizing things like the fonts, colors and layout.

For HTML and CSS experts, go wild! This project was intended as the simplest, bare-bones example of a new vision of what highly interactive websites and apps could be. 

### How to make your own book ###

Use a plain text editor to write a markdown document. Or, you can use a free online markdown editor, [like this one](http://dillinger.io). (If you want to get fancy, download the latest version of [Brackets](http://brackets.io) and install the markdown extension from the extension manager). The Poetry Book uses an improved style of markdown called GFM, which [adds some extra useful features](https://help.github.com/articles/github-flavored-markdown). (Here's a good [markdown cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) you can use while you're learning to write markdown documents.)

What does a markdown document look like? Here's an example of a markdown document that will create a book with two pages of poems.

![](images/example1Markdown.png)

Save this document with the name "book.markdown" in the main Poetry Book project folder. (That's the same folder that includes a file called index.html. If there's already an existing document called book.markdown in that same folder (there will be, this one!), replace it with your new one.)

After you've done that, open the index.html file in a web browser, and you'll see this:

![](images/example1.png)

The Poetry Book will organize the poems in the same order that they appear in your markdown document.

(You'll find this example markdown document as "example1.markdown" in the "examples" folder.)

If you're the kind of person who really likes to organize things, you can sort your poems into categories. Maybe you've got two kinds of poems: *fun* poems and *boring* poems. You can add categories to your poem titles, and the Poetry Book will sort your poems into those categories. Here's an example of a book with three poems: one boring poem and two fun poems.

![](images/example2Markdown.png)

Here's what this next example poetry book will look like:

![](images/example2.png)

You can see that in this example the poem titles include extra words that are surrounded by square brackets. Those words are the category that you want to organize your poem into. That means that if you wanted to create a new category called *Really crazy ideas* you would do it like this:


`Drawing on puddles with water-proof markers [Really crazy ideas]`
`-----------------------------------------------------------------------`


You can use any category names you like. All poems in the same categories will be grouped together in the navigation bar.

That is all you need to do. You've got a poetry book!

### Category ordering ###

The categories will be ordered alphabetically. To change that, you'll need to change the JavaScript code in the tree.js file. If that's something you're confident doing, go for it! But, if you don't fight it, you'll discover that's it's really nice just to have the system organize your poems for you automatically like this. It's just one less decision you need to make, and you can make it work for you. 

Spend the extra time you saved to write some poetry.

Poems will be organized under categories based on the order in which they appear in your markdown document. That means the poems near the top will appear before the poems below them.

If you don't include a category, the poem will appear at the very top of the navigation bar, above the all the other categorized poems.

A useful feature is that the first poem in the markdown document will also be the first one to be displayed when the book loads. That means if you want readers to see the newest content first, just add it as the first poem in your markdown document.

### Adding images ###

Use this bit of simple markdown to add an image:

`![A description of the image](imageFileName.png)`

### Linking poems ###

If you want to link a poem to another poem in the book you can [do it like this](#songsofthepixies):

`[do it like this](#songsofthepixies)`

### Sub-page navigation headings for websites ###

If you want to use The Poetry Book to make a website, you can think of each poem as a page of content. You might have pages with a lot of information that you want to break up with sub-headings. You can add a sub-heading in a page like this:

`### This is a sub-heading inside a page ###`

The Poetry Book will automatically create a sub-page navigation bar for you based on these headings. To see it in this example, move your mouse over the light-gray vertical bar to the left of this page. A navigation bar will open showing you all the headings inside this page. You can jump to a new heading by clicking one of the links.

If you don't want this sub-page navigation to be displayed, add this bit of code to the end of your CSS file:

.section1 nav {display: none;}

### Making a website ###

You can use The Poetry Book to make a website. Just use real information, instead of poems. And, if you  know enough HTML CSS and JavaScript, you can completely customize it to look and behave however you want it to. In fact, The Poetry Book was written specifically to make it easy for you to do that. 

If you don't know HTML, CSS and basic JavaScript - don't read further! 
But, if you do, here are some of the things you should know about the source code:

All the HTML code is generated automatically by the poetryBook.min.js file based on the structure of your markdown document. That means you won't be able to see the HTML page structure by looking at the index.html file. Instead, you'll need to open the *developer tools* in whatever browser you're using, and use it to inspect the generated HTML elements. (If you're using the [Chrome browser](https://www.google.com/intl/en/chrome/browser/), you can [do it like this](https://developers.google.com/chrome-developer-tools/docs/elements).)

Using those tools, try it now and a look at the HTML structure of this example Poetry Book (yes, this very one you're reading!) You'll notice that every heading from the markdown document has a matching HTML heading tag: `<h1>, <h2>, <h3>` etc. And each of those headings, and the content they contain, are nested inside a  matching `<section>` tag. Those `<section>` tags all have class names: section0, section1, section2, etc. section0 matches the `<h1>` tag, section1 matches the `<h2>` tags, and section2 matches the `<h3>` tags.

![](images/htmlExample1.png)

Here's what one of the poems looks like:

![](images/htmlExample3.png)

You can also see that the id names for each section are the same as the document headings, except in lower case without spaces or punctuation. You'll also notice that the entire book is wrapped inside a single `<section>` tag with the class name section0. That's based on the main heading that you gave your markdown document. 

#### Selection states

You'll also notice that the sections have *state* attributes. These are set as either "selected" or "unselected". Those states are set for you automatically by the poetrybook.min.js file, based on currently active links. This is really useful, because it means that you can use those *state* attributes to selectivly show or hide content. For example, here's the css you could use to make only selected content in section1 visible:

section .section1[state=selected] {
  opacity: 1;
  z-index: 1;
}
section .section1[state=unselected] {
  z-index: 0;
  opacity: 0;
}

This is a really powerful feature. It's the key to easily making highly dynamic, complex websites with nothing more than a few simple lines of CSS. Take a look at the poetryBook.css file to see how it's been implemented in this example.

#### Navigation bars

Each `<section>` tag is also immediately followed by a `<nav>` tag. This is a navigation bar that's automatically created for each sub-heading in that section. In the following illustration your can see the `<nav>` tag for this section that you're now reading, and how the links correspond to the id tags of the sub-sections.

![](images/htmlExample2.png)


Each `<a>` tag in the navigation bar has an href attribute that matches a sub-section's id attribute. The `<a>` tags also have *state* attributes. Look carefully, and you'll notice that if an `<a>` tag's state is "selected", the matching sub-section state will also be "selected". Everything else will be "unselected". This makes it easy for you to create navagation highlight states in your CSS, like this:

nav a[state=selected] {
  color: #eee8aa;
}
nav a[state=unselected] {
  color: white;
}

The poetryBook.min.js file does all the work of figuring out which navigation links and sections should be selected or unselected, so you don't need to worry about that.

#### Images

You can access each image by using an id that corresponds to its "alt" text: lower-case and without spaces or punctuation. Imagine that you've got an image in your markdown document that looks like this:

`![A Painting by William Blake](images/williamBlake.png)`

Its matching HTML will look like this:

`<img src="images/williamBlake.png" alt="A Painting by William Blake" id="apaintingbywilliamblake" >`

#### Making hidden, unlinked content

You might have some content that should remain hidden and unlinked, unless some conditions are met. In that case, give that content section an "x" category, like this

`### This content should not be visible [x] ###`

This content will be created in a `<section>` that has a class called "x". To hide all "x" class content, use this CSS code:

.x {display: none;}

If you want to make it visible at some point based on user interaction, add some css that might look like this:

```
#thiscontentshouldnotbevisible {
  display: block;
  z-index: 2;
}

```

(Giving it a high z-index number will make sure that it displays above the any other visible content.)

This is an advanced feature, but could be extremely useful if you're building a complex custom user interface. For example, you might want a login window that appears when a reader clicks a button. You could then use JavaScript and CSS to make this content appear.

#### Adding HTML code into the markdown document

You can add your own HTML code directly into your markdown document. This is really useful for adding things like YouTube video embed code, or games inside `<iframe>` tags.  Just make sure to leave 1 blank line between the html code block and your markdown text.

#### Loading markdown documents

One thing you may want to do is change the name of the markdown file that that's being loaded. To do that, open the JavaScript file called documents.js:

```
var POETRYBOOK = POETRYBOOK || {};
POETRYBOOK.documents = (function () {
  return ["../book.markdown",];
}());

```
Change the name of the array element to any markdown document you want to use, like this:

`["../anyDocument.markdown"]`

Then save the file, and reload index.html.

You can also use more than one markdown file to build your poetry book. In fact, you can use as many as you like - there's no limit. Just add the names of the documents you want to use as elements in the array. For example, here's how to make a book using 3 separate documents:

`["../firstDoc.markdown", "../secondDoc.markdown", "../thirdDoc.markdown"]`

The Poetry Book will merge all the documents into a single book. But if you want to use multiple documents like this, you'll need to plan them a bit to make sure they organize themselves the way you expect. Also, there can only be one main title for the entire book, so make sure only one document has a main heading, like this:

```
Use Only One Main Heading For All Your Documents
=============================================
```

If you do use more than one main heading, you'll end up with two separate books inside one HTML page. That could possibly be really useful in some way that I haven't been able to figure out yet. Or, it could not be what you want at all!

#### More about the JavaScript code

Make your life easy and just link the document.js and poetryBook.min.js file to the index.html file. You probably won't need to customize the source code. If you want to add some features, just create an additional JavaScript file that implements those new features.

If you do want to mess around with the source code, you'll need to load the JS files in this order:

documents.js
rafPollyfill.js
marked.js
tree.js
poet.js

rafPollyfill.js makes sure that requestAnimationFrame works on all platforms. marked.js converts the markdown document to HTML. tree.js structures the HTML into useful nested sections and adds the navigation bars. poet.js sets the correct selection states for each section. All the source code is documented if you feel you want to try and customize it.

#### An optional table of contents

The tree.js file creates a table of contents with the id "toc". It also adds `<a>` tag links between the table of contents and its matching section in the main HTML. This could be very useful for some styles of websites, so it's there if you need it. However, if you don't, prevent the table of contents from displaying with the following CSS code:

```
#toc {
  display: none;
}
```

#### Some other things you should know

* The `<title>` tag will contain the same text as your markdown document's main heading.
* Identical heading names in your markdown document with have id names that match those names, with the addition of a number. For example, if you have 2 headings both called "story", the first one will have an id called "story0" and the second will be "story1".
* If a section only has 1 subheading, a navigation bar won't be created for that section.
* You can add user comments to sections with [Disqus](http://disqus.com/). You can add a website discussion forum with [Discourse](http://www.discourse.org/).

###  Why The Poetry Book is cool ###

- All the content exists as a single, easy-to-read markdown file.
- There are no moving parts, so nothing can break.
- Content pages display instantly because they all exist in that single file. The browser doesn't need to make continual http requests to a server for each page.
- You can manage the entire website offline, without needing a CMS, database or web server. You can do it in Notepad.
- Minimal, uncluttered content management using markdown so that it's extremely easy to add and customize content by hand. Just use your text editor's search capability (Ctrl-F) to find what you're looking for.
- When you want to update your website content, just make some changes to the single markdown file.
- Use this same code as the foundation for building a mobile app (with [CocoonJS](http://www.ludei.com/tech/cocoonjs)), or a desktop app (with [node-webkit](https://github.com/rogerwang/node-webkit/wiki/Getting-Started-with-node-webkit)), or for quickly building a GUI for a game.
- Completely transportable. Just drop the same files into any webserver anywhere, and it will work exactly the same without any configuration or installation. Keep your whole website in your back pocket.
- Low-tech, high-performance, and extremely easy to maintain.
- Command-line nothing. Way faster an easier to use than other static website creation frameworks like Jekyll.
- Less is more!

[Get the source](https://github.com/kittykatattack/thepoetrybook).


Unlinked content [x]
--------------------
This content won't be displayed in the navigation bar. To set this up, add an [x] category to any heading. You can then access this content through the `<section>` tag id name that matches the heading. 

This is an advanced feature, but could be extremely useful if you're building a complex custom user interface. For example, you might want a login window that appears when a reader clicks a button. You could then use JavaScript and CSS to make this content appear.

Infant Sorrow [Blake]
---------------------

My mother groaned, my father wept,
Into the dangerous world I leapt.
Helpless, naked, piping loud,
Like a fiend hid in a cloud.

Struggling in my father's hands,
Striving against my swaddling bands,
Bound and weary, I thought best,
To sulk upon my mother's breast.

*William Blake*
  
Auguries of Innocence [Blake]
-----------------------------

To see a world in a grain of sand,  
And a heaven in a wild flower,  
Hold infinity in the palm of your hand,  	
And eternity in an hour.  

*William Blake*
  
The Panther [Rilke]
-------------------
His vision, from the constantly passing bars,  
has grown so weary that it cannot hold  
anything else. It seems to him there are  
a thousand bars; and behind the bars, no world.  

As he paces in cramped circles, over and over,  
the movement of his powerful soft strides  
is like a ritual dance around a center  
in which a mighty will stands paralyzed.  

Only at times, the curtain of the pupils  
lifts, quietly. An image enters in,  
rushes down through the tensed, arrested muscles,  
plunges into the heart and is gone.  
  
*Rainer Maria Rilke*
  
Evening [Rilke]
---------------

The bleak fields are asleep,  
My heart alone wakes.  
The evening in the harbour  
Down his red sails takes.  

Night, guardian of dreams,  
Now wanders through the land.  
The moon, a lily white,  
Blossoms within her hand.  

*Rainer Maria Rilke*
 
Kubla Khan [Coleridge]
----------------------

In Xanadu did Kubla Khan  
A stately pleasure-dome decree:  
Where Alph, the sacred river, ran  
Through caverns measureless to man  
Down to a sunless sea.  
So twice five miles of fertile ground  
With walls and towers were girdled round;  
And there were gardens bright with sinuous rills,  
Where blossomed many an incense-bearing tree;  
And here were forests ancient as the hills,  
Enfolding sunny spots of greenery.  

But oh! that deep romantic chasm which slanted  
Down the green hill athwart a cedarn cover!  
A savage place! as holy and enchanted  
As e’er beneath a waning moon was haunted  
By woman wailing for her demon-lover!  
And from this chasm, with ceaseless turmoil seething,  
As if this earth in fast thick pants were breathing,  
A mighty fountain momently was forced:  
Amid whose swift half-intermitted burst  
Huge fragments vaulted like rebounding hail,  
Or chaffy grain beneath the thresher’s flail:  
And mid these dancing rocks at once and ever  
It flung up momently the sacred river.  
Five miles meandering with a mazy motion  
Through wood and dale the sacred river ran,  
Then reached the caverns measureless to man,  
And sank in tumult to a lifeless ocean;  
And ’mid this tumult Kubla heard from far  
Ancestral voices prophesying war!  
The shadow of the dome of pleasure  
Floated midway on the waves;  
Where was heard the mingled measure  
From the fountain and the caves.  
It was a miracle of rare device,  
A sunny pleasure-dome with caves of ice!  

A damsel with a dulcimer  
In a vision once I saw:  
It was an Abyssinian maid  
And on her dulcimer she played,  
Singing of Mount Abora.  
Could I revive within me  
Her symphony and song,  
To such a deep delight ’twould win me,  
That with music loud and long,  
I would build that dome in air,  
That sunny dome! those caves of ice!  
And all who heard should see them there,  
And all should cry, Beware! Beware!  
His flashing eyes, his floating hair!  
Weave a circle round him thrice,  
And close your eyes with holy dread  
For he on honey-dew hath fed,  
And drunk the milk of Paradise.  
  
*Samuel Taylor Coleridge*
 
Songs of the Pixies [Coleridge]
-------------------------------

I.  
Whom the untaught Shepherds call  
Pixies in their madrigal,  
Fancy's children, here we dwell:  
Welcome, Ladies! to our cell.  
Here the wren of softest note  
Builds its nest and warbles well;  
Here the blackbird strains his throat;  
Welcome, Ladies! to our cell.  

II.  
When fades the moon to shadowy-pale,  
And scuds the cloud before the gale,  
Ere the Morn, all gem-bedight,  
Hath streak'd the East with rosy light,  
We sip the furze-flower's fragrant dews  
Clad in robes of rainbow hues:  
Or sport amid the shooting gleams  
To the tune of distant-tinkling teams,  
While lusty Labour scouting sorrow  
Bids the Dame a glad good-morrow,  
Who jogs the accustomed road along,  
And paces cheery to her cheering song.  

III.  
But not our filmy pinion  
We scorch amid the blaze of day,  
When Noontide's fiery-tressed minion  
Flashes the fervid ray.  
Aye from the sultry heat  
We to the cave retreat  
O'ercanopied by huge roots intertwined  
With wildest texture, blackened o'er with age:  
Round them their mantle green the ivies bind,  
Beneath whose foliage pale  
Fanned by the unfrequent gale  
We shield us from the Tyrant's mid-day rage.  

IV.  
Thither, while the murmuring throng  
Of wild-bees hum their drowsy song,  
By Indolence and Fancy brought,  
A youthful Bard, 'unknown to Fame',  
Wooes the Queen of Solemn Thought,  
And heaves the gentle misery of a sigh,  
Gazing with tearful eye,  
As round our sandy grot appear  
Many a rudely sculptured name  
To pensive Memory dear!  
Weaving gay dreams of sunny-tinctured hue  
We glance before his view:  
O'er his hush'd soul our soothing witcheries shed  
And twine the future garland round his head.  

V.  
When Evening's dusky car  
Crowned with her dewy star  
Steals o'er the fading sky in shadowy flight;  
On leaves of aspen trees  
We tremble to the breeze  
Veiled from the grosser ken of mortal sight.  
Or, haply, at the visionary hour,  
Along our wildly-bowered sequestered walk,  
We listen to the enamoured rustic's talk;  
Heave with the heavings of the maiden's breast,  
Where young-eyed Loves have hid their turtle nest;  
Or guide of soul-subduing power  
The glance, that from the half-confessing eye  
Darts the fond question or the soft reply.  

VI.  
Or through the mystic ringlets of the vale  
We flash our faery feet in gamesome prank;  
Or, silent-sandal'd, pay our defter court,  
Circling the Spirit of the Western Gale,  
Where wearied with his flower-caressing sport,  
Supine he slumbers on a violet bank;  
Then with quaint music hymn the parting gleam  
By lonely Otter's sleep-persuading stream;  
Or where his wave with loud unquiet song  
Dashed o'er the rocky channel froths along;  
Or where, his silver waters smoothed to rest,  
The tall tree's shadow sleeps upon his breast.  

VII.  
Hence thou lingerer, Light!  
Eve saddens into Night.  
Mother of wildly-working dreams! we view  
The sombre hours, that round thee stand  
With down-cast eyes (a duteous band!)  
Their dark robes dripping with the heavy dew.  
Sorceress of the ebon throne!  
Thy power the Pixies own,  
When round thy raven brow  
Heaven's lucent roses glow,  
And clouds in watery colours drest  
Float in light drapery o'er thy sable vest:  
What time the pale moon sheds a softer day  
Mellowing the woods beneath its pensive beam:  
For mid the quivering light 'tis ours to play,  
Aye dancing to the cadence of the stream.  

VIII.  
Welcome, Ladies! to the cell  
Where the blameless Pixies dwell:  
But thou, sweet Nymph! proclaimed our Faery Queen,  
With what obeisance meet  
Thy presence shall we greet?  
For lo! attendant on thy steps are seen  
Graceful Ease in artless stole,  
And white-robed Purity of soul,  
With Honour's softer mien;  
Mirth of the loosely-flowing hair,  
And meek-eyed Pity eloquently fair,  
Whose tearful cheeks are lovely to the view,  
As snow-drop wet with dew.  

IX.  
Unboastful Maid! though now the Lily pale  
Transparent grace thy beauties meek;  
Yet ere again along the impurpling vale,  
The purpling vale and elfin-haunted grove,  
Young Zephyr his fresh flowers profusely throws,  
We'll tinge with livelier hues thy cheek;  
And, haply, from the nectar-breathing Rose  
Extract a Blush for Love!  
  
*Samuel Taylor Coleridge*

