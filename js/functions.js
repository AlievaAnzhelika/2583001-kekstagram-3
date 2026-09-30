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

console.log('Функция для проверки длины строки');

const testLength1 = compareStringLength('проверяемая строка', 20);
const testLength2 = compareStringLength('проверяемая строка', 18);
const testLength3 = compareStringLength('проверяемая строка', 10);

console.log(testLength1);
console.log(testLength2);
console.log(testLength3);

console.log('Функция для проверки строки на палиндром');

const testPalindrome1 = checkForPalindrome('топот');
const testPalindrome2 = checkForPalindrome('ДовОд');
const testPalindrome3 = checkForPalindrome('Кекс');
const testPalindrome4 = checkForPalindrome('Лёша на полке клопа нашёл ');

console.log(testPalindrome1);
console.log(testPalindrome2);
console.log(testPalindrome3);
console.log(testPalindrome4);

console.log('Дополнительная функция, извлекающая цифры из строки');

const testDigits1 = extractDigits('2023 год');
const testDigits2 = extractDigits('ECMAScript 2022');
const testDigits3 = extractDigits('1 кефир, 0.5 батона');
const testDigits4 = extractDigits('агент 007');
const testDigits5 = extractDigits('а я томат');
const testDigits6 = extractDigits(2023);
const testDigits7 = extractDigits(-1);
const testDigits8 = extractDigits(1.5);

console.log(testDigits1);
console.log(testDigits2);
console.log(testDigits3);
console.log(testDigits4);
console.log(testDigits5);
console.log(testDigits6);
console.log(testDigits7);
console.log(testDigits8);
