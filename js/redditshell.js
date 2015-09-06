$(function() {
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
    term.echo('>reddit shell: web based linux shell emulator for browsing reddit<br />' + 
      'v0.4 by <a href="https://twitter.com/jasonbeee" target="_blank">@jasonbeee</a> - <a href="https://github.com/jasonbio/reddit-shell" target="_blank">fork this project on github</a><p />' + 
      '"<b style="color:#fff;">reddit list</b>" or "<b style="color:#fff;">reddit list [subreddit]</b>" to list the latest posts from the front page or specified subreddit<br />' + 
      '"<b style="color:#fff;">reddit list [subreddit] [new|rising|top|controversial]</b>" to list posts from the specified subreddit in the specified order<br />' + 
      '"<b style="color:#fff;">reddit list [subreddit] [next|previous]</b>" or "<b style="color:#fff;">reddit list [next|previous]</b>" to navigate through page listings<br />' + 
      '"<b style="color:#fff;">reddit list subreddits</b>" to list all subreddits on reddit<br />' +
      '"<b style="color:#fff;">reddit list subreddits [next|previous]</b>" to navigate through the subreddit list<br />' +
      '"<b style="color:#fff;">reddit view content [index]</b>" to open the content URL in a new window<br />' + 
      '"<b style="color:#fff;">reddit view comments [index]</b>" to view the comments for the post<br />' + 
      '"<b style="color:#fff;">reddit view comments more [index]</b>" to view more comments in a chain<br />' + 
      '"<b style="color:#fff;">reddit search [search term]</b>" to search reddit for something specific<br />' +
      '"<b style="color:#fff;">reddit search [next|previous]</b>" to navigate through search results<br />' +
      '"<b style="color:#fff;">settings images [on|off]</b>" set inline image display on or off<br />' +
      '"<b style="color:#fff;">clear</b>" to clear the screen<br />' + 
      '"<b style="color:#fff;">help</b>" to display these instructions again<p />', {raw:true});
  }

  $('body').terminal(function(cmd, term) {
    var finish = false;
    term.set_prompt('[guest@reddit ~]# ');
    var frontpage = "";
    cmd = cmd.trim();
    cmd = cmd.replace(/[\[\]']+/g,'');
    command = cmd.split(" ");
    // LIST FRONTPAGE
    if (cmd == "reddit list") {
      posts = [];
      content = [];
      next = "";
      previous = "";
      c = 0;
      $.getJSON('http://www.reddit.com/.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "http://reddit.com"+this.data.permalink;
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
    } else if (cmd == "reddit list next") {
      previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "http://reddit.com"+this.data.permalink;
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
    } else if (cmd == "reddit list previous") {
      next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "http://reddit.com"+this.data.permalink;
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
    } else if (cmd == "reddit list subreddits") {
      subreddits = [];
      next = "";
      previous = "";
      s = 0;
      $.getJSON('http://www.reddit.com/subreddits/.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            // line 1
            display_name = this.data.display_name;
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='http://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
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
   } else if (cmd == "reddit list subreddits next") {
    previous = "";
      $.getJSON(next, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            // line 1
            display_name = this.data.display_name;
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='http://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
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
   } else if (cmd == "reddit list subreddits previous") {
    next = "";
      $.getJSON(previous, function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            url = this.data.url;
            // line 1
            display_name = this.data.display_name;
            title = this.data.title;
            line1 = "<div style='width:100%;float:left;'>[<span style='color: #2C9A96;'>" + s + "</span>] <a href='http://reddit.com" + url + "' target='_blank'>/r/" + display_name + " - " + title + "</a><br />";
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
      $.getJSON('http://www.reddit.com/r/'+command[2]+'/'+sort+'.json?jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "http://reddit.com"+this.data.permalink;
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
            permalink = "http://reddit.com"+this.data.permalink;
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
            permalink = "http://reddit.com"+this.data.permalink+".json?jsonp=?";
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
            if (this.data.replies != "") {
              nested_count = this.data.replies.data.children.length;
              line1 = "<div style='margin-top: 2%;''>" + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              for (var i = 0, l = this.data.replies.data.children.length; i < l; i++) {
                if (this.data.replies.data.children[i].kind == "t1") {
                  nested_author = this.data.replies.data.children[i].data.author;
                  nested_body = this.data.replies.data.children[i].data.body;
                  nested_created = this.data.replies.data.children[i].data.created_utc;
                  nested_time = moment.unix(nested_created).fromNow();
                  nested_ups = this.data.replies.data.children[i].data.ups;
                  if (this.data.replies.data.children[i].data.replies != "") {
                    nested_count = this.data.replies.data.children[i].data.replies.data.children.length;
                    nest_line1 = "<div style='margin-left:5%;'>" + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  } else {
                    nested_count = 0;
                    nest_line1 = "<div style='margin-left:5%;'>" + nested_body + "<br />";
                    nest_line2 = "<span style='color: #666;'>posted " + nested_time + " by " + nested_author + "</span><br/>";
                    nest_line3 = "<span style='color: #666;'>" + nested_ups + " upvotes with " + nested_count + " replies</span><p/>";
                    reply_message = line1 + line2 + line3;
                    reply_message += nest_line1 + nest_line2 + nest_line3;
                    term.echo(reply_message, {raw:true});
                  }
                }
                        
                if (this.data.replies.data.children[i].kind == "more") {
                  nested_count = this.data.replies.data.children[i].data.count;
                  nested_id = this.data.replies.data.children[i].data.id;
                  if (nested_id) {
                    nested_url = json_base+nested_id;
                    comments.push(nested_url);
                    comments_line = "<span style='margin-left:5%;'>[<span style='color: #2C9A96;'>" + r + "</span>] view more comments ...<p />";
                    r = r + 1;
                    reply_message = nest_line1 + nest_line2 + nest_line3;
                    reply_message += comments_line;
                    term.echo(reply_message, {raw:true});
                  }
                }
              }
            } else {
              nested_count = 0;
              line1 = "<div style='margin-top: 2%;'>" + body + "<br />";
              line2 = "<span style='color: #666;'>posted " + time + " by " + author + "</span><br/>";
              line3 = "<span style='color: #666;'>" + ups + " upvotes with " + nested_count + " replies</span><p />";
              reply_message = line1 + line2 + line3;
              term.echo(reply_message, {raw:true});
            }
          }
          if (this.kind == "more") {
            nested_count = this.data.count;
            nested_id = this.data.id;
            if (nested_id) {
              nested_url = json_base+nested_id;
              comments.push(nested_url);
              comments_line = "<span>[<span style='color: #2C9A96;'>" + r + "</span>] view more comments ...<p />";
              r = r + 1;
              reply_message = comments_line;
              term.echo(reply_message, {raw:true});
            }
          }
        });
        term.set_prompt('[guest@reddit comments]# ');
      });
    // VIEW MORE COMMENTS THREAD
    } else if (command[0] == "reddit" && command[1] == "view" && command[2] == "comments" && command[3] == "more" && command[4]) {
      var json_base = comments[command[4]];
      $.getJSON(comments[command[4]]+"/.json?jsonp=?", function foo(result) {
        $.each(result[1].data.children, function (i, reply) {
          var reply_message = "";
          var reply2_message = "";
          author = reply.data.author;
          body = reply.data.body;
          created = reply.data.created_utc;
          time = moment.unix(created).fromNow();
          ups = reply.data.ups;
          line1 = body + "<br />";
          line2 = "<span style='margin-left:32px;color: #666;'>posted " + time + " by " + author + " with " + ups + " upvotes</span><p/>";
          reply_message += line1 + line2;
          if (reply.data.replies != "") {
            console.log(reply.data.replies);
            $.each(reply.data.replies.data.children, function (z, reply2) {
              console.log(reply2);
              if (reply2.kind == "more") {
                nested_id = reply2.data.id;
                comments.push(json_base+nested_id);
                nest_line1 = "<span style='margin-left:64px;'>[<span style='color: #2C9A96;'>" + r + "</span>] view more comments ...<p />";
                reply_message += nest_line1;
              } else {
                nested_author = reply2.data.author;
                nested_body = reply2.data.body;
                nested_created = reply2.data.created_utc;
                nested_time = moment.unix(nested_created).fromNow();
                nested_ups = reply2.data.ups;
                nest_line1 = "<span style='margin-left:64px;'>" + nested_body + "<br />";
                nest_line2 = "<span style='margin-left:98px;color: #666;'>posted " + nested_time + " by " + nested_author + " with " + nested_ups + " upvotes</span><p/>";
                reply_message += nest_line1 + nest_line2;
              }
            });
            
          }
          r = r + 1;
          term.echo(reply_message, {raw:true});
          term.set_prompt('[guest@reddit comments]# ');
        });
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
      $.getJSON('http://www.reddit.com/search/.json?q='+encodeURIComponent(searchterm)+'&jsonp=?', function(data) {
        var redditjson = data.data.children;
        $(redditjson).each(function() {
          if (this.data != undefined) {
            permalink = "http://reddit.com"+this.data.permalink;
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
            permalink = "http://reddit.com"+this.data.permalink;
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
            permalink = "http://reddit.com"+this.data.permalink;
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
    } else if (cmd == "settings images on") {
      showimages = true;
      term.echo("display images <strong>on</strong>", {raw:true});
    } else if (cmd == "settings images off") {
      showimages = false;
      term.echo("display images <strong>off</strong>", {raw:true});
    } else if (cmd == "help") {
      greetings(term);
    } else if (cmd.indexOf("rm -rf") > -1 || (cmd.indexOf(":(){: | :&}")) > -1 || (cmd.indexOf("command > /dev/sda")) > -1 || (cmd.indexOf("mkfs.ext4 /dev/sda1")) > -1 || (cmd.indexOf("dd if=/dev/random")) > -1 || (cmd.indexOf("mv ~ /dev/null")) > -1 || (cmd.indexOf("wget http")) > -1 || cmd.indexOf("sudo make me a sandwich") > -1) {
      posts = [];
      comments = [];
      next = "";
      previous = "";
      c = 0;
      r = 0;
      term.echo("<img src='css/newman.gif' /><p />", {raw:true});
    } else {
      posts = [];
      comments = [];
      next = "";
      previous = "";
      c = 0;
      r = 0;
      term.echo("command not recognized", {raw:true});
    }
  }, {
    name: 'xxx',
    greetings: null,
    completion: ['help','clear','settings','comments','content','search','view','previous','next', 'subreddits', 'list','reddit'],
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
$(document).click(function() {
  $('.clipboard').focus();
});