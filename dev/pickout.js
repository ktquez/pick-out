/*
*	Pickout - Cool effect for field select on form
*	Copyright (c) 2016 Ktquez
*	Project repository: https://github.com/ktquez/pickout
* 	MIT license.
*/

var pickout = (function(){

	"use strict";

	console.time('BMPickout');	

	// Own configuration of each field select
	var ownConfig = {};

	// Default values
	var defaults = {
		theme : 'clean',
		search : false,
		noResults : 'No Results',
		multiple : false,
		txtBtnMultiple : 'CONFIRM SELECTED'
	};

	/**
	 * Utilities
	 * Included in version 1.2.0
	 */
	var _ = {
		create : function (tag){
			return document.createElement(tag);
		},
		attr : function(el, attr, value){
			if (!value) {
				return el.getAttribute(attr);
			}

			if (Array.isArray(el)) {
				el.forEach(function(element) {
					element.setAttribute(attr, value);					
				});
				return;
			}

			el.setAttribute(attr, value);
		},
		events : function(el, type, callback) {
			el.addEventListener(type, callback, false);
		},
		toArray : function(el){
			return [].slice.call(el);
		},
		addClass : function(el, selector){
			var self = this;
			var cls = !!self.attr(el, 'class') ? self.attr(el, 'class') : '';
			self.attr(el, 'class',  cls+ ' '+selector);
		},
		rmClass : function(el, selector){
			var self = this;
			if (Array.isArray(el)) {
				el.forEach(function(element) {
					self.attr(element, 'class', self.attr(element, 'class').replace(' '+selector, ''));					
				});
				return;
			}
			self.attr(el, 'class', self.attr(el, 'class').replace(' '+selector, ''));
		},
		$ : function(selector, el) {
			return (el || document).querySelector(selector);
		},
		$$ : function(selector, el) {
			return this.toArray((el || document).querySelectorAll(selector));
		}
	};

	/**
	 * Starts the module preparing the elements
	 * @param config = String or object to setting
	 */
	function init(config){
		setElement(config);
		prepareElement();
	}

	/**
	 * Defines the own configuration and assigns the select
	 * @param {[type]} config = String or object to setting
	 */
	function setElement(config){

		var objConfig = typeof config === 'object' ? config : {};

		if (typeof config === 'string') {
			objConfig.el = config;
		}

		// Retrieve the DOM to be manipulated
		objConfig.DOM = _.$$(objConfig.el);

		mergeToDefaults(objConfig);		
	}


	/**
	 * Prepare the elements that will be handled by the module
	 */
	function prepareElement(){

		ownConfig.DOM.map(function(select, index){
			createElements(select, index);
		});

		prepareModal();
	}

	function createElements(select, index){

		// Cache self config 
		var config = ownConfig,
			isMultiple = false;

		select.style.display = 'none';

		/**
		 * Multiple
		 */
		if (select.hasAttribute('multiple')) {
			isMultiple = true;
			select.name = select.name.indexOf('[]') !== -1 ? select.name : select.name+'[]';
		}

		var parent = select.parentElement;
		_.attr(parent, 'style', 'position:relative;float:left;');
		var placeholder = _.attr(select, 'placeholder');

		// Visual element simule field input
		var field = _.create('div');
		_.addClass(field, 'pk-field -'+ config.theme + (!!isMultiple ? ' -multiple' : ''));
		if(!!placeholder) field.innerHTML = placeholder;

		if(parent.hasAttribute('for')) _.attr(field, 'id', _.attr(parent, 'for'));
		
		parent.appendChild(field);

		// Arrow
		if (!isMultiple) {
			var arrow = _.create('span');
			_.addClass(arrow, 'pk-arrow -'+ config.theme);			
			parent.appendChild(arrow);
		}

		// Event listener
		_.events(parent, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			console.time('BMPickoutFireModal');	

			// Index do select
			config.currentIndex = index;

			// If is multiple
			config.multiple = !!isMultiple ? true : false;

			// Handle modal
			fireModal(config);

			console.timeEnd('BMPickoutFireModal');	

		});

	}

	/**
	 * Create and manage options in modal
	 * @param  {Object} config = ownConfig
	 */
	function fireModal(config){

		var modal = _.$('.pk-modal'),
			select = config.DOM[config.currentIndex],
			main = _.$('.main', modal),
			data;

		// modal theme
		_.addClass(modal, '-'+config.theme);

		// Avoid charging again when changing tab and the field gives focus again
		if (!!main.children.length) {
			return;
		}

		var overlay = _.$('.pk-overlay');
		var options = _.toArray(select);

		var optionsModal = options.map(function(option, key){
			data = {index: key, item: option};
			if (option.parentElement.localName === 'optgroup') {
				data.optGroup = option.parentElement;
			}
			return createOption(data, modal, config);
		});

		// Displaying overlay and modal
		_.addClass(modal, '-show');
		_.addClass(overlay, '-show');

		var title = select.hasAttribute('placeholder') ? _.attr(select, 'placeholder') : 'Select to option';
		_.$('.head', modal).innerHTML = title;
		
		_.rmClass(modal, '-multiple');
		/**
		 * Multiple option
		 */
		if (config.multiple) {
			var boxMultiple = _.$('.pk-multiple', modal);
			_.addClass(boxMultiple, '-show');
			_.addClass(boxMultiple, '-'+config.theme);

			_.addClass(modal, '-multiple');
		}

		/**
		 * Search
		 */
		if(config.search) {
			var search = _.$('.pk-search', modal),
				inputSearch = _.$('input', search);

			inputSearch.value = '';

			// Focus no field search
			setTimeout(function(){
				inputSearch.focus();
			}, 300);

			_.addClass(search, '-show');

			var list = [];

			// Listener
			_.events(inputSearch, 'keyup', function(e) {
				e.preventDefault();
				e.stopPropagation();		

				list = _.$$('li', main);	
				
				removeAllElements(list);				

				// If the search field is empty
				if (!e.target.value) {
					eraseNoResult();
					optionsModal.map(function(option){	
						if (Array.isArray(option)) {
							main.appendChild(option[0]);
							option = option[1];
						}
						main.appendChild(option);
					});
					return;
				}	

				
				// If any character typed
				optionsModal.map(function(option){

					if (Array.isArray(option)) {
						option = option[1];
					}

					// Recover text element
					var txt = option.lastChild;

					// Supress errors in IE
					if (!txt) return;

					// Compares the search with the text option
					if(txt.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
						eraseNoResult();
						main.appendChild(option);						
					}
				});

				// No results
				if (!main.children.length) {
					var noResults = _.create('li');
					_.addClass(noResults, 'pk-no_result_search');
					_.addClass(noResults, '-'+config.theme);
					noResults.innerHTML = config.noResults;

					main.appendChild(noResults);
					return;
				}

				function eraseNoResult(){
					// hide No results
					var noResult = _.$('.pk-no_result_search', main);
					if (noResult) {
						main.removeChild(noResult);
					}
				}

				// Remove all elements
				function removeAllElements(list){
					list.map(function(option){
						if (option.parentNode) {
							main.removeChild(option);
						}
					});
				}
				
			});
		}
		
	}

	/**
	 * Create by options group 
	 * @param  {Object} optGroup
	 * @param  {object} main
	 * @param  {object} config 
	 */
	function createOptGroup(optGroup, main, config) {

		var titleGroup = _.create('li');
		_.addClass(titleGroup, 'pk-option-group -'+config.theme);
		_.attr(titleGroup, 'data-opt-group', optGroup.label);
		_.attr(titleGroup, 'data-type', optGroup.localName);
		titleGroup.innerHTML = optGroup.label.toUpperCase();
		main.appendChild(titleGroup);
		
		return titleGroup;
	}

	/**
	 * Creates options for the chosen select
	 * @param  {Object} data = {index, option}
	 * @param  {object DOM} modal  = Modal that will receive the list
	 * @param  {object} config 
	 */
	function createOption(data, modal, config){

		var select = config.DOM[config.currentIndex],
			main = modal.querySelector('.main'),
			lists = [];

		// Title Option Group
		if (!!data.optGroup) {
			var optCreated = _.$('li[data-opt-group='+data.optGroup.label.replace(/\s/g,'')+']', main);

			// Created if not exists
			if (!optCreated) {
				lists.push(createOptGroup(data.optGroup, main, config));
			}
		}

		var item = _.create('li');
		var selected = data.item.hasAttribute('selected') ? '-selected' : '';
		_.addClass(item, 'pk-option '+ selected +' -'+config.theme);

		// Add circle for assign multiple options
		if (config.multiple) {
			var circle = _.create('span');
			_.addClass(circle, 'pk-circle -' + config.theme);
			item.appendChild(circle);


		}

		// If empty value in option
		if (!data.item.value) {
			_.attr(item, 'style', 'display:none;');
		}

		var icon = _.create('span');
		_.addClass(icon, 'icon');
		icon.innerHTML = _.attr(data.item, 'data-icon') || '';

		var txt = _.create('span');
		_.addClass(txt, 'txt');
		txt.innerHTML = data.item.innerHTML;

		main.appendChild(item);
		item.appendChild(icon);

		// Pay attention to always be the last child
		item.appendChild(txt);

		// feed data with important info	
		data.txt = txt.innerHTML;

		// Event listener
		_.events(item, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			/**
			 * Multiple options selected
			 */
			if (config.multiple) {

				data.field = select.parentElement.querySelector('.pk-field');

				// If selected, deselect
				if (select[data.index].hasAttribute('selected')) {
					select[data.index].removeAttribute('selected');
					_.rmClass(item, '-selected');
					var tag = _.$('.pk-tag[data-select="'+select.name.replace('[]', '')+data.index+'"]');
					data.field.removeChild(tag);

					if (!data.field.children.length) {
						data.field.innerHTML = _.attr(select, 'placeholder');
					}
					return;
				}

				// If not selected
				_.attr(select[data.index], 'selected', 'selected');				

				// Class selected in option modal
				_.addClass(item, '-selected');
				
				setOptionMultiple(select, data, config);
				return;
			}

			/**
			 * Normal selected
			 */
			setOptionSimple(select, data);

		});

		// If it is empty, it indicates that there is no option group 
		if (!lists.length) {
			return item;
		}

		// If option group, returns an array
		lists.push(item);
		return lists;
	}

	/**
	 * Handled by Event for select field with multiple option
	 * @param {HTMLObject} select
	 * @param {Object} data
	 * @param {Object} config
	 */
	function setOptionMultiple(select, data, config){

		// Erase placeholder of the field		
		if (!data.field.children.length) {
			data.field.innerHTML = '';
		}

		// tags
		var tag = _.create('div'),
			txtTag = _.create('span'),
			closeTag = _.create('span');

		_.addClass(tag, 'pk-tag -'+config.theme);
		_.attr(tag, 'data-select', select.name.replace('[]', '')+data.index);

		_.addClass(txtTag, 'txt');
		_.addClass(closeTag, 'close');

		txtTag.innerHTML = data.txt;
		closeTag.innerHTML = '&times;';

		tag.appendChild(txtTag);
		tag.appendChild(closeTag);
		data.field.appendChild(tag);

		var index = data.index;

		// Listener
		_.events(closeTag, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			// Deselect
			select[index].removeAttribute('selected');

			// Remove a tag
			data.field.removeChild(e.target.parentElement);

			if (!data.field.children.length) {
				data.field.innerHTML = _.attr(select, 'placeholder');
			}

		});


		return;		
	}

	/**
	 * Event for select field simple
	 * @param {HTMLObject} select
	 * @param {Object} data
	 */
	function setOptionSimple(select, data, txt){
		_.toArray(select).map(function(option, index){
			if (index === data.index) {
				_.attr(option, 'selected', 'selected');
				return;
			}

			option.removeAttribute('selected');
		});
		
		feedField(select, data.txt);		
		closeModal();
	}

	function feedField(select, value){
		select.parentElement.querySelector('.pk-field').innerHTML = value;
	}

	/**
	 * Sets a value (option) default for field select
	 */
	function setInitialValue(config){
		setElement(config);	

		ownConfig.DOM.forEach(function(select){
			feedField(select, select[select.selectedIndex].innerHTML);
		});
	}

	/**
	 * Sets the values (options) default for field multiple selected
	 */
	function setInitialValueMultiple(config){
		
		var data = {};
		setElement(config);	

		ownConfig.DOM.forEach(function(select){
		data.field = select.parentElement.querySelector('.pk-field');

			_.toArray(select).forEach(function(option, index){

				if (option.hasAttribute('selected')) {
					data.index = index;
					data.txt = option.innerHTML;

					setOptionMultiple(select, data, ownConfig);				 					
				}

			});

		});

	}

	/**
	 * Prepare the divs that will be used for modal with options
	 */
	function prepareModal(){

		// Checks has been created
		if (_.$('.pk-overlay')) {
			return;
		}	

		var overlay = _.create('div');
		_.addClass(overlay, 'pk-overlay');

		var modal = _.create('div');
		_.addClass(modal, 'pk-modal');		

		var mainModal = _.create('ul');
		_.addClass(mainModal, 'main');

		var head = _.create('div');
		_.addClass(head, 'head');

		var search = _.create('div');
		_.addClass(search, 'pk-search');	
		var inputSearch = _.create('input');
		_.attr(inputSearch, 'type', 'text');

		var multiple = _.create('div');
		_.addClass(multiple, 'pk-multiple');

		var btnMultiple = _.create('button');
		_.addClass(btnMultiple, 'pk-btnMultiply');
		btnMultiple.innerHTML = ownConfig.txtBtnMultiple;

		var close = _.create('span');
		_.addClass(close, 'close');
		close.innerHTML = '&times;';

		document.body.appendChild(overlay);
		document.body.appendChild(modal);
		modal.appendChild(head);
		modal.appendChild(search);
		search.appendChild(inputSearch);
		modal.appendChild(close);
		modal.appendChild(mainModal);
		modal.appendChild(multiple);
		multiple.appendChild(btnMultiple);

		// Event listener
		[overlay, close, btnMultiple].forEach(function(element){
			_.events(element, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();

				closeModal();
			});
		});

	}	

	/**
	 * Resume normal classes and removes the content from within the modal
	 * @param  {object DOM} overlay
	 * @param  {object DOM} modal
	 */
	function closeModal(){
		var overlay = _.$('.pk-overlay');
		var modal = _.$('.pk-modal');
		var search = _.$('.pk-search', modal);
		var multiple = _.$('.pk-multiple', modal);

		_.attr(modal, 'class', 'pk-modal');
		_.attr(multiple, 'class', 'pk-multiple');
		_.attr(search, 'class', 'pk-search');
		_.attr(overlay, 'class', 'pk-overlay');

		setTimeout(function(){
			_.$('.main', modal).innerHTML = '';
		}, 500);
	}

	/**
	 * Merges the settings passed by the user with the default settings of the package, adding their own configurations
	 */
	function mergeToDefaults(config){
		
		ownConfig = JSON.parse(JSON.stringify(defaults));

		for (var item in config) {
			if (config.hasOwnProperty(item)) {
				ownConfig[item] = config[item];
			}
		}

	}

	console.timeEnd('BMPickout');	

	// Revealing the methods that shall be public
	return {
		to : init,
		updated : setInitialValue,
		updatedMultiple : setInitialValueMultiple
	};


})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pickout;
}
