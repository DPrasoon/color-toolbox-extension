document.addEventListener('DOMContentLoaded', function () {
  // Dark mode toggle
  const darkModeToggle = document.getElementById('mode-toggle');
  const body = document.body;

  // Load dark mode state from chrome.storage
  chrome.storage.sync.get(['isDarkMode'], function (result) {
    const isDarkMode = result.isDarkMode;
    if (isDarkMode !== undefined) {
      darkModeToggle.checked = isDarkMode;
      applyDarkMode(isDarkMode);
    }
  });

  darkModeToggle.addEventListener('change', function () {
    const isDarkMode = darkModeToggle.checked;
    // Save dark mode state to chrome.storage
    chrome.storage.sync.set({ isDarkMode: isDarkMode });
    applyDarkMode(isDarkMode);
  });

  // Color shuffler
  let shuffler;
  const defaultColor = "#2196F3";

  startup();

  function startup() {
    shuffler = document.querySelector("#color-input");
    shuffler.style.backgroundColor = defaultColor;
    shuffler.addEventListener("input", updateColor, false);
    shuffler.select();
  }

  function updateColor(event) {
    const shuffler = document.querySelector("#color-input");
    if (shuffler) {
      shuffler.style.backgroundColor = event.target.value;
    }
  }
  // Color shuffler ends

  // Color Picker
  const colorInput = document.getElementById('color-input');

  colorInput.addEventListener('input', function () {
    const selectedColor = colorInput.value;
    copyToClipboard(selectedColor);
    colorCodeInput.value = selectedColor; // Set the input box value
    handleColorConversion(colorInput);
  });

  // Function to copy the color to the clipboard
  function copyToClipboard(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    // Show the toast message
    showToast();
  }

  // Function to show the toast message
  function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000); // Hide the toast after 2 seconds (2000 milliseconds)
  }

  // Color Converter
  const colorCodeInput = document.getElementById('color-code-input');
  const convertButton = document.getElementById('convert-button');
  const rgbResult = document.getElementById('rgb-result');
  const cmykResult = document.getElementById('cmyk-result');
  const errorMessage = document.getElementById('error-message'); // Error message element

  // Attach the function to the button click event
  convertButton.addEventListener('click', function () {
    handleColorConversion(colorCodeInput);
  });

  // Define a function for handling color code conversion
  function handleColorConversion(colorValue) {
    const inputColorCode = colorValue.value.trim();

    // Check if the input is a valid HEX color code using parseInt
    const parsedColor = parseInt(inputColorCode.replace('#', ''), 16);

    if (isNaN(parsedColor) || inputColorCode.length !== 7 || inputColorCode[0] !== '#') {
      // Display an error message
      errorMessage.textContent = 'Invalid HEX color code. Please use the format #RRGGBB.';
      errorMessage.classList.remove('hidden'); // Remove the 'hidden' class
      return;
    }

    // Clear any previous error messages
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden'); // Add the 'hidden' class to hide the message

    // Replace this with your color conversion logic
    const convertedRGB = convertToRGB(inputColorCode);
    const convertedCMYK = convertToCMYK(inputColorCode);

    rgbResult.textContent = convertedRGB;
    cmykResult.textContent = convertedCMYK;
  }

  // Function to validate if a value is a valid HEX color code
  function isValidHexColor(value) {
    const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
    return hexColorRegex.test(value);
  }

  // Color Conversion Functions
  function convertToRGB(colorCode) {
    // Remove the '#' symbol if present
    colorCode = colorCode.replace('#', '');

    if (colorCode.length === 3) {
      // Convert 3-digit HEX to 6-digit HEX
      colorCode = colorCode
        .split('')
        .map((char) => char + char)
        .join('');
    }

    const r = parseInt(colorCode.slice(0, 2), 16);
    const g = parseInt(colorCode.slice(2, 4), 16);
    const b = parseInt(colorCode.slice(4, 6), 16);

    return `RGB(${r}, ${g}, ${b})`;
  }

  function convertToCMYK(colorCode) {
    // Remove the '#' symbol if present
    colorCode = colorCode.replace('#', '');

    // Convert HEX to RGB
    const r = parseInt(colorCode.slice(0, 2), 16) / 255;
    const g = parseInt(colorCode.slice(2, 4), 16) / 255;
    const b = parseInt(colorCode.slice(4, 6), 16) / 255;

    // Find the maximum RGB component value
    const max = Math.max(r, g, b);

    // Calculate the K (Key) component
    const k = 1 - max;

    // Prevent division by zero for black
    if (k === 1) {
      return `CMYK(0%, 0%, 0%, 100%)`;
    }

    // Calculate the C (Cyan), M (Magenta), and Y (Yellow) components
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);

    // Convert to percentages and round to two decimal places
    const cPercent = Math.round(c * 100);
    const mPercent = Math.round(m * 100);
    const yPercent = Math.round(y * 100);
    const kPercent = Math.round(k * 100);

    return `CMYK(${cPercent}, ${mPercent}, ${yPercent}, ${kPercent})`;
  }

  // Dark mode helper function
  function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  // Initial application of dark mode
  applyDarkMode(darkModeToggle.checked);
});
