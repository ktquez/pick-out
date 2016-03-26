/*
*	Pickout - Cool effect for field select on form
*	Copyright (c) 2016 Ktquez
*	Project repository: https://github.com/ktquez/pickout
* 	MIT license.
*/

var pickout = (function(){

	"use strict";

	// Atualiza o select se for passado um valor padrão (option) para o field select
	var updated = false;

	// Configuração própria de cada campo
	var selfConfig = {};

	/**
	 * Valores padrão definidos
	 * @type {Object}
	 */
	var defaults = {
		theme : 'clean'
	};

	/**
	 * Inicia o modulo preparando os elementos
	 * @param config = String ou objeto para configuração  
	 */
	function init(config){

		// Seta o elemento 
		setElement(config);

		// Prepara os elementos
		prepareElement();
	
	}

	/**
	 * Define e atribui o select
	 * @param {[type]} config [description]
	 */
	function setElement(config){

		var objConfig = typeof config === 'object' ? config : {};

		if (typeof config === 'string') {
			objConfig.el = config;
		}

		// Recupera o DOM que será manipulado
		objConfig.DOM = [].slice.call(document.querySelectorAll(objConfig.el));

		// Mescla com o object default do modulo
		mergeToDefaults(objConfig);		
	}


	/**
	 * Prepara os elementos que serão manipulados pelo modulo
	 */
	function prepareElement(){

		// Percorre o array e aplica uma função para cada elemento select
		selfConfig.DOM.map(function(select){
			createElements(select);
		});

		prepareModal();
	}

	/**
	 * Cria os elementos
	 */
	function createElements(select){
		
		select.style.display = 'none';
		var parent = select.parentElement;
		parent.setAttribute('style', 'position:relative;float:left;');
		var placeholder = select.getAttribute('placeholder');

		// input
		var input = document.createElement('input');
		input.setAttribute('readonly', 'readonly');
		input.setAttribute('class', 'pk-input -'+ selfConfig.theme);
		if(!!placeholder) input.setAttribute('placeholder', placeholder);

		if(parent.hasAttribute('for')) input.setAttribute('id', parent.getAttribute('for'));
		
		// Arrow
		var arrow = document.createElement('span');
		arrow.setAttribute('class', 'pk-arrow -'+ selfConfig.theme);

		// Inseri o input e o arrow
		parent.appendChild(input);
		parent.appendChild(arrow);

		// Event listener
		parent.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			fireModal(select);
		});


	}

	/**
	 * Cria e gerencia as opções na modal
	 * @param  {Object DOm} select
	 */
	function fireModal(select){
		var modal = document.querySelector('.pk-modal'),
			data;

		// Evita de carrega outra vez, quando troca de aba e o field dá focus novamente
		var main = modal.querySelector('.main');
		if (!!main.children.length) {
			return;
		}

		var overlay = document.querySelector('.pk-overlay');
		var options = [].slice.call(select);
	
		var optionsModal = options.map(function(option, key){
			data = {index: key, item: option};
			createOption(data, modal, select);
		});

		// Exibindo overlay e modal
		modal.setAttribute('class', modal.getAttribute('class') + ' -show');
		overlay.setAttribute('class', overlay.getAttribute('class') + ' -show');

	}

	/**
	 * Cria as opções para o select escolhido
	 * @param  {Object} data = {index, option}
	 * @param  {object DOM} modal  = Modal que irá receber a lista
	 * @param  {object DOM} select  = Field select que está recebendo a ação
	 */
	function createOption(data, modal, select){

		var title = select.hasAttribute('placeholder') ? select.getAttribute('placeholder') : 'Select to option';

		modal.querySelector('.head').innerHTML = title;
		var main = modal.querySelector('.main');

		var item = document.createElement('li');
		item.setAttribute('class', 'pk-option');

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

			// Converte para array, por se tratar de um (object) HTMLCollection 
			[].slice.call(select.children).map(function(item, index){
				if (index === data.index) {
					item.setAttribute('selected', 'selected');
					return;
				}

				item.removeAttribute('selected');
			});
			
			feedInput(select, txt.innerHTML);		
			closeModal();
		});


	}

	/**
	 * Alimenta o input
	 */
	function feedInput(select, value){
		select.parentElement.querySelector('.pk-input').value = value;
	}

	/**
	 * Define um valor (option) padrão para o field select
	 */
	function setInitialValue(config){
		setElement(config);	

		// Percorre o array e aplica uma função para cada elemento select
		selfConfig.DOM.map(function(select){
			feedInput(select, select[select.selectedIndex].innerHTML);
		});
	}

	/**
	 * Prepara as divs que serão utilizadas para a modal com as opções
	 */
	function prepareModal(){

		// verifica se já foi criado
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

		var close = document.createElement('span');
		close.setAttribute('class', 'close');
		close.innerHTML = '&times;';

		document.body.appendChild(overlay);
		document.body.appendChild(modal);
		modal.appendChild(head);
		modal.appendChild(close);
		modal.appendChild(mainModal);

		// Event listener
		overlay.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			closeModal();
		});

		close.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			closeModal();
		});

	}	

	/**
	 * Retoma as classes normais e remove o conteúdo de dentro da modal
	 * @param  {object DOM} overlay
	 * @param  {object DOM} modal
	 */
	function closeModal(){
		var overlay = document.querySelector('.pk-overlay');
		var modal = document.querySelector('.pk-modal');

		overlay.setAttribute('class', 'pk-overlay');
		modal.setAttribute('class', 'pk-modal');
		setTimeout(function(){
			modal.querySelector('.main').innerHTML = '';
		}, 500);
	}

	/**
	 * Mescla as configurações passadas pelo usuário com as configurações padrão do package
	 * Adicionando suas próprias configurações
	 */
	function mergeToDefaults(config){
		
		selfConfig = JSON.parse(JSON.stringify(defaults));

		for (var item in config) {
			if (config.hasOwnProperty(item)) {
				selfConfig[item] = config[item];
			}
		}

	}

	// Revela os métodos que serão públicos 
	return {
		to : init,
		updated : setInitialValue
	};

})();