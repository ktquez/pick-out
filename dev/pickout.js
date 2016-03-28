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
		search : false
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
		objConfig.DOM = [].slice.call(document.querySelectorAll(objConfig.el));

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
		parent.setAttribute('style', 'position:relative;float:left;');
		var placeholder = select.getAttribute('placeholder');

		// input
		var input = document.createElement('input');
		input.setAttribute('readonly', 'readonly');
		input.setAttribute('class', 'pk-input -'+ config.theme);
		if(!!placeholder) input.setAttribute('placeholder', placeholder);

		if(parent.hasAttribute('for')) input.setAttribute('id', parent.getAttribute('for'));
		
		// Arrow
		var arrow = document.createElement('span');
		arrow.setAttribute('class', 'pk-arrow -'+ config.theme);

		parent.appendChild(input);
		parent.appendChild(arrow);

		// Event listener
		parent.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			config.currentIndex = index;
			fireModal(config);
		}, false);


	}

	/**
	 * Create and manage options in modal
	 * @param  {Object} config = ownConfig
	 */
	function fireModal(config){

		var modal = document.querySelector('.pk-modal'),
			select = config.DOM[config.currentIndex],
			data;

		// modal theme
		modal.setAttribute('class', modal.getAttribute('class')+' -'+config.theme);

		// Avoid charging again when changing tab and the field gives focus again
		var main = modal.querySelector('.main');
		if (!!main.children.length) {
			return;
		}

		var overlay = document.querySelector('.pk-overlay');
		var options = [].slice.call(select);
	
		var optionsModal = options.map(function(option, key){
			data = {index: key, item: option};
			return createOption(data, modal, config);
		});

		// Displaying overlay and modal
		modal.setAttribute('class', modal.getAttribute('class') + ' -show');
		overlay.setAttribute('class', overlay.getAttribute('class') + ' -show');

		var title = select.hasAttribute('placeholder') ? select.getAttribute('placeholder') : 'Select to option';
		modal.querySelector('.head').innerHTML = title;

		// If search
		if(config.search) {
			var search = modal.querySelector('.pk-search');
			var inputSearch = search.querySelector('input');
			inputSearch.value = '';

			// Focus no field search
			setTimeout(function(){
				inputSearch.focus();
			}, 300);

			search.setAttribute('class', search.getAttribute('class') + ' -show');

			// Listener
			inputSearch.addEventListener('keyup', function(e) {
				e.preventDefault();
				e.stopPropagation();

				var optionsDefault = optionsModal,
					main = modal.querySelector('.main');

				// Specific for IE
				if (!!document.documentMode) {
					optionsModal.map(function(option){
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
				optionsModal.map(function(option){
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
					var noResults = document.createElement('li');
					noResults.setAttribute('class', 'pk-no_result_search');
					noResults.innerHTML = 'No Results';

					main.appendChild(noResults);
					return;
				}
				
			}, false);
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

		var item = document.createElement('li');
		var selected = data.item.hasAttribute('selected') ? '-selected' : '';
		item.setAttribute('class', 'pk-option '+ selected +' -'+config.theme);

		var icon = document.createElement('span');
		icon.setAttribute('class', 'icon');
		icon.innerHTML = data.item.getAttribute('data-icon') || '';

		var txt = document.createElement('span');
		txt.setAttribute('class', 'txt');
		txt.innerHTML = data.item.innerHTML;

		main.appendChild(item);
		item.appendChild(icon);
		item.appendChild(txt);

		// Event listener
		item.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			// Converting to array, because it is a (object) HTMLCollection 
			[].slice.call(select.children).map(function(item, index){
				if (index === data.index) {
					item.setAttribute('selected', 'selected');
					return;
				}

				item.removeAttribute('selected');
			});
			
			feedInput(select, txt.innerHTML);		
			closeModal();
		}, false);

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
		if (document.querySelector('.pk-overlay')) {
			return;
		}	

		var overlay = document.createElement('div');
		overlay.setAttribute('class', 'pk-overlay');

		var modal = document.createElement('div');
		modal.setAttribute('class', 'pk-modal');		

		var mainModal = document.createElement('ul');
		mainModal.setAttribute('class', 'main');

		var head = document.createElement('div');
		head.setAttribute('class', 'head');

		var search = document.createElement('div');
		search.setAttribute('class', 'pk-search');	
		var inputSearch = document.createElement('input');
		inputSearch.setAttribute('type', 'text');

		var close = document.createElement('span');
		close.setAttribute('class', 'close');
		close.innerHTML = '&times;';

		document.body.appendChild(overlay);
		document.body.appendChild(modal);
		modal.appendChild(head);
		modal.appendChild(search);
		search.appendChild(inputSearch);
		modal.appendChild(close);
		modal.appendChild(mainModal);

		// Event listener
		overlay.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			closeModal();
		}, false);

		close.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			closeModal();
		}, false);

	}	

	/**
	 * Resume normal classes and removes the content from within the modal
	 * @param  {object DOM} overlay
	 * @param  {object DOM} modal
	 */
	function closeModal(){
		var overlay = document.querySelector('.pk-overlay');
		var modal = document.querySelector('.pk-modal');
		var search = modal.querySelector('.pk-search');

		overlay.setAttribute('class', 'pk-overlay');
		modal.setAttribute('class', 'pk-modal');
		search.setAttribute('class', 'pk-search');
		setTimeout(function(){
			modal.querySelector('.main').innerHTML = '';
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