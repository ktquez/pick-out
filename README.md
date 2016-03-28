# pickout
Cool effect for field select on form

![alt tag](https://cloud.githubusercontent.com/assets/8084606/14072318/97c66458-f495-11e5-9900-9e83734334ff.gif)

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

## Example of block the select field

```html
<!-- Normal use -->
<div class="form-group">
	<label for="city">City:</label>
	<select name="city" id="city" class="city all" placeholder="Select to option">
		<option value="opt1">Option 1</option>
		<option value="opt2">Option 2</option>
		<option value="opt3">Option 3</option>
		<option value="opt4">Option 4</option>
	</select>		
</div>


<!-- Using with icons -->
<div class="form-group">
	<label for="state">State:</label>
	<select name="state" id="state" class="state all" placeholder="Select to option">
		<option value="opt1" data-icon="&#xe601;" >Option 1</option>
		<option value="opt2" data-icon="&#xe602;">Option 2</option>
		<option value="opt3" data-icon="&#xe603;">Option 3</option>
		<option value="opt4" data-icon="&#xe604;">Option 4</option>
	</select>		
</div>
```

### Attributes
`` data-icon `` : Icon code, for example: "e602", simply use ``data-icon="&#xe602"``;

## Set the select

```js
pickout.to('.city');
```

Another option

```js
pickout.to({
  el: '.city'
});
```

**OBS:** Do not forget to declare the characters responsible dial if class use (.) If ID using the (#)

### Search field 
Field to search options within the modal, default is false
```js
pickout.to({
  el: '.state',
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
**theme** - Modify the visual style, customized through CSS<br.
- clean (Default) <br>
- dark 

```js
pickout.to({
  el: '.state',
  theme: 'dark'
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
**v1.1.1**

## ChangeLog
**v1.1.1** 
- Search field

## Contributing
- Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
- Fork repository, make changes, add your name and link in the authors session readme.md
- Send a pull request

If you want a faster communication, find me on [@ktquez](https://twitter.com/ktquez)

**thank you**
