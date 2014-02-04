#ASCII Art for Brackets
A [Brackets](http://brackets.io/) extension for using ASCII art for cool lettering, [using patorjk's `figlet.js`](https://github.com/patorjk/figlet.js). All the good stuff is his; all the dumb mistakes are mine. There probably are some, since this is my first time using node.js for anything. Feel free to file bugs and/or feature requests and I'll see what I can do.  

##Why?

     _    _ _                         _  ___  
    | |  | | |                       | ||__ \ 
    | |  | | |__  _   _   _ __   ___ | |_  ) |
    | |/\| | '_ \| | | | | '_ \ / _ \| __|/ / 
    \  /\  / | | | |_| | | | | | (_) | |_|_|  
     \/  \/|_| |_|\__, | |_| |_|\___/ \__(_)  
                   __/ |                      
                  |___/                       


##Mixes well
with the [wd-minimap extension](https://github.com/websiteduck/brackets-wdminimap) so you can use this [one weird (John Carmack approved) trick](http://klogk.com/posts/use-ascii-art-in-sublime-text/) for faster code navigation. 

##Install
Through the Brackets extension manager. If you want to do it manually, clone or download the repo, `cd node_modules`, then `npm install`. That will grab `figlet.js`, and also its dependencies which we don't actually need. 

##Usage
Edit -> Convert to ASCII Art. I think it should be self explanatory from there. 

##Missing features
- Kerning options
- A 'quick use' shortcut for using the same font without opening the panel

##Release log
- 0.0.4 : Multi line selections get replaced properly; if text is highlighted when the panel is opened it will be centred in the editor. (04/02/2014)
- 0.0.3 : Fix for items repeating each time the panel was opened. (03/02/2014)
- 0.0.2 : Nicer layout thanks to @larz0 (also 19/01/2014)
- 0.0.1 : Initial release (19/01/2014)

##License
MIT
