The Poetry Book
===============

<h2 category="what?">What is The Poetry Book?</h2>
*The Poetry Book* is a fast and easy system for quickly making your own book of poems. You can also use it as the basis of building highly interactive websites and apps. If you want to create your own book of poems that looks like this one, [get the source code](http:#) and modify it as much as you like.

![A test image](images/williamBlake.png)
 
All the content for the entire book exists as a single [markdown document](http://daringfireball.net/projects/markdown/basics). Markdown documents are quick and easy to read and write, and don't require any technical skill to create. The Poetry Book uses the markdown document to figure out how the website should be organized. This is all done automatically using JavaScript - you don't have to worry about it. Just drop your markdown file into the Poetry Book's home folder, and the navigation bar and content pages will be automatically created. Fill the content pages with anything you like, as much as you like. Drop the Poetry Book project folder into any webserver, and you're done. There's nothing to configure or install, and no complex dependant technologies. It's a new way to think about websites and interactive content using the most basic technologies available.

If you like, you can completely customize the css code to create completely new and original layouts and designs based on this system. It will work on any platform, anywhere. There is only one content file, so it's extremely easy to manage and displays pages instantly. If you keep things simple, this might be all you need to build a small to medium-sized personal website or focused app.
  
Or, just make a poetry book.

### What do you need to know? ###

You need to know [how to write a markdown document](http://www.markdowntutorial.com). That's all.

If you want to post your Poetry Book on the interent, you have to use FTP software to upload the Poetry Book project folder into a webserver. Do you have an account with a website hosting company? You'll need that. An internet search will help you find a web hosting company, and you might find a good free one. This is all a bit more technical, but [This video shows you how to upload files to a webserver](http://www.youtube.com/watch?v=O3DudpEMPiY).

If you want to change the design and behaviour of your Poetry Book, you should know some basic HTML and CSS. If you don't know what those things are, you should learn them first. (There are many resources on the internet that will help you do this. Doing a web search for "HTML and CSS tutorial" is a good place to start. The first chapter of [this book](http://www.apress.com/programming/javascript/9781430247166) is also really good). You need to know HTML and CSS basics so that you can start customizing things like the fonts, colors and layout.

For HTML and CSS experts, go wild! This project was intended as the simplest, bare-bones example of a new vision of what highly interactive websites and apps could be. 

### How to make your own book ###

Use a plain text editor to write a markdown document. Or, you can use a free online markdown editor, [like this one](http://dillinger.io). (If you want a get fancy, download the latest version of [brackets](http://brackets.io) and install the markdown extension from the extension manager).

Here's an example of a markdown document that will create a book with two pages of poems.

![](images/example1Markdown.png)

(Hint: to create a line-break after the end of a line of poetry, add two blank spaces.)

Save this document with the name "book.markdown" and save it in the main Poetry Book project folder. (That's the same folder that includes a file called index.html. If there's already an existing document called book.markdown in that same folder (there will be, this one!), replace it with your new one.)

After you've done that, open the index.html file in a web browser, and you'll see this:

![](images/example1.png)

The Poetry Book will organize the poems in the same order that they appear in your markdown document.

(You'll find this example markdown document as "example1.markdown" in the "examples" folder.)

If you're the kind of person who really likes to organize things, you can sort your poems into categories. Maybe you've got two kinds of poems: *fun* poems and *boring* poems. You can add categories to your poem titles, and the Poetry Book will sort your poems into those categories. Here's an example of a book with three poems: one boring poem and two fun poems.

![](images/example2Markdown.png)

Here's what this next example poetry book will look like:

![](images/example2.png)

You can see that in this example the poem titles are surrounded by an HTML `<h2>` tag. Inside the `<h2>` tag is the category. Create a new category using this format: category="category name". That means that if you wanted to create a new category called *Really crazy ideas* you would do it like this:

`<h2 category="Really crazy ideas">Drawing on puddles with water-proof markers</h2>`

(Don't forget to close the final `</h2>` tag or your book won't display correctly.)

That is is all you need to do. You've got a poetry book!

### Category ordering ###

The categories will be ordered alphabetically. To change that, you'll need to change the JavaScript code in the poetryBook.js file. If that's something you're confident doing, go for it! But, if you don't fight it, you'll discover that's it's really nice just to have the system organize your poems for you like this. It's just one less decision you need to make, and you can make it work for you. 
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

### Advanced stuff ###

You can use The Poetry Book to make a website. Just use real information, instead of poems. And, if you  know enough HTML CSS and JavaScript, you can completely customize it to look and behave however you want it to.

If you want to do that, here are some of the things you should know about the source code:

???

### Why The Poetry Book is cool ###

- An all the content exists as a single, easy-to-read markdown file.
- There are no moving parts, so nothing can break.
- Content pages display instantly because they all exist in that single file. The browser doesn't need to make continual http requests to a server for each page.
- You can manage the entire website offline, without needing a CMS or web server. You can do it in Notepad.
- Minimal, uncluttered content management using markdown so that it's extremely easy to add and customize content by hand. Just use your source code editor's search capability (Ctrl-F) to find what you're looking for.
- When you want to update your website content, just upload the single html file with FTP.
- Use this same code as the foundation for building a mobile app (with [CocoonJS](http://www.ludei.com/tech/cocoonjs)), or a desktop app (with [node-webkit](https://github.com/rogerwang/node-webkit/wiki/Getting-Started-with-node-webkit)).
- Completely transportable. Just drop the same files into any webserver anywhere, and it will work exactly the same without any configuration or installation. Keep your whole website in your back pocket.
- Low-tech, high-performance, and extremely easy to maintain.
- Less is more!

[Get the source](http://#).

<h2 class="x">Unlinked content</h2>

This content won't be displayed in the navigation bar. To set this up, give the `<h2>` tag the class name "x" and don't give it a category. You can access this content through the `<article>` tag that will surround it. The article's id will be the same as the `<h2>` title, but lowercase without spaces. For example, the `<article>` tag for this section will look like this:

`<article id="unlinkedcontent" class="x">`

This is an advanced feature, but could be extremely useful if you're building a complex custom user interface. For example, you might want a login window that appears when a reader clicks a button. You could then use JavaScript and CSS to make this content appear.

In the css file, Make sure to give the element a z-index value which is *higher than 1000*. This is so that it displays above the currently selected page content. You'll also need to set the opacity to *100*, and the display to *block*. Like this:

{  
  z-index: 2000;  
  display: block;  
  opacity: 100;  
}  
  
This is a very powerful feature because it lets you use The Poetry Book as the basis for a complex website or app user interface.

<h2 category="blake">Infant Sorrow</h2>

My mother groaned, my father wept,  
Into the dangerous world I leapt.  
Helpless, naked, piping loud,  
Like a fiend hid in a cloud.

Struggling in my father's hands,  
Striving against my swaddling bands,  
Bound and weary, I thought best  
To sulk upon my mother's breast.  

*William Blake*
  
<h2 category="blake">Auguries of Innocence</h2>

To see a world in a grain of sand,  
And a heaven in a wild flower,  
Hold infinity in the palm of your hand,  	
And eternity in an hour.  

*William Blake*
  
<h2 category="rilke">The Panther</h2>

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
  
<h2 category="rilke">Evening</h2>

The bleak fields are asleep,  
My heart alone wakes.  
The evening in the harbour  
Down his red sails takes.  

Night, guardian of dreams,  
Now wanders through the land.  
The moon, a lily white,  
Blossoms within her hand.  

*Rainer Maria Rilke*
 
<h2 category="coleridge">Kubla Khan</h2>

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
 
<h2 category="coleridge">Songs of the Pixies</h2>

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

