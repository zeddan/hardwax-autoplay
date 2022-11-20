![logo](https://raw.githubusercontent.com/zeddan/hardwax-autoplay/main/icons/hardwax-autoplay-32.png)

### _Deprecation note: This feature is now implemented on the official website._ ###

# hardwax-autoplay

A Firefox addon for autoplaying previews at https://hardwax.com

## Installing

1. Clone the repository and place it somewhere nice
2. Open Firefox and type `about:debugging` in the address bar
3. Select "This Firefox" in the menu and click "Load Temporary Add-on"
4. Locate the folder that was placed somewhere nice and select `manifest.json`

You will now see a small grey icon with a play symbol in your toolbar, ready to use.

## How to use

First, go to http://hardwax.com and select a page that you want to autoplay. Then, open the menu and you will see four flow controls:

![menu](https://raw.githubusercontent.com/zeddan/hardwax-autoplay/main/screenshots/menu.png)

### Run

Starts autoplaying. This will continue until all the previews on the page have been played unless no other action from the menu is taken.
When the script is running, you can select any preview and the autoplay will continue from that position.

### Stop

Interrupts the autoplay and resets all values. This means that the autoplay will start from the first preview on the page the next time `Run` is triggered.

### Pause

Pauses the autoplay and prepares for resuming at the position where it was paused.

### Resume

Resumes the autoplay from the position where it was paused, and continues until all the previews on the page have been played unless no other action from the menu is taken.

## Contributing

Feel free to submit a PR with improvements, large or small. The state of the project is currently "something i put together on a friday evening", so there is plenty of room for enhancement.

## License

Use it any way you find meaningful or altruistic.
