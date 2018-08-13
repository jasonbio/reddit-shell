# reddit shell

reddit shell is a web based linux shell emulator written in JavaScript that lets you browse and interact with reddit via command line https://redditshell.com/

**Features**

* Browse public subreddits, posts, comments, and users.
* Iterate through comment chains and post indexes.
* Watch subreddits for new posts
* Scope-based tabbed auto-completion of commands, subreddit names, and usernames (double tab for list view)
* Search for posts, comments, and users.
* Login authentication via OAuth 2
* Upvote/downvote posts and comments
* Comment/reply posts and comments
* Display inline images for image posts `# set img on`
* Change limit on number of retrieved posts, comments `# set limit [auto|1-100]`
* Command format exceptions that cover most preferences

**Future TO-DO**

* more logged in user actions
* multireddit views

**Example Commands**

* `# ls` - list posts from the frontpage
* `# ls funny top` - lists posts from /r/funny sorted by top rated
* `# cd ..` - go back to frontpage listings
* `# view comments 3` - views comments for the specified post index
* `# view more comments` - load more comments for current post scope

## Commands 

* **list**
  * Aliases: **ls, cd**
  * Options:
    * **[next|previous]** - can only be used on result set
    * **[subreddit] [new|rising|top|controversial]** - sort applies to subreddits only (not frontpage)
    * **[subreddit] [next|previous]** - can only be used on result set
    * **[..|-|~/]** - common directory nav commands - can only be used with the "cd" alias
 * Description: list posts from the specified subreddit or the front page if no subreddit specified and sorts by optional new, rising, top, controversial. Use the "cd" alias to forwards and backwards with the [..|-|~/] options
* **list subreddits**
  * Aliases: **[ls, cd], subs** 
  * Options:
    * **[next|previous]** - can only be used on result set
  * Description: list all public subreddits available on reddit
* **view content**
  * Options:
    * **[index]** - can only be used on result set
  * Description: opens the permalink of the specified post index in a new window.
* **view comments**
  * Options:
    * **[index] [confidence|top|new|hot|controversial|old|random|qa]** - can only be used on result set
  * Description: loads the comments of the specified post index.
* **view more comments**
  * Options:
    * **[index] [confidence|top|new|hot|controversial|old|random|qa]** - can only be used on result set
  * Description: Loads more comments from the post scope if no index is given and there are posts to load, otherwise loads the specified comment tree for the index given.
* **watch**
  * Options:
    * **[subreddit]**
  * Description: Watches the specified subreddit for new posts
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
* **login**
  * Description: redirects your browser to reddit.com and requests permission for reddit shell to load and use user data
* **upvote**
  * Options:
    * **[index]**
  * Description: Upvotes the specified post or comment index
* **downvote**
  * Options:
    * **[index]**
  * Description: Downvotes the specified post or comment index
* **post comment**
  * Options:
    * **[text]** - can only be used on view comments result set
  * Description: Post a comment to the current post in scope
* **post reply**
  * Options:
    * **[index] [text]** - can only be used on view comments or view more comments result set
  * Description: Post a reply to the specified comment index
* **logout**
  * Description: De-authenticates the currently logged in user 
* **settings**
  * Aliases: **set**
  * Options:
    * **[images] [on|off]**
      * Aliases: **img**
    * **[limit] [auto|1-100]**
  * Description: Changes settings for user preference. Turning images on will show the thumbnail for all image posts. Limit decides how many results to return for posts and comments. "auto" picks the best limit for your screen resolution without having to scroll (unless viewing a nested comment tree)
* **pwd**
  * Description: Prints working directory
* **clear**
  * Description: Clears the screen
* **about**
  * Description: Displays project info and credits
* **help**
  * Aliases: **cat readme**
  * Description: Displays more detailed instructions

**Libraries**

- [jQuery](https://jquery.com/)
- [Showdown](https://github.com/showdownjs/showdown)
- [JQuery Terminal](http://terminal.jcubic.pl/)
- [Moment.js](http://momentjs.com/)
