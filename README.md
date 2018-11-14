# TreeMap
d3.js based, non-recursive data displaying treemap

## Datamodel
The treemap shall display a set of data (TreeMapData) as rectangles

### TreeMapData

The data object shall has:
 - id: to identify the data
 - value: to draw the area corresponding to it
 - name: a text to display
 - color: as background-color
 
## Features
The treemap shall , resize, update and delete the chart

### draw

 - simple draw the d3-treemap according to the given input

### resize
 - if the container of the treemap (dom of selector) changes its size, the chart will also resize

### update
 - if different input is given as update, the chart will redraw itself according to the values

### delete
 - if delete is called, all generated doms will deleted and added event listener will removed