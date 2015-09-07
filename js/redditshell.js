$(function() {
  var posts = [];
  var comments = [];
  var subreddits = [];
  var content = [];
  var user = [];
  var cmd_state = [];
  var cs = 0;
  var next = "";
  var previous = "";
  var sort = "";
  var morelink = "";
  var json_base = "";
  var parent_post = "";
  var pwd = "/";
  var c = 0;
  var r = 0;
  var s = 0;
  var u = 0;
  var anim = false;
  var showimages = false;
  var windowheight = $(window.top).height();
  var limit = "limit="+(Math.round(windowheight / 54)-3)+"&";
  var limitint = "auto (" + (Math.round(windowheight / 54)-3) + ")";
  var autobase = ['help','about','clear','settings','more','comments','content','user','search','view','previous','prev','next','subreddits','list','reddit'];
  var autocomplete = ['help','about','clear','settings','more','comments','content','user','search','view','previous','prev','next','subreddits','list','reddit'];
  function typed(finish_typing) {
    return function(term, message, delay, finish) {
      anim = true;
      var prompt = term.get_prompt();
      var c = 0;
      if (message.length > 0) {
        term.set_prompt('[guest@reddit ~]# ');
        var interval = setInterval(function() {
          term.insert(message[c++]);
          if (c == message.length) {
            clearInterval(interval);
            setTimeout(function() {
              finish_typing(term, message, prompt);
              anim = false
              finish && finish();
            }, delay);
          }
        }, delay);
      }
    };
  }

  var typed_prompt = typed(function(term, message, prompt) {
    term.set_command('');
    term.set_prompt(message + ' ');
  });

  var typed_message = typed(function(term, message, prompt) {
      term.set_command('');
      term.echo(message)
      term.set_prompt(prompt);
  });

  function greetings(term) {
    term.echo("<div style='width:100%;float: left;text-align: left;' id='greeting'><div style=' font-weight: bold;width:100%;white-space:nowrap;float:left;line-height: 7px;font-size: 7px;color: #2FD4CE;padding-left:5px;' id='ascii'>_________<span style='color:transparent;'>__</span>_______<span style='color:transparent;'>___</span>________<span style='color:transparent;'>__</span>________<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>_________<span style='color:transparent;'>________</span>________<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>_______<span style='color:transparent;'>___</span>___<span style='color:transparent;'>_______</span>___<span style='color:transparent;'>__________</span><br /><span style='color:transparent;'><span style='color:#fff;' id='asciitext'>|\\_______\\|\\______\\_|\\_______\\|\\_______\\|\\__\\|\\_________\\</span></span><span style='color:transparent;'>_____</span><span style='color:#fff;' id='asciitext'>|\\_______\\|\\__\\|\\__\\|\\______\\_|\\__\\<span style='color:transparent;'>_____</span>|\\__\\</span><span style='color:transparent;'>_________</span><br /><span style='color:transparent;'><span style='color:#fff;' id='asciitext'>\\_\\__\\|\\__\\_\\_____/|\\_\\__\\_|\\_\\_\\__\\_|\\_\\_\\__\\|____\\__\\_|</span></span><span style='color:transparent;'>_____</span><span style='color:#fff;' id='asciitext'>\\_\\__\\___|\\_\\__\\\\\\__\\_\\_____/|\\_\\__\\<span style='color:transparent;'>____</span>\\_\\__\\</span><span style='color:transparent;'>________</span><br /><span style='color:transparent;'>_</span><span style='color:#fff;' id='asciitext'>\\_\\_______\\_\\__\\_|/_\\_\\__\\_\\\\_\\_\\__\\_\\\\_\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>\\_\\_______\\_\\_______\\_\\__\\_|/_\\_\\__\\<span style='color:transparent'>____</span>\\_\\__\\</span><span style='color:transparent;'>_______</span><br /><span style='color:transparent;'>__<span style='color:#fff;' id='asciitext'>\\_\\__\\\\__\\\\_\\__\\_|\\_\\_\\__\\_\\\\_\\_\\__\\_\\\\_\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>\\|____|\\__\\_\\__\\_\\__\\_\\__\\_|\\_\\_\\__\\____\\_\\__\\</span><span style='color:#fff;' id='asciitext'>_____</span><br /><span style='color:transparent;'>___<span style='color:#fff;' id='asciitext'>\\_\\__\\\\__\\\\_\\_______\\_\\_______\\_\\_______\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'></span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>_____<span style='color:#fff;' id='asciitext'>\\_\\__\\_\\__\\_\\__\\_\\_______\\_\\_______\\_\\_______\\</span></span><br /><span style='color:transparent;'>____<span style='color:#fff;' id='asciitext'>\\|__|\\|__|\\|_______|\\|_______|\\|_______|\\|__|</span></span><span style='color:transparent;'>____</span><span style='color:#fff;' id='asciitext'>\\|__|</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>|\\_________\\|__|\\|__|\\|_______|\\|_______|\\|_______|</span><br /><span style='color:transparent;'>_________________________________________________________________</span><span style='color:#fff;' id='asciitext'>\\|_________|</span><span style='color:transparent;'>_______________________________________</span><br /><span style='color:transparent;'>____________________________________________________________________________________________________________________</span></div><p/>reddit shell: web based shell emulator that allows you to browse<br />reddit programmatically - by <a href='https://twitter.com/jasonbeee' target='_blank'>@jasonbeee</a> - <a href='https://github.com/jasonbio/reddit-shell' target='_blank'>fork this project on GitHub</a><p />shorthand command support: <strong style='color:#fff;'>[ls|cd|subs|prev|set|img]</strong><br />tab completion support for: <strong style='color:#fff;'>subreddits, users, commands</strong><p /><b style='color:#fff;'>list</b> or <b style='color:#fff;'>list [subreddit]</b> to list the latest posts from the front page or specified subreddit<br /> <b style='color:#fff;'>list [subreddit] [new|rising|top|controversial]</b> to list posts from the specified subreddit in the specified order<br /> <b style='color:#fff;'>list [subreddit] [next|previous]</b> or <b style='color:#fff;'>list [next|previous]</b> to navigate through page listings<br /> <b style='color:#fff;'>list subreddits</b> to list all subreddits on reddit<br /><b style='color:#fff;'>list subreddits [next|previous]</b> to navigate through the subreddit list<br /><b style='color:#fff;'>view content [index]</b> to open the content URL in a new window<br /> <b style='color:#fff;'>view comments [index]</b> to view the comments for the post<br /><b style='color:#fff;'>view more comments</b> to load more base comments from the post<br /><b style='color:#fff;'>view more comments [index]</b> to load replies for the selected comment index<br /> <b style='color:#fff;'>search [search term]</b> to search reddit for something specific<br /><b style='color:#fff;'>search [next|previous]</b> to navigate through search results<br /><b style='color:#fff;'>user [username]</b> to get all comments and posts for the specified user<br /><b style='color:#fff;'>user [username] [next|previous]</b> to navigate through the specified users content<br /><b style='color:#fff;'>settings images [on|off]</b> set inline image display on or off<br /><b style='color:#fff;'>settings limit [auto|1-100]</b> set the limit on number of posts/comments to display<br /><b style='color:#fff;'>clear</b> to clear the screen<br /><b style='color:#fff;'>about</b> to display information and credits<br /><b style='color:#fff;'>help</b> to display more detailed instructions<p /></div>", {raw:true});
  }

  function about(term) {
    term.echo("<div style='width:100%;float: left;text-align: left;margin-top: 10px;padding-bottom: 10px;' id='greeting'><div style=' font-weight: bold;width:100%;white-space:nowrap;float:left;line-height: 7px;font-size: 7px;color: #2FD4CE;padding-left:5px;' id='ascii'>_________<span style='color:transparent;'>__</span>_______<span style='color:transparent;'>___</span>________<span style='color:transparent;'>__</span>________<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>_________<span style='color:transparent;'>________</span>________<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>_______<span style='color:transparent;'>___</span>___<span style='color:transparent;'>_______</span>___<span style='color:transparent;'>__________</span><br /><span style='color:transparent;'><span style='color:#fff;' id='asciitext'>|\\_______\\|\\______\\_|\\_______\\|\\_______\\|\\__\\|\\_________\\</span></span><span style='color:transparent;'>_____</span><span style='color:#fff;' id='asciitext'>|\\_______\\|\\__\\|\\__\\|\\______\\_|\\__\\<span style='color:transparent;'>_____</span>|\\__\\</span><span style='color:transparent;'>_________</span><br /><span style='color:transparent;'><span style='color:#fff;' id='asciitext'>\\_\\__\\|\\__\\_\\_____/|\\_\\__\\_|\\_\\_\\__\\_|\\_\\_\\__\\|____\\__\\_|</span></span><span style='color:transparent;'>_____</span><span style='color:#fff;' id='asciitext'>\\_\\__\\___|\\_\\__\\\\\\__\\_\\_____/|\\_\\__\\<span style='color:transparent;'>____</span>\\_\\__\\</span><span style='color:transparent;'>________</span><br /><span style='color:transparent;'>_</span><span style='color:#fff;' id='asciitext'>\\_\\_______\\_\\__\\_|/_\\_\\__\\_\\\\_\\_\\__\\_\\\\_\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>\\_\\_______\\_\\_______\\_\\__\\_|/_\\_\\__\\<span style='color:transparent'>____</span>\\_\\__\\</span><span style='color:transparent;'>_______</span><br /><span style='color:transparent;'>__<span style='color:#fff;' id='asciitext'>\\_\\__\\\\__\\\\_\\__\\_|\\_\\_\\__\\_\\\\_\\_\\__\\_\\\\_\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>\\|____|\\__\\_\\__\\_\\__\\_\\__\\_|\\_\\_\\__\\____\\_\\__\\</span><span style='color:#fff;' id='asciitext'>_____</span><br /><span style='color:transparent;'>___<span style='color:#fff;' id='asciitext'>\\_\\__\\\\__\\\\_\\_______\\_\\_______\\_\\_______\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'></span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>_____<span style='color:#fff;' id='asciitext'>\\_\\__\\_\\__\\_\\__\\_\\_______\\_\\_______\\_\\_______\\</span></span><br /><span style='color:transparent;'>____<span style='color:#fff;' id='asciitext'>\\|__|\\|__|\\|_______|\\|_______|\\|_______|\\|__|</span></span><span style='color:transparent;'>____</span><span style='color:#fff;' id='asciitext'>\\|__|</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>|\\_________\\|__|\\|__|\\|_______|\\|_______|\\|_______|</span><br /><span style='color:transparent;'>_________________________________________________________________</span><span style='color:#fff;' id='asciitext'>\\|_________|</span><span style='color:transparent;'>_______________________________________</span><br /><span style='color:transparent;'>____________________________________________________________________________________________________________________</span></div><p/>reddit shell is a web based linux shell emulator written in JavaScript that lets you browse and interact with reddit via command line<br /><a href='https://redditshell.com'>https://redditshell.com/</a><p />reddit shell is developed and maintained by <a href='http://jasonb.io/' target='_blank'>jason botello</a> and was first published on 9/5/2015<br />You can help contribute to the project on <a href='https://github.com/jasonbio/reddit-shell' target='_blank'>GitHub</a><p />reddit shell makes use of the following jQuery plugins:<br />- <a href='http://terminal.jcubic.pl/' target='_blank'>JQuery Terminal</a><br />- <a href='http://momentjs.com/' target='_blank'>Moment.js</a></div>", {raw:true});
  }

  function readme(term) {
    term.echo('<article class="markdown-body entry-content" itemprop="mainContentOfPage"><h1><a id="user-content-reddit-shell" class="anchor" href="#reddit-shell" aria-hidden="true"><span class="octicon octicon-link"></span></a>reddit shell</h1><p>reddit shell is a web based linux shell emulator written in JavaScript that lets you browse and interact with reddit via command line <a href="https://redditshell.com/">https://redditshell.com/</a></p><p><strong>Features</strong></p><ul><li>Browse public subreddits, posts, comments, and users.</li><li>Iterate through comment chains and post indexes.</li><li>Scope-based tabbed auto-completion of commands, subreddit names, and usernames (double tab for list view)</li><li>Search for posts, comments, and users.</li><li>Display inline images for image posts <code># set img on</code></li><li>Change limit on number of retrieved posts, comments <code># set limit [auto|1-100]</code></li><li>Command format exceptions that cover most preferences</li></ul><p><strong>Future TO-DO</strong></p><ul><li>OAuth for access to commenting/voting</li><li>multireddit views</li></ul><p><strong>Example Commands</strong></p><ul><li><code># ls</code> - list posts from the frontpage</li><li><code># ls funny top</code> - lists posts from /r/funny sorted by top rated</li><li><code># cd ..</code> - go back to frontpage listings</li><li><code># view comments 3</code> - views comments for the specified post index</li><li><code># view more comments</code> - load more comments for current post scope</li></ul><h2><a id="user-content-commands" class="anchor" href="#commands" aria-hidden="true"><span class="octicon octicon-link"></span></a>Commands</h2><ul><li><strong>list</strong><ul><li>Aliases: <strong>ls, cd</strong></li><li>Options:<ul><li><strong>[next|previous]</strong> - can only be used on result set</li><li><strong>[subreddit] [new|rising|top|controversial]</strong> - sort applies to subreddits only (not frontpage)</li><li><strong>[subreddit] [next|previous]</strong> - can only be used on result set</li><li><strong>[..|-|~/]</strong> - common directory nav commands - can only be used with the "cd" alias</li></ul></li><li>Description: list posts from the the specified subreddit or the front page if no subreddit specified and sorts by optional new, rising, top, controversial. Use the "cd" alias to forwards and backwards with the [..|-|~/] options</li></ul></li><li><strong>list subreddits</strong><ul><li>Aliases: <strong>[ls, cd], subs</strong> </li><li>Options:<ul><li><strong>[next|previous]</strong> - can only be used on result set</li></ul></li><li>Description: list all public subreddits available on reddit</li></ul></li><li><strong>view content</strong><ul><li>Options:<ul><li><strong>[index]</strong> - can only be used on result set</li></ul></li><li>Description: opens the permalink of the specified post index in a new window.</li></ul></li><li><strong>view comments</strong><ul><li>Options:<ul><li><strong>[index] [confidence|top|new|hot|controversial|old|random|qa]</strong> - can only be used on result set</li></ul></li><li>Description: loads the comments of the specified post index.</li></ul></li><li><strong>view more comments</strong><ul><li>Options:<ul><li><strong>[index] [confidence|top|new|hot|controversial|old|random|qa]</strong> - can only be used on result set</li></ul></li><li>Description: Loads more comments from the post scope if no index is given and there are posts to load, otherwise loads the specified comment tree for the index given.</li></ul></li><li><strong>search</strong><ul><li>Options:<ul><li><strong>[search term]</strong></li><li><strong>[next|previous]</strong> - can only be used on result set</li></ul></li><li>Description: Searches reddit for the specified search term.</li></ul></li><li><strong>user</strong><ul><li>Options:<ul><li><strong>[username]</strong></li><li><strong>[username] [next|previous]</strong> - can only be used on result set</li></ul></li><li>Description: Loads all public comments and posts the specified user has made</li></ul></li><li><strong>settings</strong><ul><li>Aliases: <strong>set</strong></li><li>Options:<ul><li><strong>[images] [on|off]</strong><ul><li>Aliases: <strong>img</strong></li></ul></li><li><strong>[limit] [auto|1-100]</strong></li></ul></li><li>Description: Changes settings for user preference. Turning images on will show the thumbnail for all image posts. Limit decides how many results to return for posts and comments. "auto" picks the best limit for your screen resolution without having to scroll (unless viewing a nested comment tree)</li></ul></li><li><strong>pwd</strong><ul><li>Description: Prints working directory</li></ul></li><li><strong>clear</strong><ul><li>Description: Clears the screen</li></ul></li><li><strong>about</strong><ul><li>Description: Displays project info and credits</li></ul></li><li><strong>help</strong><ul><li>Aliases: <strong>cat readme</strong></li><li>Description: Displays more detailed instructions</li></ul></li></ul><p><strong>Libraries</strong></p><ul><li><a href="https://jquery.com/">jQuery</a></li><li><a href="http://terminal.jcubic.pl/">JQuery Terminal</a></li><li><a href="http://momentjs.com/">Moment.js</a></li></ul></article>', {raw:true});
  }

  $('body').terminal(function(cmd, term) {
    if (cmd == "cd .." || cmd == "cd -" || cmd == "cd ../") {
      if (cs > 1) {
        cmd = cmd_state[cs-2].join(" ");
        cmd_state.splice(cs-1, 1);
        cs = cs - 2;
      } else {
        cmd_state = [];
        cmd = "ls";
        cs = 0;
      }
    }
    var finish = false;
    var frontpage = "";
    cmd = cmd.trim();
    cmd = cmd.replace(/[\[\]']+/g,'');
    cmd = cmd.replace(/cd (\/?r?\/)?/g,'cd ');
    cmd = cmd.replace('cd ~/','ls');
    cmd = cmd.replace('cd ../','cd');
    cmd = cmd.replace('cd ..','cd');
    cmd = cmd.replace('cd ./','cd');
    cmd = cmd.replace('cd -','cd');
    command = cmd.split(" ");
    if (command[0] != "reddit") {
      command.unshift("reddit");
    }
    if (command[1] == "ls") {
      command[1] = "list";
    }
    if (command[1] == "cd") {
      command[1] = "list";
    }
    if (command[2] == "prev") {
      command[2] = "previous";
    }
    if (command[2] == "subs") {
      command[2] = "subreddits";
    }
    if (command[3] == "prev") {
      command[3] = "previous";
    }
    if (command[1] == "set") {
      command[1] = "settings";
    }
    // LIST FRONTPAGE
    if (command[0] == "reddit" && command[1] == "list" && !command[2]) {
      pwd = "/";
      posts = [];
      comments = [];
      subreddits = [];
      content = [];
      next = "";
      previous = "";
      sort = "";
      morelink = "";
      json_base = "";
      parent_post = "";
      c = 0;
      r = 0;
      s = 0;
      u = 0;
      $.getJSON('https://www.reddit.com/.json?'+limit+'jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/.json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/.json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
        }
        term.set_prompt('[guest@reddit ~]# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST NEXT PAGE
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] == "next" && !command[3]) {
      previous = "";
      autocomplete = autobase;
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/.json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/.json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit ~]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST PREVIOUS PAGE
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] == "previous" && !command[3]) {
      next = "";
      autocomplete = autobase;
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c - 1;
            term.echo(frontpage, {raw:true});
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/.json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/.json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit ~]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST SUBREDDITS
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] == "subreddits" && !command[3]) {
      pwd = "/subreddits";
      autocomplete = autobase;
      subreddits = [];
      next = "";
      previous = "";
      s = 0;
      $.getJSON('https://www.reddit.com/subreddits/.json?'+limit+'jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            display_name = this.data.display_name;
            autocomplete.push(display_name);
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='https://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
            description = this.data.public_description;
            line2 = "<span style='color: #666;'>" + description + "</span><br />";
            subscribers = this.data.subscribers;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            line3 = "<span style='color: #666;'>" + subscribers + " subscribers since starting " + time + "</span><p />";
            frontpage = line1 + line2 + line3 + '</div>';
            s = s + 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit subreddits]# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/subreddits/.json?"+limit+"count="+s+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/subreddits/.json?"+limit+"count="+s+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST SUBREDDITS NEXT
   } else if (command[0] == "reddit" && command[1] == "list" && command[2] == "subreddits" && command[3] == "next") {
    previous = "";
    autocomplete = autobase;
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            display_name = this.data.display_name;
            autocomplete.push(display_name);
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='https://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
            description = this.data.public_description;
            line2 = "<span style='color: #666;'>" + description + "</span><br />";
            subscribers = this.data.subscribers;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            line3 = "<span style='color: #666;'>" + subscribers + " subscribers since starting " + time + "</span><p />";
            frontpage = line1 + line2 + line3 + '</div>';
            s = s + 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit subreddits]# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/subreddits/.json?"+limit+"count="+s+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/subreddits/.json?"+limit+"count="+s+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST SUBREDDITS PREVIOUS
   } else if (command[0] == "reddit" && command[1] == "list" && command[2] == "subreddits" && command[3] == "previous") {
    next = "";
    autocomplete = autobase;
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            display_name = this.data.display_name;
            autocomplete.push(display_name);
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='https://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
            description = this.data.public_description;
            line2 = "<span style='color: #666;'>" + description + "</span><br />";
            subscribers = this.data.subscribers;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            line3 = "<span style='color: #666;'>" + subscribers + " subscribers since starting " + time + "</span><p />";
            frontpage = line1 + line2 + line3 + '</div>';
            s = s - 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit subreddits]# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/subreddits/.json?"+limit+"count="+s+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/subreddits/.json?"+limit+"count="+s+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST SUBREDDIT
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] && command[2] != "next" && command[2] != "previous" && !command[3] || command[0] == "reddit" && command[1] == "list" && command[2] && command[2] != "next" && command[2] != "previous" && command[3] == "new" || command[0] == "reddit" && command[1] == "list" && command[2] && command[2] != "next" && command[2] != "previous" && command[3] == "top" || command[0] == "reddit" && command[1] == "list" && command[2] && command[2] != "next" && command[2] != "previous" && command[3] == "controversial" || command[0] == "reddit" && command[1] == "list" && command[2] && command[2] != "next" && command[2] != "previous" && command[3] == "rising") {
      posts = [];
      comments = [];
      subreddits = [];
      content = [];
      next = "";
      previous = "";
      sort = "";
      morelink = "";
      json_base = "";
      parent_post = "";
      c = 0;
      r = 0;
      s = 0;
      u = 0;
      if (command[3]) {
        sort = command[3]+"/";
      }
      autocomplete = autobase;
      $.getJSON('https://www.reddit.com/r/'+command[2]+'/'+sort+'.json?'+limit+'jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            pwd = "/r/"+subreddit;
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit '+command[2]+']# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/"+sort+".json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/"+sort+".json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(command);
        cs = cs + 1;
      });
    // LIST SUBREDDIT NEXT
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "next") {
      previous = "";
      autocomplete = autobase;
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit '+command[2]+']# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // LIST SUBREDDIT PREVIOUS
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "previous") {
      next = "";
      autocomplete = autobase;
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink+".json?jsonp=?";
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c - 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit '+command[2]+']# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(cmd);
        cs = cs + 1;
      });
    // VIEW THREAD
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "view" && command[2] == "comments" && command[3] !== "more") {
      comments = [];
      r = 0;
      morelink = "";
      autocomplete = autobase;
      if (command[4]) {
        sort = "sort="+command[4]+"&";
      } else {
        sort = "";
      }
      json_base = posts[command[3]];
      $.getJSON(posts[command[3]]+".json?"+limit+sort+"jsonp=?", function(data) {
        var viewpost = data[0].data.children;
        $(viewpost).each(function () {
          if (this.kind == "t3") {
            author = this.data.author;
            autocomplete.push(author);
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            title = this.data.title;
            domain = this.data.domain;
            subreddit = this.data.subreddit;
            pwd = "/r/"+subreddit+"/comments";
            url = this.data.url;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style=' width: 100%;float: left;background-color: rgba(8, 171, 159, 0.14);padding: 10px;padding-bottom: 0px;margin-top: 10px;margin-bottom: 10px;'><a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }
            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            if (this.data.selftext) {
              line1 = line1 + "<span style='color:#fff;padding: 10px;'>" + this.data.selftext + "</span><br />";
            }
            line2 = "<span>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            parent_post = line1 + line2 + line3 + '</div>';
            term.echo(frontpage, {raw:true});
          }
        });
        var viewdata = data[1].data.children;
        $(viewdata).each(function () {
          if (this.kind == "t1") {
            var reply_message = "";
            var reply2_message = "";
            author = this.data.author;
            autocomplete.push(author);
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='width:100%'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
              r = r + 1;
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='width:100%'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              r = r + 1;
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          } 
          else if (this.kind == "more") {
            morecount = this.data.count;
            morename = this.data.name;
            moreparent = this.data.parent_id;
            children = "";
            for (var i = 0, l = this.data.children.length; i < l; i++) {
              children = children + this.data.children[i]+",";
            }
            children = children.replace(/(^,)|(,$)/g, "");
            morelink = "https://www.reddit.com/api/morechildren.json?"+limit+sort+"link_id="+moreparent+"&children="+children+"&id="+morename+"&api_type=json";
            more_line = "<span>[<span style='color: #B3A600;'>"+morecount+" more comments</span>]<p />";
            term.echo(more_line, {raw:true});
          }
        });
        term.set_prompt('[guest@reddit '+subreddit+']# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(command);
        cs = cs + 1;
      });
    // VIEW MORE COMMENTS THREAD
    } else if (morelink != "" && command[0] == "reddit" && command[1] == "view" && command[2] == "comments" && command[3] == "more" && !command[4] || morelink != "" && command[0] == "reddit" && command[1] == "view" && command[2] == "more" && command[3] == "comments" && !command[4]) {
      autocomplete = autobase;
      $.getJSON(morelink, function(data) {
        morelink = "";
        link_id = "";
        morecount = 0;
        var morecomments = data.json.data.things;
        term.echo(parent_post, {raw:true});
        $(morecomments).each(function () {
          if (this.kind == "t1") {
            var reply_message = "";
            var reply2_message = "";
            author = this.data.author;
            autocomplete.push(author);
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
            pwd = "/r/"+subreddit+"/comments";
            ups = this.data.ups;
            id = this.data.id;
            link_id = this.data.link_id;
            link_id = link_id.replace('t3_','');
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='width:100%'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
              r = r + 1;
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='width:100%'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              r = r + 1;
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          }
          else if (this.kind == "more") {
            morecount = this.data.count;
            morename = this.data.name;
            moreparent = this.data.parent_id;
            children = "";
            for (var i = 0, l = this.data.children.length; i < l; i++) {
              children = children + this.data.children[i]+",";
            }
            children = children.replace(/(^,)|(,$)/g, "");
            morelink = "https://www.reddit.com/api/morechildren.json?"+limit+sort+"link_id=t3_"+link_id+"&children="+children+"&id="+morename+"&api_type=json";
            more_line = "<span>[<span style='color: #B3A600;'>"+morecount+" more comments</span>]<p />";
          }
        });
        if (morelink != "") {
          term.echo(more_line, {raw:true});
        }
        term.set_prompt('[guest@reddit '+subreddit+']# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(command);
        cs = cs + 1;
      });
    // VIEW MORE COMMENTS COMMENT
    } else if (comments.index != 0 && command[0] == "reddit" && command[1] == "view" && command[2] == "comments" && command[3] == "more" && command[4] || comments.index != 0 && command[0] == "reddit" && command[1] == "view" && command[2] == "more" && command[3] == "comments" && command[4]) {
      autocomplete = autobase;
      if (command[5]) {
        sort = "sort="+command[5]+"&";
      } else {
        sort = "";
      }
      $.getJSON(comments[command[4]]+"/.json?"+sort+"jsonp=?", function(data) {
        var viewpost = data[0].data.children;
        $(viewpost).each(function () {
          if (this.kind == "t3") {
            author = this.data.author;
            autocomplete.push(author);
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            title = this.data.title;
            domain = this.data.domain;
            subreddit = this.data.subreddit;
            pwd = "/r/"+subreddit+"/comments";
            url = this.data.url;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style=' width: 100%;float: left;background-color: rgba(8, 171, 159, 0.14);padding: 10px;padding-bottom: 0px;margin-top: 10px;margin-bottom: 10px;'><a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }
            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            if (this.data.selftext) {
              line1 = line1 + "<span style='color:#fff;padding: 10px;'>" + this.data.selftext + "</span><br />";
            }
            line2 = "<span>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            term.echo(frontpage, {raw:true});
          }
        });
        var viewdata = data[1].data.children;
        $(viewdata).each(function () {
          if (this.kind == "t1") {
            var reply_message = "";
            var reply2_message = "";
            author = this.data.author;
            autocomplete.push(author);
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='width:100%'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
              r = r + 1;
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='width:100%'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              r = r + 1;
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          }
        });
        term.set_prompt('[guest@reddit '+subreddit+']# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(command);
        cs = cs + 1;
      });
    // VIEW CONTENT
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "view" && command[2] == "content" && command[3]) {
      var content_url = content[command[3]];
      if (content_url) {
        window.open(content_url);
      }
    // SEARCH
    } else if (command[0] == "reddit" && command[1] == "search" && command[2] !== "next" && command[2] !== "previous") {
      autocomplete = autobase;
      posts = [];
      sterm = [];
      sterm = command;
      sterm.splice(0, 2);
      searchterm = sterm.join(' ');
      content = [];
      next = "";
      previous = "";
      c = 0;
      $.getJSON('https://www.reddit.com/search/.json?q='+encodeURIComponent(searchterm)+'&'+limit+'jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            permalink = permalink.replace('?ref=search_posts','');
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            pwd = "/search";
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit search]# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(command);
        cs = cs + 1;
      });
    // SEARCH NEXT
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "search" && command[2] == "next" && !command[3]) {
      previous = "";
      autocomplete = autobase;
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            permalink = permalink.replace('?ref=search_posts','');
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit search]# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // SEARCH PREVIOUS
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "search" && command[2] == "previous" && !command[3]) {
      next = "";
      autocomplete = autobase;
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            permalink = permalink.replace('?ref=search_posts','');
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c - 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit search]# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    // USER OVERVIEW
    } else if (command[0] == "reddit" && command[1] == "user" && command[2] && !command[3]) {
      autocomplete = autobase;
      comments = [];
      posts = [];
      content = [];
      next = "";
      previous = "";
      r = 0;
      c = 0;
      $.getJSON('https://www.reddit.com/user/'+command[2]+'.json?'+limit+'jsonp=?', function(data) {
        pwd = "/user/"+command[2];
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.kind == "t3") {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='margin-top: 2%;width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
          }
          
          else if (this.kind == "t1") {
            var reply_message = "";
            var reply2_message = "";
            author = this.data.author;
            autocomplete.push(author);
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            link_id = this.data.link_id;
            link_id = link_id.replace('t3_','');
            link_id = link_id.replace('t1_','');
            json_base = "https://www.reddit.com/r/"+subreddit+"/comments/"+link_id+"/";
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='margin-top: 2%;float: left;width: 100%;'>[<span style='color: #B1AB19;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
              r = r + 1;
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-top:2%;float: left;width: 100%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-top:2%;float: left;width: 100%;>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='margin-top:2%;float: left;width: 100%;'>[<span style='color: #B1AB19;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              r = r + 1;
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
        }
        term.set_prompt('[guest@reddit '+command[2]+']# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        cmd_state.push(command);
        cs = cs + 1;
      });
    // USER OVERVIEW NEXT
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "user" && command[2] && command[3] == "next") {
      previous = "";
      autocomplete = autobase;
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.kind == "t3") {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='margin-top: 2%;width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c + 1;
            term.echo(frontpage, {raw:true});
          }
          
          else if (this.kind == "t1") {
            var reply_message = "";
            var reply2_message = "";
            author = this.data.author;
            autocomplete.push(author);
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            link_id = this.data.link_id;
            link_id = link_id.replace('t3_','');
            link_id = link_id.replace('t1_','');
            json_base = "https://www.reddit.com/r/"+subreddit+"/comments/"+link_id+"/";
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='margin-top: 2%;float: left;width: 100%;'>[<span style='color: #B1AB19;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
              r = r + 1;
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-top:2%;float: left;width: 100%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-top:2%;float: left;width: 100%;>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='margin-top:2%;float: left;width: 100%;'>[<span style='color: #B1AB19;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              r = r + 1;
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
        }
        term.set_prompt('[guest@reddit '+command[2]+']# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
      // USER OVERVIEW PREVIOUS
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "user" && command[2] && command[3] == "previous") {
      next = "";
      autocomplete = autobase;
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.kind == "t3") {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            if (url) {
              line1 = "<div style='margin-top: 2%;width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            autocomplete.push(author);
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c - 1;
            term.echo(frontpage, {raw:true});
          }
          
          else if (this.kind == "t1") {
            var reply_message = "";
            var reply2_message = "";
            author = this.data.author;
            autocomplete.push(author);
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
            autocomplete.push(subreddit);
            link_id = this.data.link_id;
            link_id = link_id.replace('t3_','');
            link_id = link_id.replace('t1_','');
            json_base = "https://www.reddit.com/r/"+subreddit+"/comments/"+link_id+"/";
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='margin-top: 2%;float: left;width: 100%;'>[<span style='color: #B1AB19;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
              r = r - 1;
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-top:2%;float: left;width: 100%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r - 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-top:2%;float: left;width: 100%;>[<span style='color: #2C9A96;'>" + r + "</span>] " + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    r = r - 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='margin-top:2%;float: left;width: 100%;'>[<span style='color: #B1AB19;'>" + r + "</span>] " + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              comment_url = json_base+id;
              comments.push(comment_url);
              r = r - 1;
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?"+limit+"count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?"+limit+"count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
        }
        term.set_prompt('[guest@reddit '+command[2]+']# ');
        autocomplete = autocomplete.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
      });
    } else if (cmd == "pwd") {
      term.echo(pwd, {raw:true});
    } else if (cmd == "cat README" || cmd == "cat readme" || cmd == "readme" || cmd == "help") {
      readme(term);
    } else if (cmd == "settings images" || cmd == "set img" || cmd == "set images" || cmd == "settings img") {
      if (showimages) {
        term.echo("display images is currently <strong>on</strong>", {raw:true});
      } else {
        term.echo("display images is currently <strong>off</strong>", {raw:true});
      }
    } else if (cmd == "settings images on" || cmd == "set img on") {
      showimages = true;
      term.echo("display images turned <strong>on</strong>", {raw:true});
    } else if (cmd == "settings images off" || cmd == "set img off") {
      showimages = false;
      term.echo("display images turned <strong>off</strong>", {raw:true});
    } else if (cmd == "settings limit" || cmd == "set limit") {
      term.echo("current limit set to: " + limitint, {raw:true});
    } else if (command[1] == "settings" && command[2] == "limit" && command[3]) {
      if (command[3] == "auto") {
        windowheight = $(window.top).height();
        limit = "limit="+(Math.round(windowheight / 54)-3)+"&";
        limitint = "auto (" + (Math.round(windowheight / 54)-3) + ")";
        term.echo("limit set to auto", {raw:true});
      } else if (command[3] <= 100) {
        limit = "limit="+command[3]+"&";
        limitint = command[3];
        term.echo("limit set to "+command[3], {raw:true});
      } else {
        term.echo("limit cannot exceed 100", {raw:true});
      }
    } else if (cmd == "about") {
      about(term);
    } else if (cmd.indexOf("rm -rf") > -1 || (cmd.indexOf(":(){: | :&}")) > -1 || (cmd.indexOf("{:(){ :|: & };:")) > -1 || (cmd.indexOf("command > /dev/sda")) > -1 || (cmd.indexOf("mkfs.ext4 /dev/sda1")) > -1 || (cmd.indexOf("dd if=/dev/random")) > -1 || (cmd.indexOf("mv ~ /dev/null")) > -1 || (cmd.indexOf("wget http")) > -1 || cmd.indexOf("sudo make me a sandwich") > -1) {
      term.echo("<img src='css/newman.gif' /><p />", {raw:true});
    } else {
      term.echo("command not recognized", {raw:true});
    }
  }, {
    name: 'xxx',
    greetings: null,
    completion: function(terminal, command, callback) {
      callback(autocomplete);
    },
    onInit: function(term) {
      if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        term.echo("commands: ls, ls [subreddit] [next|previous], view comments [index], view more comments [index], search, user, settings", {raw:true});
        term.echo("warning: reddit shell may not work on all mobile devices", {raw:true});
        term.set_prompt('[guest@reddit ~]# ');
        $('.clipboard').focus();
      } else {
        greetings(term);
        term.set_prompt('[guest@reddit ~]# ');
        $('.clipboard').focus();
      }
    },
    onBlur: function(term) {
      return false;
    },
    keydown: function(e) {
      if (anim) {
        return false;
      }
    }
  });
});