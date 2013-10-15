/**
 * marked - a markdown parser
 * Copyright (c) 2011-2013, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){3,} *\n*/,
  blockquote: /^( *>[^\n]+(\n[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', /\n+(?=(?: *[-*_]){3,} *(?:\n+|$))/)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3]
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i+1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item[item.length-1] === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: cap[1] === 'pre' || cap[1] === 'script',
        text: cap[0]
      });
      continue;
    }

    // def
    if (top && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1][cap[1].length-1] === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([^\s]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1][6] === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // url (gfm)
    if (cap = this.rules.url.exec(src)) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += '<a href="'
        + href
        + '">'
        + text
        + '</a>';
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? escape(cap[0])
        : cap[0];
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0][0];
        src = cap[0].substring(1) + src;
        continue;
      }
      out += this.outputLink(cap, link);
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<strong>'
        + this.output(cap[2] || cap[1])
        + '</strong>';
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<em>'
        + this.output(cap[2] || cap[1])
        + '</em>';
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<code>'
        + escape(cap[2], true)
        + '</code>';
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<br>';
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += '<del>'
        + this.output(cap[1])
        + '</del>';
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += escape(this.smartypants(cap[0]));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  if (cap[0][0] !== '!') {
    return '<a href="'
      + escape(link.href)
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>'
      + this.output(cap[1])
      + '</a>';
  } else {
    return '<img src="'
      + escape(link.href)
      + '" alt="'
      + escape(cap[1])
      + '"'
      + (link.title
      ? ' title="'
      + escape(link.title)
      + '"'
      : '')
      + '>';
  }
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    .replace(/--/g, '\u2014')
    .replace(/'([^']*)'/g, '\u2018$1\u2019')
    .replace(/"([^"]*)"/g, '\u201C$1\u201D')
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options) {
  var parser = new Parser(options);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length-1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return '<hr>\n';
    }
    case 'heading': {
      return '<h'
        + this.token.depth
        + '>'
        + this.inline.output(this.token.text)
        + '</h'
        + this.token.depth
        + '>\n';
    }
    case 'code': {
      if (this.options.highlight) {
        var code = this.options.highlight(this.token.text, this.token.lang);
        if (code != null && code !== this.token.text) {
          this.token.escaped = true;
          this.token.text = code;
        }
      }

      if (!this.token.escaped) {
        this.token.text = escape(this.token.text, true);
      }

      return '<pre><code'
        + (this.token.lang
        ? ' class="'
        + this.options.langPrefix
        + this.token.lang
        + '"'
        : '')
        + '>'
        + this.token.text
        + '</code></pre>\n';
    }
    case 'table': {
      var body = ''
        , heading
        , i
        , row
        , cell
        , j;

      // header
      body += '<thead>\n<tr>\n';
      for (i = 0; i < this.token.header.length; i++) {
        heading = this.inline.output(this.token.header[i]);
        body += this.token.align[i]
          ? '<th align="' + this.token.align[i] + '">' + heading + '</th>\n'
          : '<th>' + heading + '</th>\n';
      }
      body += '</tr>\n</thead>\n';

      // body
      body += '<tbody>\n'
      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];
        body += '<tr>\n';
        for (j = 0; j < row.length; j++) {
          cell = this.inline.output(row[j]);
          body += this.token.align[j]
            ? '<td align="' + this.token.align[j] + '">' + cell + '</td>\n'
            : '<td>' + cell + '</td>\n';
        }
        body += '</tr>\n';
      }
      body += '</tbody>\n';

      return '<table>\n'
        + body
        + '</table>\n';
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return '<blockquote>\n'
        + body
        + '</blockquote>\n';
    }
    case 'list_start': {
      var type = this.token.ordered ? 'ol' : 'ul'
        , body = '';

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return '<'
        + type
        + '>\n'
        + body
        + '</'
        + type
        + '>\n';
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return '<li>'
        + body
        + '</li>\n';
    }
    case 'html': {
      return !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
    }
    case 'paragraph': {
      return '<p>'
        + this.inline.output(this.token.text)
        + '</p>\n';
    }
    case 'text': {
      return '<p>'
        + this.parseText()
        + '</p>\n';
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    if (opt) opt = merge({}, marked.defaults, opt);

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(hi) {
      var out, err;

      if (hi !== true) {
        delete opt.highlight;
      }

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done(true);
    }

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (typeof exports === 'object') {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
var POETRYBOOK = POETRYBOOK || {};

POETRYBOOK.tree = (function () {
  "use strict";

  var documentsLoaded = 0,
    //The loaded markdown document
    markdown = "",
    markdownDocuments,
    poetry;

  //Set the markdown converter options
  marked.setOptions({
    gfm: true,
    breaks: true,
    tables: true
  });

  //A function to capitalize the first letter of a string

  function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Make strings lowercase, remove space and punctuation

  function normalizeText(string) {
    //Remove punctuation
    string = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
    //Remove spaces
    string = string.replace(/\s+/g, '');
    //Make lowercase
    string = string.toLowerCase();
    return string;
  }

  function replaceString(oldS, newS, fullS) {
    return fullS.split(oldS).join(newS);
  }

  function findHTagsInDocument() {
    var headings = [];
    var i;
    for (i = 1; i < 7; i++) {
      var testHeading = document.querySelectorAll("h" + i);
      if (testHeading.length !== 0) {
        testHeading = Array.prototype.slice.call(testHeading);
        headings.push(testHeading);
      } else {
        break;
      }
    }
    return headings;
  }

  function makeHeadingTextClassAndID(headingTags, index) {
    headingTags.forEach(function (headingTag) { 
      //1. Create the heading title, id, and class
      var tagText = headingTag.innerHTML;
      //Find the position of the square brackets  
      var firstBracket = tagText.indexOf("[", 0);
      var secondBracket = tagText.indexOf("]", 0);
      //Get a string that matches the square bracket string
      var squareBrackets = tagText.slice(firstBracket, secondBracket + 1);
      //Slice the square bracket string from the original string
      var newTagText = replaceString(squareBrackets, "", tagText);
      //Remove any double spaces
      newTagText = newTagText.replace(/\s{2,}/g, ' ');
      newTagText = newTagText.trim();
      //Remove the square brackets from the inner string
      var classText = squareBrackets.replace(/[\[\]']+/g, '');
      classText = classText.trim();
      //Assign the new heading text to the heading tag and set its class and id attribtes
      headingTag.innerHTML = newTagText;
      if (classText !== "") {
        headingTag.className = normalizeText(classText);
        //Add a category attribute to the heading
        headingTag.setAttribute("category", classText);
      }
      //Set a hierarchyLevel attribute to the heading. This will be section0 to section6
      //Depending on the level's hierarchy. This to help us create <section> tags with
      //the class names that match that hierarchy. This makes it easy to hide or display
      //levels of content depending on user interaction and navigation.
      headingTag.setAttribute("hierarchyLevel", "section" + index);
    });
  }

  function makeSections(headingTags, index) {
    headingTags.forEach(function (headingTag) { 
      //Create the <section> tag
      //Give it the same id and class name as the heading
      var section = document.createElement("section");
      section.id = normalizeText(headingTag.innerHTML);
      section.setAttribute("state", "unselected");
      if (headingTag.className !== "x") {
        section.className = headingTag.getAttribute("hierarchyLevel");
      } else {
        section.setAttribute("class", "x " + headingTag.getAttribute("hierarchyLevel"));
      }
      //This set of if statements inserts the first section as a child of the body.
      //It inserts following sections as chidren of their parents. If a heading which isn't
      //an <h1> tag happpens to be the first one loaded, it makes sure that it's appended to
      //the first <section> element, not the <body>. (This could happen if multiple documents
      //are loaded out of order, and the first loaded document starts with <h2> or <h3>)
      if (headingTag.tagName !== "H1") {
        //Insert the section just before the current heading tag
        if(headingTag.parentNode !== document.body) {
          headingTag.parentNode.insertBefore(section, headingTag);
        }else {
          var firstSection = document.body.querySelector("section:first-of-type");
          console.log(firstSection);
          firstSection.insertBefore(section, firstSection.firstChild);
        }
      } else { 
        //If this is the first section, insert it as the first child of the body
        document.body.insertBefore(section, document.body.firstChild);
      }
      //Figure out what should be in that section.
      //Make an array to temporarily store the section content
      var sectionContent = [];
      //Push all the sibling nodes into the array until you find
      //a node that matches the current heading.
      //That will be the end of the section
      sectionContent.push(headingTag);
      var sibling = headingTag.nextElementSibling;
      while (sibling && sibling.tagName !== headingTag.tagName) {
        sectionContent.push(sibling);
        sibling = sibling.nextElementSibling;
      }
      //Add the array contents to the <section> tag
      sectionContent.forEach(function (element) {
        section.appendChild(element);
      });
      //console.log(section);
    });
  }

  function buildNavigation(headingTags) {
    //console.log("***");
    //Loop through each heading level and find it
    //<section> tag children. These will be the navigation index items
    headingTags.forEach(function (headingTag) {
      var parent = headingTag.parentNode;
      var sections = parent.children;
      if (sections.length !== 0) {
        sections = Array.prototype.slice.call(sections);
        sections = sections.filter(function (tag) {
          if (tag.tagName === "SECTION") {
            //console.log(headingTag.id + ": " + tag.id);
            return tag;
          }
        });
        //Add a navigation bar to the top of the section, 
        //if it contains more than one sub-heading
        if (sections.length > 1) {
          var nav = document.createElement("nav");
          var categoryClasses = [];
          var categoryStrings = [];
          var spanTags = [];
          var aTags = [];
          parent.insertBefore(nav, parent.firstChild);
          //Find out if there are navigation categories
          //and, if there are, build a categories array
          sections.forEach(function (sectionTag) {
            var headingTag = sectionTag.firstChild;
            //Find out if the heading has a category and add it to 
            //the categories array
            if (headingTag.className !== "") {
              //Only add a new category to the array
              //if it hasn't already been added in a previous iteration of the loop
              if (categoryClasses.indexOf(headingTag.className) === -1) {
                if (headingTag.className !== "x") {
                  categoryClasses.push(headingTag.className);
                  categoryStrings.push(headingTag.getAttribute("category"));
                }
              }
            }
          });
          if (categoryClasses.length > 0) {
            categoryClasses.sort();
            //console.log(categoryClasses);
            //Create <span> tags for each category
            if (categoryClasses.length !== 0) {
              categoryClasses.sort();
              categoryStrings.sort();
              categoryClasses.forEach(function (category, index) {
                var span = document.createElement("span");
                span.setAttribute("category", category);
                span.innerHTML = categoryStrings[index];
                spanTags.push(span);
                nav.appendChild(span);
              });
            }
          }
          //Build the navigation bar items based on the section items
          sections.reverse();
          sections.forEach(function (sectionTag) {
            var headingTag = sectionTag.firstChild;
            //Create an <a> tag for each heading and append it to the <nav> tag
            var aTag = document.createElement("a");
            aTag.innerHTML = headingTag.innerHTML;
            aTag.setAttribute("state", "unselected");
            aTag.href = "#" + sectionTag.id;
            if (headingTag.className !== "") {
              if (headingTag.className !== "x") {
                //aTag.className = headingTag.className;
                aTag.setAttribute("category", headingTag.className);
                //aTag.className = "unselected";
              } else {
                aTag.setAttribute("category", headingTag.className);
                aTag.className = "x";
              }
            }
            aTags.push(aTag);
          });
          aTags.forEach(function (aTag) {
            if (aTag.getAttribute("category") !== null) {
              spanTags.forEach(function (spanTag) {
                if (spanTag.getAttribute("category") === aTag.getAttribute("category")) {
                  //Insert new <a> tag after the catefory <span> tag 
                  spanTag.parentNode.insertBefore(aTag, spanTag.nextSibling);
                }
              });
            } else {
              nav.insertBefore(aTag, nav.firstChild);
            }
          });
          //console.log(spanTags.length);
        }
        //console.log("*");
      }
    });
  }

  function addIdAttributeToImgTags() {
    var imgTags = document.querySelectorAll("img");
    imgTags = Array.prototype.slice.call(imgTags);
    imgTags.forEach(function (imgTag) {
      var altText = imgTag.getAttribute("alt");
      if (altText !== null) {
        altText = normalizeText(altText);
        imgTag.setAttribute("id", altText);
      }
    });
  }

  function makeTableOfContents() {
    //Create a <div id="contents">
    var toc = document.createElement("div");
    toc.id = "toc";
    //Add it as the firt child to the body
    document.body.insertBefore(toc, document.body.firstChild);

    //Thank you!:https://github.com/matthewkastor/html-table-of-contents

    function htmlTableOfContents(documentRef) {
      var toc = documentRef.getElementById('toc');
      var headings = [].slice.call(documentRef.body.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      headings.forEach(function (heading, index) {
        var anchor = documentRef.createElement('a');
        anchor.setAttribute('name', 'toc' + index);
        anchor.setAttribute('id', 'toc' + index);

        var link = documentRef.createElement('a');
        link.setAttribute('href', '#toc' + index);
        link.textContent = heading.textContent;

        var div = documentRef.createElement('div');
        div.setAttribute('class', heading.tagName.toLowerCase());

        div.appendChild(link);
        toc.appendChild(div);
        heading.parentNode.insertBefore(anchor, heading);
      });
    }
    htmlTableOfContents(document);
  }

  function makeHeaderSection() {
    var h1 = document.querySelector("h1");
    var header = document.createElement("header");
    h1.parentNode.insertBefore(header, h1);
    header.appendChild(h1);
  }
  
  function makeTitle() {
    var h1 = document.querySelector("h1");
    var title = document.querySelector("title");
    title.innerHTML = h1.innerHTML;
  }

  function makeHTMLpage() {
    //Copy the loaded markdown into the body
    document.body.innerHTML += markdown;
    //Find all the "h" tags (<h1> to <h6>) in the document and push them into an array
    var headings = findHTagsInDocument();
    //Create the heading text, class and ids
    headings.forEach(makeHeadingTextClassAndID);
    //Add id attributes to any image tags. The id's will match the alt text
    addIdAttributeToImgTags();
    //Make <section> tags that wrap each section of content defined by a heading
    headings.forEach(makeSections);
    //Create <nav> tags for level of headings, if they contain sub-sections
    headings.forEach(buildNavigation);
    //Insert the <h1> tag into a <header> tag 
    //(Do this near the end so that we don't mess up the HTML stucture)
    makeHeaderSection();
    //Add a <title>
    makeTitle();
    //Build the table of contents
    makeTableOfContents();

    //Run the poetry callback function in the poet.js file to tell it that
    //the HTML has been built
    if (poetry !== undefined) {
      poetry();
    }
  }
  
  function loadFile(fileName) {
    var reader = new XMLHttpRequest();
    reader.open("GET", fileName, true);
    reader.addEventListener("readystatechange", function () {
      if (reader.readyState === 4) {
        if (reader.status === 200) {
          //Convert the markdown to HTML text inside the <section id="book"> tag
          markdown += (marked(reader.responseText));
          documentsLoaded += 1;
          //Build the HTML Dom tree if all the markdown documents have been loaded
          if (documentsLoaded === markdownDocuments.length) {
            makeHTMLpage();
          }
        }
      } else {
        //console.log("XHR Error: ", reader.statusText); 
      }
    }, false);
    reader.send(null);
  }

  function makeHTMLFromMarkdown(config) {
    //Load the markdown files
    markdownDocuments = config.files;
    //A callback function to alert poet.js that the HTML has been built
    poetry = config.callback;
    markdownDocuments.forEach(loadFile);
  }

  //Public API
  return {
    makeHTMLFromMarkdown: makeHTMLFromMarkdown
  };

}());/*jslint white: false, indent: 2, browser: true, maxerr: 200, maxlen: 100, plusplus: true, vars: true  */
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
.section0 nav a[state=selected] {
  color: #eee8aa;
}
.section0 nav a[state=unselected] {
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
  
  //Intialize the first sub-sections of each main section to state "selected"
  function initializeSections() {
    sections.forEach(function (section) {
      if (section.parentNode.className !== section.className) {
        var firstSubSection = section.parentNode.querySelector("section:first-of-type");
        if (firstSubSection.getAttribute("state") === "unselected") {
          firstSubSection.setAttribute("state", "selected");
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
      initializeSections();
    } else {
      //If the url hash isn't empty, load the section that matches it.
      //If it's not a section1 class <section>, move up in the hierarchy 
      //until you hit one
      var sectionFound = sections.some(function (section) {
        if (window.location.hash === "#" + section.id) {
          initializeSections();
          selectSection();
          section.scrollIntoView(true);
          return true;
        }
      });
      //If there's still no match, just load the first section
      if (!sectionFound) {
        initializeSections();
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