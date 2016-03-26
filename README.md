# pickout
Cool effect for field select on form

![alt tag](https://cloud.githubusercontent.com/assets/8084606/14060913/ff3d6438-f350-11e5-9e95-1404418f2523.gif)

## How to use 
### npm
```
npm install pickout --save
```

### bower
```
bower install pickout --save
```

### Inserting HTML
Include the style
```
<link rel="stylesheet" href="./path/to/pickout.min.css">
...
</head>
```

Include the script
```
<script src="./path/to/pickout.min.js"></script>
...
</body>
```

## Example of block the select field
```
<!-- Normal use -->
<label for="label_1">
	<select name="label_1" id="label_1" class="label_1 all" placeholder="Select to option">
		<option value="opt1">Option 1</option>
		<option value="opt2">Option 2</option>
		<option value="opt3">Option 3</option>
		<option value="opt4">Option 4</option>
	</select>		
</label>


<!-- Using with icons -->
<label for="label_2">
	<select name="label_2" id="label_2" class="label_2 all" placeholder="Select to option">
		<option value="opt1" data-icon="&#xe601;" >Option 1</option>
		<option value="opt2" data-icon="&#xe602;">Option 2</option>
		<option value="opt3" data-icon="&#xe603;">Option 3</option>
		<option value="opt4" data-icon="&#xe604;">Option 4</option>
	</select>		
</label>
```

### Attributes
`` data-icon `` : Icon code, for example: "e602", simply use ``data-icon="&#xe602"``;

## Set the select
```
pickout.to('.label_1');
```
Another option
```
pickout.to({
  el: '.label_1'
});
```

**OBS:** Do not forget to declare the characters responsible dial if class use (.) If ID using the (#)

### Set all at once
You can assign to selects separately, however you can apply all at once, simply declare a class in common to all selects and inform the plugin, for example:
```
pickout.to('.all');
```

### Customize styles
To customize, simply add in your CSS rule with this pattern:<br>
```
.pk-input.-MySelector{
	// my customization	
}
.pk-arrow.-MySelector{
	// my customization	
}
```

And the definition of pickout informs the theme
```
pickout.to({
  el: '.label_1',
  theme: 'MySelector'
});
```

#### Themes
- clean (Default) <br>
- dark 
```
pickout.to({
  el: '.label_1',
  theme: 'dark'
});
```

## Select with default values
```
<label for="label">
	<select name="label" id="label" class="label all" placeholder="Select to option">
	  <!-- Option selected by default -->
		<option value="opt1" selected>Option 1</option>
		<option value="opt2">Option 2</option>
	</select>		
</label>
```

It uses the updated function
```
pickout.updated('.label');
```

## Current version stable
**V1.0.1**

## ChangeLog

## Contributing
- Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
- Fork repository, make changes, add your name and link in the authors session readme.md
- Send a pull request

If you want a faster communication, find me on [@ktquez](https://twitter.com/ktquez)

**thank you**












