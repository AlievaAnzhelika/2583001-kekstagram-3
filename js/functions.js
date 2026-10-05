function compareStringLength(value, length) {
  return value.length <= length;
}

function checkForPalindrome(value) {
  const readyValue = value.replaceAll(' ', '').toLowerCase(); // Нормализация строки
  let currentValue = '';
  for (let i = readyValue.length - 1; i >= 0; i--) {
    currentValue += readyValue.at(i);
  }
  return readyValue === currentValue;
}

function extractDigits(value) {
  if (typeof(value) === 'number') {
    return Math.abs(Number(value.toString().replace('.', '')));
  }
  let digits = '';
  for (let i = 0; i <= value.length; i++) {
    if (!Number.isNaN(parseInt(value.at(i), 10))) {
      digits += value.at(i);
    }
  }
  return parseInt(digits, 10);
}

compareStringLength('проверяемая строка', 20);
compareStringLength('проверяемая строка', 18);
compareStringLength('проверяемая строка', 10);

checkForPalindrome('топот');
checkForPalindrome('ДовОд');
checkForPalindrome('Кекс');
checkForPalindrome('Лёша на полке клопа нашёл ');

extractDigits('2023 год');
extractDigits('ECMAScript 2022');
extractDigits('1 кефир, 0.5 батона');
extractDigits('агент 007');
extractDigits('а я томат');
extractDigits(2023);
extractDigits(-1);
extractDigits(1.5);
