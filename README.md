# pickout
Cool effect for field select on form

![alt tag](https://cloud.githubusercontent.com/assets/8084606/14335558/8d69893c-fc32-11e5-9b5f-0ece1a6e5fec.gif)

## How to use 
### npm

```shell
npm install pickout --save
```

### bower

```shell
bower install pickout --save
```

### Inserting HTML
Include the style

```html
<link rel="stylesheet" href="./path/to/pickout.min.css">
...
</head>
```

Include the script

```html
<script src="./path/to/pickout.min.js"></script>
...
</body>
```

### Or Using CDN
Taking advantage that cdn provides, you can use the [pickout in cdnjs](https://cdnjs.com/libraries/pickout) to include the files in your page:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pickout/1.2.1/pickout.min.css">
...
</head>
```

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pickout/1.2.1/pickout.min.js"></script>
...
</body>
```

## Example of block the select field

```html
<!-- Normal use -->
<div class="form-group">
    <label for="option">Option:</label>
    <select name="option" id="option" class="option all" placeholder="Select a option">
        <option value=""></option> <!-- If the check is not required, submit a default value empty -->
        <option value="opt1">Option 1</option>
        <option value="opt2">Option 2</option>
        <option value="opt3">Option 3</option>
        <option value="opt4">Option 4</option>
    </select>       
</div>


<!-- Using with icons -->
<div class="form-group">
    <label for="suit">Suit:</label>
    <select name="suit" id="suit" class="suit all" placeholder="Select a suit">
        <option value=""></option> <!-- If the check is not required, submit a default value empty -->
        <option data-icon="&spades;" value="Spade">Spade</option>
        <option data-icon="&clubs;" value="Club">Club</option>
        <option data-icon="&hearts;" value="Heart">Heart</option>
        <option data-icon="&diams;" value="Diamond">Diamond</option>
    </select>       
</div>
```

### Attributes
`` data-icon `` : Icon code, for example: "e602", simply use ``data-icon="&#xe602"``;

## Field selection with option group
```html
<!-- Option group -->
<div class="form-group">
    <label for="country">Country</label>
    <select name="country" id="country" class="country all" placeholder="Select a Country">
        <option value=""></option> <!-- If the check is not required, submit a default value empty -->
        <optgroup label="America">
            <option value="EUA">EUA</option>
            <option value="Brazil" selected="selected">Brazil</option>
            <option value="Canada">Canada</option>                      
        </optgroup>
        <optgroup label="Europe">
            <option value="Ireland">Ireland</option>
            <option value="Spanish">Spanish</option>
            <option value="Italy">Italy</option>
            <option value="Portugal">Portugal</option>                      
        </optgroup>
    </select>           
</div>
```

## Set the select

```js
pickout.to('.country');
```

Another option

```js
pickout.to({
  el: '.country'
});
```

**OBS:** Do not forget to declare the characters responsible dial if class use (.) If ID using the (#)

### Search field 
Field to search options within the modal, default is false
```js
pickout.to({
  el: '.country',
  search: true
});
```

### Set all at once
You can assign to selects separately, however you can apply all at once, simply declare a class in common to all selects and inform the plugin, for example:

```js
pickout.to('.all');
```

### Customize styles
To customize, simply add in your CSS rule with this pattern:<br>

```css
.pk-input.-MySelector{
    // my customization 
}
.pk-arrow.-MySelector{
    // my customization 
}
```

And the definition of pickout informs the theme

```js
pickout.to({
  el: '.city',
  theme: 'MySelector'
});
```

#### Themes
**theme** - Modify the visual style, customized through CSS.
- clean (Default)

OBS: You can check or contribute more topics customizam the pickout completely.
[Theme styles](https://github.com/ktquez/pickout/tree/master/dist/themes)

```js
pickout.to({
  el: '.state',
  theme: 'dark' // For dark theme, available in dir style themes
});
```

## Select with default values

```html
<div class="form-group">
    <label for="state">State:</label>
    <select name="state" id="state" class="state all" placeholder="Select to option">
      <!-- Option selected by default -->
        <option value="opt1" selected>Option 1</option>
        <option value="opt2">Option 2</option>
    </select>       
</div>
```

It uses the updated function

```js
pickout.updated('.city');
```

## Current version stable
**v1.2.1**

## Browser Support

| <img src="https://cdn0.iconfinder.com/data/icons/jfk/512/chrome-512.png" width="50px" height="50px" alt="Chrome logo"> | <img src="https://cdn1.iconfinder.com/data/icons/appicns/513/appicns_Firefox.png" width="50px" height="50px" alt="Firefox logo"> | <img src="http://icons.iconarchive.com/icons/cornmanthe3rd/plex/512/Internet-ie-icon.png" width="50px" height="50px" alt="Internet Explorer logo"> | <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Opera_browser_logo_2013_vector.svg/512px-Opera_browser_logo_2013_vector.svg.png" width="50px" height="50px" alt="Opera logo"> | <img src="http://icons.iconarchive.com/icons/osullivanluke/orb-os-x/512/Safari-icon.png" width="50px" height="50px" alt="Safari logo"> |
|:---:|:---:|:---:|:---:|:---:|
| Yes ✔ | Yes ✔ | 9+ ✔ | Yes ✔ |  8+ ✔ |


## ChangeLog
**v1.3.0**
- Multiple options (In progress)

**v1.2.1**
- New Style theme 
- Correction in modal css

**v1.2.0**
- Support to option group
- Optimizing for support to IE
- Separation of style themes css files

**v1.1.3** 
- Search field

## Contributing
- Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
- Fork repository, make changes, add your name and link in the authors session readme.md
- Send a pull request

If you want a faster communication, find me on [@ktquez](https://twitter.com/ktquez)

**thank you**
