$(function() {
  var authcode = false;
  var posts = [];
  var comments = [];
  var subreddits = [];
  var content = [];
  var next = "";
  var previous = "";
  var sort = "";
  var c = 0;
  var r = 0;
  var s = 0;
  var u = 0;
  var anim = false;
  var showimages = false;
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
    term.echo("<div style='width:100%;float: left;text-align: left;' id='greeting'><div style=' font-weight: bold;width:100%;white-space:nowrap;float:left;line-height: 7px;font-size: 7px;color: #2FD4CE;padding-left:5px;' id='ascii'>_________<span style='color:transparent;'>__</span>_______<span style='color:transparent;'>___</span>________<span style='color:transparent;'>__</span>________<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>_________<span style='color:transparent;'>________</span>________<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>___<span style='color:transparent;'>__</span>_______<span style='color:transparent;'>___</span>___<span style='color:transparent;'>_______</span>___<span style='color:transparent;'>__________</span><br /><span style='color:transparent;'><span style='color:#fff;' id='asciitext'>|\\_______\\|\\______\\_|\\_______\\|\\_______\\|\\__\\|\\_________\\</span></span><span style='color:transparent;'>_____</span><span style='color:#fff;' id='asciitext'>|\\_______\\|\\__\\|\\__\\|\\______\\_|\\__\\<span style='color:transparent;'>_____</span>|\\__\\</span><span style='color:transparent;'>_________</span><br /><span style='color:transparent;'><span style='color:#fff;' id='asciitext'>\\_\\__\\|\\__\\_\\_____/|\\_\\__\\_|\\_\\_\\__\\_|\\_\\_\\__\\|____\\__\\_|</span></span><span style='color:transparent;'>_____</span><span style='color:#fff;' id='asciitext'>\\_\\__\\___|\\_\\__\\\\\\__\\_\\_____/|\\_\\__\\<span style='color:transparent;'>____</span>\\_\\__\\</span><span style='color:transparent;'>________</span><br /><span style='color:transparent;'>_</span><span style='color:#fff;' id='asciitext'>\\_\\_______\\_\\__\\_|/_\\_\\__\\_\\\\_\\_\\__\\_\\\\_\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>\\_\\_______\\_\\_______\\_\\__\\_|/_\\_\\__\\<span style='color:transparent'>____</span>\\_\\__\\</span><span style='color:transparent;'>_______</span><br /><span style='color:transparent;'>__<span style='color:#fff;' id='asciitext'>\\_\\__\\\\__\\\\_\\__\\_|\\_\\_\\__\\_\\\\_\\_\\__\\_\\\\_\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>\\|____|\\__\\_\\__\\_\\__\\_\\__\\_|\\_\\_\\__\\____\\_\\__\\</span><span style='color:#fff;' id='asciitext'>_____</span><br /><span style='color:transparent;'>___<span style='color:#fff;' id='asciitext'>\\_\\__\\\\__\\\\_\\_______\\_\\_______\\_\\_______\\_\\__\\</span></span><span style='color:transparent;'>___</span><span style='color:#fff;' id='asciitext'>\\_\\__\\</span><span style='color:transparent;'></span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>_____<span style='color:#fff;' id='asciitext'>\\_\\__\\_\\__\\_\\__\\_\\_______\\_\\_______\\_\\_______\\</span></span><br /><span style='color:transparent;'>____<span style='color:#fff;' id='asciitext'>\\|__|\\|__|\\|_______|\\|_______|\\|_______|\\|__|</span></span><span style='color:transparent;'>____</span><span style='color:#fff;' id='asciitext'>\\|__|</span><span style='color:transparent;'>_______</span><span style='color:#fff;' id='asciitext'>|\\_________\\|__|\\|__|\\|_______|\\|_______|\\|_______|</span><br /><span style='color:transparent;'>_________________________________________________________________</span><span style='color:#fff;' id='asciitext'>\\|_________|</span><span style='color:transparent;'>_______________________________________</span><br /><span style='color:transparent;'>____________________________________________________________________________________________________________________</span></div><p/>reddit shell: web based shell emulator that allows you to browse<br />reddit programmatically - by <a href='https://twitter.com/jasonbeee' target='_blank'>@jasonbeee</a> - <a href='https://github.com/jasonbio/reddit-shell' target='_blank'>fork this project on github</a><p /> <b style='color:#fff;'>list</b> or <b style='color:#fff;'>list [subreddit]</b> to list the latest posts from the front page or specified subreddit<br /> <b style='color:#fff;'>list [subreddit] [new|rising|top|controversial]</b> to list posts from the specified subreddit in the specified order<br /> <b style='color:#fff;'>list [subreddit] [next|previous]</b> or <b style='color:#fff;'>list [next|previous]</b> to navigate through page listings<br /> <b style='color:#fff;'>list subreddits</b> to list all subreddits on reddit<br /><b style='color:#fff;'>list subreddits [next|previous]</b> to navigate through the subreddit list<br /><b style='color:#fff;'>view content [index]</b> to open the content URL in a new window<br /> <b style='color:#fff;'>view comments [index]</b> to view the comments for the post<br /> <b style='color:#fff;'>view comments more [index]</b> to view more comments in the selected indexes tree<br /> <b style='color:#fff;'>search [search term]</b> to search reddit for something specific<br /><b style='color:#fff;'>search [next|previous]</b> to navigate through search results<br /><b style='color:#fff;'>user [username]</b> to get all comments and posts for the specified user<br /><b style='color:#fff;'>user [username] [next|previous]</b> to navigate through the specified users content<br /><b style='color:#fff;'>settings images [on|off]</b> set inline image display on or off<br /><b style='color:#fff;'>clear</b> to clear the screen<br /> <b style='color:#fff;'>help</b> to display these instructions again<p /></div>", {raw:true});
  }

  $('body').terminal(function(cmd, term) {
    var finish = false;
    term.set_prompt('[guest@reddit ~]# ');
    var frontpage = "";
    cmd = cmd.trim();
    cmd = cmd.replace(/[\[\]']+/g,'');
    command = cmd.split(" ");
    if (command[0] != "reddit") {
      command.unshift("reddit");
    }
    // LIST FRONTPAGE
    if (cmd == "reddit list" || cmd == "list") {
      posts = [];
      comments = [];
      subreddits = [];
      content = [];
      next = "";
      previous = "";
      sort = "";
      c = 0;
      r = 0;
      s = 0;
      u = 0;
      $.getJSON('https://www.reddit.com/.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/.json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/.json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit ~]# ');
        }
      });
    // LIST NEXT PAGE
    } else if (cmd == "reddit list next" || cmd == "list next") {
      previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/.json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/.json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit ~]# ');
        }
      });
    // LIST PREVIOUS PAGE
    } else if (cmd == "reddit list previous" || cmd == "list previous") {
      next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span style='color: #666;'>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            c = c - 1;
            term.echo(frontpage, {raw:true});
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/.json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/.json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit ~]# ');
        }
      });
    // LIST SUBREDDITS
    } else if (cmd == "reddit list subreddits" || cmd == "list subreddits") {
      subreddits = [];
      next = "";
      previous = "";
      s = 0;
      $.getJSON('https://www.reddit.com/subreddits/.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            // line 1
            display_name = this.data.display_name;
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='https://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
            // line 2
            description = this.data.public_description;
            line2 = "<span style='color: #666;'>" + description + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/subreddits/.json?count="+s+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/subreddits/.json?count="+s+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
      });
    // LIST SUBREDDITS NEXT
   } else if (cmd == "reddit list subreddits next" || cmd == "list subreddits next") {
    previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            // line 1
            display_name = this.data.display_name;
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='https://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
            // line 2
            description = this.data.public_description;
            line2 = "<span style='color: #666;'>" + description + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/subreddits/.json?count="+s+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/subreddits/.json?count="+s+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
      });
    // LIST SUBREDDITS PREVIOUS
   } else if (cmd == "reddit list subreddits previous" || cmd == "list subreddits previous") {
    next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            // line 1
            display_name = this.data.display_name;
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='https://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
            // line 2
            description = this.data.public_description;
            line2 = "<span style='color: #666;'>" + description + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/subreddits/.json?count="+s+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/subreddits/.json?count="+s+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit subreddits]# ');
        }
      });
    // LIST SUBREDDIT
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] && !command[3] || command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "new" || command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "top" || command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "controversial" || command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "rising") {
      posts = [];
      content = [];
      next = "";
      previous = "";
      sort = "";
      c = 0;
      if (command[3]) {
        sort = command[3]+"/";
      }
      $.getJSON('https://www.reddit.com/r/'+command[2]+'/'+sort+'.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/r/"+command[2]+"/"+sort+".json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/"+sort+".json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
      });
    // LIST SUBREDDIT NEXT
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "next") {
      previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
      });
    // LIST SUBREDDIT PREVIOUS
    } else if (command[0] == "reddit" && command[1] == "list" && command[2] && command[3] == "previous") {
      next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink+".json?jsonp=?";
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
            ups = this.data.ups;
            num_comments = this.data.num_comments;
            line3 = "<span>" + ups + " upvotes with " + num_comments + " comments</span><p/>";
            frontpage = line1 + line2 + line3 + '</div>';
            c = c - 1;
            term.echo(frontpage, {raw:true});
            term.set_prompt('[guest@reddit '+command[2]+']# ');
          }
        });
        var after = data.data.after;
        var before = data.data.before;
        if (before != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span style='margin-left:64px;'>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/r/"+command[2]+"/.json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span style='margin-left:64px;'>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
      });
    // VIEW THREAD
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "view" && command[2] == "comments" && command[3] !== "more") {
      comments = [];
      r = 0;
      var json_base = posts[command[3]];
      $.getJSON(posts[command[3]]+".json?jsonp=?", function(data) {
        var viewpost = data[0].data.children;
        $(viewpost).each(function () {
          if (this.kind == "t3") {
            author = this.data.author;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            title = this.data.title;
            domain = this.data.domain;
            subreddit = this.data.subreddit;
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
            // line 3
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
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='margin-top: 2%;''>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
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
              line1 = "<div style='margin-top: 2%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
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
        term.set_prompt('[guest@reddit comments]# ');
      });
    // VIEW MORE COMMENTS THREAD
    } else if (command[0] == "reddit" && command[1] == "view" && command[2] == "comments" && command[3] == "more" && command[4]) {
      var json_base = comments[command[4]];
      $.getJSON(comments[command[4]]+"/.json?jsonp=?", function(data) {
        var viewpost = data[0].data.children;
        $(viewpost).each(function () {
          if (this.kind == "t3") {
            author = this.data.author;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            title = this.data.title;
            domain = this.data.domain;
            subreddit = this.data.subreddit;
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
            // line 3
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
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            ups = this.data.ups;
            id = this.data.id;
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='margin-top: 2%;''>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
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
              line1 = "<div style='margin-top: 2%;'>[<span style='color: #2C9A96;'>" + r + "</span>] " + body + "<br />";
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
        term.set_prompt('[guest@reddit comments]# ');
      });
    // VIEW CONTENT
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "view" && command[2] == "content" && command[3]) {
      var content_url = content[command[3]];
      if (content_url) {
        window.open(content_url);
      }
    // SEARCH
    } else if (command[0] == "reddit" && command[1] == "search" && command[2] !== "next" && command[2] !== "previous") {
      posts = [];
      sterm = [];
      sterm = command;
      sterm.splice(0, 2);
      searchterm = sterm.join(' ');
      content = [];
      next = "";
      previous = "";
      c = 0;
      $.getJSON('https://www.reddit.com/search/.json?q='+encodeURIComponent(searchterm)+'&jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            permalink = permalink.replace('?ref=search_posts','');
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
      });
    // SEARCH NEXT
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "search" && command[2] == "next" && !command[3]) {
      previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            permalink = permalink.replace('?ref=search_posts','');
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
      });
    // SEARCH PREVIOUS
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "search" && command[2] == "previous" && !command[3]) {
      next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "https://reddit.com"+this.data.permalink;
            permalink = permalink.replace('?ref=search_posts','');
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
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
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
        if (after != null) {
          permalink = "https://www.reddit.com/search/.json?q="+encodeURIComponent(searchterm)+"&count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit search]# ');
        }
      });
    // USER OVERVIEW
    } else if (command[0] == "reddit" && command[1] == "user" && command[2] && !command[3]) {
      comments = [];
      posts = [];
      content = [];
      next = "";
      previous = "";
      r = 0;
      c = 0;
      $.getJSON('https://www.reddit.com/user/'+command[2]+'.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.kind == "t3") {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style='margin-top: 2%;width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
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
          permalink = "https://www.reddit.com/user/"+command[2]+".json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          console.log(previous);
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          console.log(next);
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
      });
    // USER OVERVIEW NEXT
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "user" && command[2] && command[3] == "next") {
      previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.kind == "t3") {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style='margin-top: 2%;width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
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
          permalink = "https://www.reddit.com/user/"+command[2]+".json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
      });
      // USER OVERVIEW PREVIOUS
    } else if (posts.length !== 0 && command[0] == "reddit" && command[1] == "user" && command[2] && command[3] == "previous") {
      next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.kind == "t3") {
            permalink = "https://reddit.com"+this.data.permalink;
            url = this.data.url;
            content.push(url);
            posts.push(permalink);
            // line 1
            title = this.data.title;
            domain = this.data.domain;
            if (this.data.thumbnail && this.data.thumbnail.indexOf("http") > -1) {
              image = this.data.thumbnail;
            } else {
              image = false;
            }
            subreddit = this.data.subreddit;
            if (url) {
              line1 = "<div style='margin-top: 2%;width:100%;float:left;'>[<span style='color: #2C9A96;'>" + c + "</span>] <a href='"+url+"' target='_blank'>"+title + "</a> (" + domain + ")<br />";
            } else {
              line1 = title + " (" + domain + ")<br />";
            }

            if (image && showimages) {
              line1 = line1 + "<img src='" + image + "' style='float: left;margin: 10px;' /><br />";
            }
            // line 2
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            author = this.data.author;
            line2 = "<span style='color: #666;'>submitted " + time + " by " + author + " to /r/" + subreddit + "</span><br />";
            // line 3
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
            body = this.data.body;
            created = this.data.created_utc;
            time = moment.unix(created).fromNow();
            subreddit = this.data.subreddit;
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
          permalink = "https://www.reddit.com/user/"+command[2]+".json?count="+c+"&before="+before+"&jsonp=?";
          previous = permalink;
          previous_line = "<span>[<span style='color: #B3A600;'>previous</span>]<p />";
          term.echo(previous_line, {raw:true});
        }
        if (after != null) {
          permalink = "https://www.reddit.com/user/"+command[2]+".json?count="+c+"&after="+after+"&jsonp=?";
          next = permalink;
          next_line = "<span>[<span style='color: #B3A600;'>next</span>]<p />";
          term.echo(next_line, {raw:true});
          term.set_prompt('[guest@reddit '+command[2]+']# ');
        }
      });
    } else if (cmd == "settings images on") {
      showimages = true;
      term.echo("display images <strong>on</strong>", {raw:true});
    } else if (cmd == "settings images off") {
      showimages = false;
      term.echo("display images <strong>off</strong>", {raw:true});
    } else if (cmd == "help") {
      greetings(term);
    } else if (cmd.indexOf("rm -rf") > -1 || (cmd.indexOf(":(){: | :&}")) > -1 || (cmd.indexOf("command > /dev/sda")) > -1 || (cmd.indexOf("mkfs.ext4 /dev/sda1")) > -1 || (cmd.indexOf("dd if=/dev/random")) > -1 || (cmd.indexOf("mv ~ /dev/null")) > -1 || (cmd.indexOf("wget http")) > -1 || cmd.indexOf("sudo make me a sandwich") > -1) {
      term.echo("<img src='css/newman.gif' /><p />", {raw:true});
    } else {
      term.echo("command not recognized", {raw:true});
    }
  }, {
    name: 'xxx',
    greetings: null,
    completion: ['help','clear','settings','comments','content','user','search','view','previous','next','subreddits','list','reddit'],
    onInit: function(term) {
      if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        term.echo("reddit shell doesn't work on mobile devices!", {raw:true});
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