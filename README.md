# Untappd Bookmarklets
> View Untappd ratings in your browser.

![preview.png](https://github.com/noahsug/untappd-bookmarklets/blob/master/preview.png?raw=true)


## Installation
1. Build the bookmarklet code
```
git clone git@github.com:noahsug/untappd-bookmarklets.git
cd untappd-bookmarklets
yarn
yarn build
ls bin # build bookmarklets live in bin/
```

2. Create the bookmarklets
   1. Open Bookmark Manager (`option + command + B`)
   1. Options (triple dot in top right) -> Add new bookmark
   1. Enter `scrape` for the name
   1. Copy and paste the contents of `untappd-bookmarklets/bin/scrape.js` into the URL input
   1. Repeat steps 2-4 for [view.js](bin/view.js)

## Usage

#### Add data from Untappd

1. Visit an untappd page of choice (e.g. https://untappd.com/treehousebrewco/beer?sort=highest_rated)
1. Click on the `scrape` bookmarklet to copy rating data to the clipboard
1. In `untappd-bookmarklets/` run, `yarn add-data` (uses pbpaste to paste data from the clipboard)
1. Paste the contents of `bin/view.js` into the view bookmarklet (right-click bookmark -> `Edit...` -> paste code into the URL)


#### View ratings in webpage

1. Visit webpage of choice (e.g. https://treehousebrew.com/shop)
1. Click on the `view` bookmarklet
