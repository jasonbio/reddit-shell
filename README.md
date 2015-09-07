# reddit shell

reddit shell is a web based linux shell emulator written in JavaScript that lets you browse and interact with reddit via command line https://redditshell.com/

**Features**

* Browse public subreddits, posts, comments, and users.
* Iterate through comment chains and post indexes.
* Scope-based tabbed auto-completion of commands, subreddit names, and usernames
* Search for posts, comments, and users.
* Display inline images for image posts `# set img on`
* Change limit on number of retrieved posts, comments `# set limit [auto|1-100]`

**Future TO-DO**

* OAuth for access to commenting/voting
* multireddit views

**Example Commands**

* `# ls` - list posts from the frontpage
* `# list funny top` - lists posts from /r/funny sorted by top rated
* `# view comments 3` - views comments for the specified post index 
* `# settings images on` - turns inline image display on

## Commands 

* **list**
  * Aliases: **ls, cd, pwd**
  * Options:
    * **[next|previous]** - can only be used on result set
    * **[subreddit] [new|rising|top|controversial]** - sort applies to subreddits only (not frontpage)
    * **[subreddit] [next|previous]** - can only be used on result set
 * Description: list posts from the the specified subreddit or the front page if no subreddit specified and sorts by optional new, rising, top, controversial.
* **list subreddits**
  * Aliases: **[ls, cd, pwd], subs** 
  * Options:
    * **[next|previous]** - can only be used on result set
  * Description: list all public subreddits available on reddit
* **view content**
  * Options:
    * **[index]** - can only be used on result set
  * Description: opens the permalink of the specified post index in a new window.
* **view comments**
  * Options:
    * **[index]** - can only be used on result set
  * Description: loads the comments of the specified post index.
* **view more comments**
  * Options:
    * **[index]** - can only be used on result set
  * Description: Loads more comments from the post scope if no index is given and there are posts to load, otherwise loads the specified comment tree for the index given.
* **search**
  * Options:
    * **[search term]**
    * **[next|previous]** - can only be used on result set
  * Description: Searches reddit for the specified search term.
* **user**
  * Options:
    * **[username]**
    * **[username] [next|previous]** - can only be used on result set
  * Description: Loads all public comments and posts the specified user has made
* **settings**
  * Aliases: **set**
  * Options:
    * **[images] [on|off]**
      * Aliases: **img**
    * **[limit] [auto|1-100]**
  * Description: Changes settings for user preference. Turning images on will show the thumbnail for all image posts. Limit decides how many results to return for posts and comments. "auto" picks the best limit for your screen resolution without having to scroll (unless viewing a nested comment tree)
* **clear**
  * Description: Clears the screen
* **about**
  * Description: Displays project info and credits
* **help**
  * Description: Displays instructions

**Libraries**

- [jQuery](https://jquery.com/)
- [JQuery Terminal](http://terminal.jcubic.pl/)
- [Moment.js](http://momentjs.com/)