/*
*	Pickout - Cool effect for field select on form
*	Copyright (c) 2016 Ktquez
*	Project repository: https://github.com/ktquez/pickout
* 	MIT license.
*/

var pickout = (function(){

	"use strict";

	// Own configuration of each field select
	var ownConfig = {};

	// Default values
	var defaults = {
		theme : 'clean',
		search : false,
		noResults : 'No Results'
	};

	/**
	 * Utilities
	 * Included in version 1.2.0
	 */
	var UTIL = {
		create : function (tag){
			return document.createElement(tag);
		},
		attr : function(el, attr, value){
			if (!value) {
				return el.getAttribute(attr);
			}
			el.setAttribute(attr, value);
		},
		events : function(el, type, callback) {
			el.addEventListener(type, callback, false);
		},
		toArray : function(el){
			return [].slice.call(el);
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
		objConfig.DOM = UTIL.$$(objConfig.el);

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
		var config = ownConfig;
		
		select.style.display = 'none';

		var parent = select.parentElement;
		UTIL.attr(parent, 'style', 'position:relative;float:left;');
		var placeholder = UTIL.attr(select, 'placeholder');

		// input
		var input = UTIL.create('input');
		UTIL.attr(input, 'readonly', 'readonly');
		UTIL.attr(input, 'class', 'pk-input -'+ config.theme);
		if(!!placeholder) UTIL.attr(input, 'placeholder', placeholder);

		if(parent.hasAttribute('for')) UTIL.attr(input, 'id', UTIL.attr(parent, 'for'));
		
		// Arrow
		var arrow = UTIL.create('span');
		UTIL.attr(arrow, 'class', 'pk-arrow -'+ config.theme);

		parent.appendChild(input);
		parent.appendChild(arrow);

		// Event listener
		UTIL.events(parent, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			config.currentIndex = index;
			fireModal(config);
		});

	}

	/**
	 * Create and manage options in modal
	 * @param  {Object} config = ownConfig
	 */
	function fireModal(config){

		var modal = UTIL.$('.pk-modal'),
			select = config.DOM[config.currentIndex],
			data;

		// modal theme
		UTIL.attr(modal, 'class', UTIL.attr(modal, 'class') + ' -' + config.theme);

		// Avoid charging again when changing tab and the field gives focus again
		var main = UTIL.$('.main', modal);
		if (!!main.children.length) {
			return;
		}

		var overlay = UTIL.$('.pk-overlay');
		var options = UTIL.toArray(select);

		var optionsModal = options.map(function(option, key){
			data = {index: key, item: option};
			return createOption(data, modal, config);
		});

		// Displaying overlay and modal
		UTIL.attr(modal, 'class', UTIL.attr(modal, 'class') + ' -show');
		UTIL.attr(overlay, 'class', UTIL.attr(overlay, 'class') + ' -show');

		var title = select.hasAttribute('placeholder') ? UTIL.attr(select, 'placeholder') : 'Select to option';
		UTIL.$('.head', modal).innerHTML = title;

		// If search
		if(config.search) {
			var search = UTIL.$('.pk-search', modal);
			var inputSearch = UTIL.$('input', search);
			inputSearch.value = '';

			// Focus no field search
			setTimeout(function(){
				inputSearch.focus();
			}, 300);

			UTIL.attr(search, 'class', UTIL.attr(search, 'class') + ' -show');

			// Listener
			UTIL.events(inputSearch, 'keyup', function(e) {
				e.preventDefault();
				e.stopPropagation();

				var optionsDefault = optionsModal,
					main = UTIL.$('.main', modal);

				// Specific for IE
				if (!!document.documentMode) {
					optionsDefault.map(function(option){
						option.style.display = 'none';
					});

				}else {
					// Deletes the options
					main.innerHTML = '';
				}


				// If the search field is empty
				if(!e.target.value) {
					optionsDefault.map(function(option){

						// Specific for IE
						if (!!document.documentMode) {
							option.style.display = 'block';
							return;
						}

						main.appendChild(option);
					});
					return;
				}	 

				// If any character typed
				optionsDefault.map(function(option){

					// Suppress console error of IE
					if (!option.children.length) return;

					// Recover text element
					var txt = option.children[1] || option.children[0];

					// Compares the search with the text option
					if(txt.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1) {
						
						// Specific for IE
						if (!!document.documentMode) {
							option.style.display = 'block';
							return;
						}

						main.appendChild(option);						
					}
				});

				// No results
				if (!main.children.length) {
					var noResults = UTIL.create('li');
					UTIL.attr(noResults, 'class', 'pk-no_result_search');
					noResults.innerHTML = config.noResults;

					main.appendChild(noResults);
					return;
				}
				
			});
		}
		
	}

	/**
	 * Creates options for the chosen select
	 * @param  {Object} data = {index, option}
	 * @param  {object DOM} modal  = Modal that will receive the list
	 * @param  {object} config 
	 */
	function createOption(data, modal, config){

		var select = config.DOM[config.currentIndex];		
		var main = modal.querySelector('.main');

		var item = UTIL.create('li');
		var selected = data.item.hasAttribute('selected') ? '-selected' : '';
		UTIL.attr(item, 'class', 'pk-option '+ selected +' -'+config.theme);

		var icon = UTIL.create('span');
		UTIL.attr(icon, 'class', 'icon');
		icon.innerHTML = UTIL.attr(data.item, 'data-icon') || '';

		var txt = UTIL.create('span');
		UTIL.attr(txt, 'class', 'txt');
		txt.innerHTML = data.item.innerHTML;

		main.appendChild(item);
		item.appendChild(icon);
		item.appendChild(txt);

		// Event listener
		UTIL.events(item, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			// Converting to array, because it is a (object) HTMLCollection 
			UTIL.toArray(select.children).map(function(item, index){
				if (index === data.index) {
					UTIL.attr(item, 'selected', 'selected');
					return;
				}

				item.removeAttribute('selected');
			});
			
			feedInput(select, txt.innerHTML);		
			closeModal();
		});

		return item;
	}

	function feedInput(select, value){
		select.parentElement.querySelector('.pk-input').value = value;
	}

	/**
	 * Sets a value (option) default for field select
	 */
	function setInitialValue(config){
		setElement(config);	

		ownConfig.DOM.map(function(select){
			feedInput(select, select[select.selectedIndex].innerHTML);
		});
	}

	/**
	 * Prepare the divs that will be used for modal with options
	 */
	function prepareModal(){

		// Checks has been created
		if (UTIL.$('.pk-overlay')) {
			return;
		}	

		var overlay = UTIL.create('div');
		UTIL.attr(overlay, 'class', 'pk-overlay');

		var modal = UTIL.create('div');
		UTIL.attr(modal, 'class', 'pk-modal');		

		var mainModal = UTIL.create('ul');
		UTIL.attr(mainModal, 'class', 'main');

		var head = UTIL.create('div');
		UTIL.attr(head, 'class', 'head');

		var search = UTIL.create('div');
		UTIL.attr(search, 'class', 'pk-search');	
		var inputSearch = UTIL.create('input');
		UTIL.attr(inputSearch, 'type', 'text');

		var close = UTIL.create('span');
		UTIL.attr(close, 'class', 'close');
		close.innerHTML = '&times;';

		document.body.appendChild(overlay);
		document.body.appendChild(modal);
		modal.appendChild(head);
		modal.appendChild(search);
		search.appendChild(inputSearch);
		modal.appendChild(close);
		modal.appendChild(mainModal);

		// Event listener
		UTIL.events(overlay, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			closeModal();
		});

		UTIL.events(close, 'click', function(e){
			e.preventDefault();
			e.stopPropagation();

			closeModal();
		});

	}	

	/**
	 * Resume normal classes and removes the content from within the modal
	 * @param  {object DOM} overlay
	 * @param  {object DOM} modal
	 */
	function closeModal(){
		var overlay = UTIL.$('.pk-overlay');
		var modal = UTIL.$('.pk-modal');
		var search = UTIL.$('.pk-search', modal);

		UTIL.attr(overlay, 'class', 'pk-overlay');
		UTIL.attr(modal, 'class', 'pk-modal');
		UTIL.attr(search, 'class', 'pk-search');
		setTimeout(function(){
			UTIL.$('.main', modal).innerHTML = '';
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

	// Revealing the methods that shall be public
	return {
		to : init,
		updated : setInitialValue
	};

})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = pickout;
}