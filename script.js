// Строгий режим: запрещает неявные глобальные переменные и другие опасные конструкции
"use strict";

// Ждём, пока браузер полностью построит DOM (все элементы страницы),
// и только потом запускаем код внутри функции
document.addEventListener("DOMContentLoaded", function () {
    // Находим элементы страницы по их id в HTML
    var form = document.getElementById("order-form");        // форма калькулятора
    var productSelect = document.getElementById("product");  // выпадающий список товаров
    var quantityInput = document.getElementById("quantity"); // поле ввода количества
    var errorMessage = document.getElementById("error-message"); // абзац для сообщения об ошибке
    var result = document.getElementById("result");          // абзац для вывода стоимости

    // Подписываемся на отправку формы (срабатывает и по кнопке submit, и по Enter в поле)
    form.addEventListener("submit", function (event) {
        // Берём текст из поля и убираем пробелы по краям
        var quantityText = quantityInput.value.trim();
        // Регулярное выражение: первая цифра 1-9 (чтобы не было нуля и "007"),
        // дальше любое количество цифр 0-9; ^ и $ означают "вся строка целиком"
        var quantityPattern = /^[1-9][0-9]*$/;
        // Переменные, которые заполним позже (объявлены заранее по стилю JSLint)
        var quantity;       // количество как число
        var selectedOption; // выбранный пункт списка
        var price;          // цена выбранного товара
        var total;          // итоговая стоимость

        // Отменяем стандартную отправку формы, чтобы страница не перезагружалась
        event.preventDefault();

        // Очищаем сообщения от предыдущего расчёта
        errorMessage.textContent = "";
        result.textContent = "";

        // Проверка ввода: если строка не подходит под шаблон (буквы, пробелы, минус, ноль, пусто)
        if (!quantityPattern.test(quantityText)) {
            // Показываем сообщение об ошибке
            errorMessage.textContent =
                "Ошибка: введите целое положительное число без пробелов, букв и других символов.";
            // Возвращаем курсор в поле, чтобы пользователь сразу исправил ввод
            quantityInput.focus();
            // Выходим из функции, расчёт не выполняется
            return;
        }

        // Переводим строку в число; второй аргумент 10 означает десятичную систему
        quantity = parseInt(quantityText, 10);

        // Защита от слишком больших чисел: выше 9007199254740991 JS считает неточно
        if (!Number.isSafeInteger(quantity)) {
            errorMessage.textContent =
                "Ошибка: введённое количество слишком большое.";
            quantityInput.focus();
            return;
        }

        // Берём выбранный пункт списка по его номеру (selectedIndex)
        selectedOption = productSelect.options[productSelect.selectedIndex];
        // Читаем цену из атрибута data-price у <option> и переводим в число
        price = Number(selectedOption.dataset.price);
        // Стоимость заказа = цена * количество
        total = price * quantity;

        // Защита: произведение тоже не должно выходить за безопасные границы
        if (!Number.isSafeInteger(total)) {
            errorMessage.textContent =
                "Ошибка: итоговая стоимость слишком большая для расчёта.";
            return;
        }

        // Выводим результат; toLocaleString("ru-RU") ставит пробелы между разрядами (90 000)
        result.textContent =
            "Стоимость заказа: " +
            total.toLocaleString("ru-RU") +
            " ₽";
    });
});
