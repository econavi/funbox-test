/*
	************************************************************************
	
	Условия:
	
	Каждая из упаковок может быть выбрана. 
	Выбор осуществляется нажатием на упаковку или на текст «купи» в описании.

	Можно выбрать одновременно несколько упаковок, а также отменить свой
	выбор повторным нажатием на упаковку.
	
	Состояние наведения применяется к выбранной упаковке не сразу, а после
	того, как курсор ушел с нее после первоначального выбора.

	************************************************************************
	
	Минимально необходимая HTML-разметка для работы скрипта:

	<div class='js-product-list'>
		<div class='product js-product'>
			
			<label class='js-product-card'>
				<input type='checkbox' class='js-product-checkbox'>
				<div class='product__content'>
					Контент
				</div>
			</label>

			<button class='js-product-btn'> 
				Купить
			</button>

		</div>
	</div>

	************************************************************************
*/

// debug, если true - выводит в консоль сообщения на каждом этапе обработки кода
let debug = true;

// объект для проверка мобильных устройств
let isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

// css-селекторы dom-элементов
let classProductList = 'js-product-list';
let classProduct = 'js-product';
let classProductIsActivation = 'product_is-activation';
let classProductIsDeactivation = 'product_is-deactivation';
let classUsingTouchScreen = 'product_using-touch-screen';
let classProductCard = 'js-product-card';
let classButtonToBuy = 'js-product-btn';
let classCheckbox = 'js-product-checkbox';

// css-селекторы целевых элементов
let targetClasses = [classProductCard, classButtonToBuy];

// каталог всех элементов
let productList = document.querySelector('.' + classProductList);

// проверяем использование мобильного устройства
let touchScreenUsed = false;
if(isMobile.any()) {
	cl('Используется мобильное устройство')
	touchScreenUsed = true;
} 


// устанавливаем обработчик

// на клик
productList.addEventListener('click', handler);

// на клавишу "пробел"
let keyboardIsUsed = false;
productList.addEventListener('keydown', function(e) {
	if(e.keyCode == 32) {
		keyboardIsUsed = true;
		handler(e);
	}
	
});


// обработчик
function handler(event) {
	event.preventDefault();
	let target = event.target;

	// убедимся, что клик был в цепочке с целевым элементом и получим его
	cl('Проверяем целевой клик');
	let targetClickElement = (function() {
		let result = false;
		for(let i = 0; i < targetClasses.length; i++) {
			let el = getElementByClassName(target, this, targetClasses[i]);
			if(el){
				result = el;
				break;
			}
		}
		return result
	})();

	// если клик был не целевым, ничего не делаем, выходим из обработчика
	if(!targetClickElement) { 
		cl('Клик не целевой. Действий не требуется');
		return
	} else {
		cl('Есть целевой клик по:\n', targetClickElement);
	}

	// если клик целевой 
	// получаем product по которому был клик
	cl('Получаем productItem');
	let product = getElementByClassName(targetClickElement, this, classProduct);
	cl('productItem получен:\n', product);

	// если используется touch устройство, добавим класс на product
	if(touchScreenUsed) { product.classList.add(classUsingTouchScreen) }

	// получаем checkbox текущего product
	let checkbox;
	cl('Получаем Чекбокс.');
	
	// выберем всех потомков product
	let childrenOfProduct = product.querySelectorAll('*');
	
	// ищем checkbox среди потомков
	for(let i = 0; i < childrenOfProduct.length; i++) {
		if(childrenOfProduct[i].type == 'checkbox') {
			checkbox = childrenOfProduct[i];
			cl('Чекбокс найден и получен.');
			break;
		} 
	}

	// если checkbox не найден, выдаем ошибку в консоль и выходим из обработчика
	if(!checkbox) {console.log('Ошибка!!! Чекбокс не найден. В HTML-разметке должен быть чекбокс.'); return}

	// если checkbox disabled, ничего не делаем, выходим из обработчика
	if(checkbox.disabled) {cl('Чекбокс Disabled — действий не требуется.'); return}
	
	// если checkbox найден
	// меняем состояние checkbox
	cl('Проверка состояние Чекбокса.');
	
	// если checkbox не отмечен
	if(!checkbox.checked) {
		cl('Чекбокс не отмечен.');
		cl('Отмечаем');
		// отмечаем checkbox
		checkbox.checked = true;
		cl('Чекбокс отмечен');

		/* 
			Условие тестового задания: Состояние наведения применяется к выбранной упаковке несразу,
			а после того, как курсор ушел с нее после первоначального выбора.
			
			Решение: добавлять класс activation после клика мышью, по товарной карточке
			и удалять его после того курсор мыши покинет её.

			Тоже самое сделаем и для отмены выбора упаковки - добавим класс deactivation и удалим его, 
			когда курсор покинет товарную карточку
		*/
			
		// если клик был по самой карточке и использовалась мышь
		if(targetClickElement.classList.contains(classProductCard) && !keyboardIsUsed && !touchScreenUsed) {

			// добавляем класс activation
			product.classList.add(classProductIsActivation);
			
			// устанавливаем обработчик на курсор
			targetClickElement.addEventListener('mouseleave', hundlerMouseLeaveFromProductCard);
			
			function hundlerMouseLeaveFromProductCard() {
				// как только курсор уйдёт с товарной крточки 
				// удалим класс activation
				product.classList.remove(classProductIsActivation);

				// удалим обработчик
				targetClickElement.removeEventListener('mouseleave', hundlerMouseLeaveFromProductCard);
			}
		
		}
		cl('Обработка завершена');
	} 
	
	// если при клике checkbox был отмечен, а сам клик был по карточке товара
	else if(targetClickElement.classList.contains(classProductCard)) {
		cl('Чекбокс отмечен');
		// снимаем отметку с checkbox
		cl('Снимаем отметку с Чекбокс');
		checkbox.checked = false;
		cl('Сняли отметку\nОбработка завершена');

		// если клик был сделан мышью
		if(!keyboardIsUsed && !touchScreenUsed) {
			
			// добавляем класс deactivation
			product.classList.add(classProductIsDeactivation);
			
			// устанавливаем обработчик на курсор
			targetClickElement.addEventListener('mouseleave', hundlerMouseLeaveFromProductCard);
			
			function hundlerMouseLeaveFromProductCard() {
				// как только курсор уйдёт с товарной крточки 
				// удалим класс deactivation
				product.classList.remove(classProductIsDeactivation);

				// удалим обработчик
				targetClickElement.removeEventListener('mouseleave', hundlerMouseLeaveFromProductCard);
			}
		}

	}
	else {
		cl('Внимание!!! Снять отметку Чекбокса можно только кликнув по карточке товара.');
		return
	}

}


// Функция ищет и возвращает элемент с нужным классом, поднимаясь вверх по родительским элементам
function getElementByClassName(from, to, className) {
	let elem;
	outer: while(from != to) {
		// проверяем, есть ли нужный класс у элемента
		for(let i = 0; i < from.classList.length; i++) {
			if(from.classList[i] == null) {continue}
			if(from.classList[i] == className) {
				elem = from;
				break outer;
			}
		}
		// если класс не найден, переходим к следующему родительскому элементу и повторяем проверку
		from = from.parentElement;
	}
	return (elem) ? elem : false 
}

// Функция выводит переданные данные в консоль, если включен debag
function cl() {
	if(debug) {
		for(let i = 0; i < arguments.length; i++) {
			console.log(arguments[i]);
		}
	}
}
