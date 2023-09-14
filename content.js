// Function to extract color values from CSS styles
function extractColorsFromStyles() {
  try {
    const styleSheets = document.styleSheets;

    for (let i = 0; i < styleSheets.length; i++) {
      const styleSheet = styleSheets[i];
      let rules;

      try {
        rules = styleSheet.rules || styleSheet.cssRules;
      } catch (error) {
        // Handle the error (e.g., cross-origin stylesheet)
        console.error("Error accessing stylesheet rules:", error);
        continue;
      }

      if (!rules) continue;

      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];
        if (rule.style) {
          const color = rule.style.color;
          if (color && isColorValue(color)) {
            console.log(color);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error extracting colors from styles:", error);
  }
}

// Function to extract color values from HTML attributes
function extractColorsFromAttributes() {
  const elementsWithColorAttribute = document.querySelectorAll('[color]');

  elementsWithColorAttribute.forEach((element) => {
    const color = element.getAttribute('color');
    if (color && isColorValue(color)) {
      console.log(color);
    }
  });
}

// Function to validate if a value is a valid color
function isColorValue(value) {
  const colorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)|rgba\(\d{1,3}, \d{1,3}, \d{1,3}, [\d.]+\))$/;
  return colorRegex.test(value);
}

// Call the extraction functions when the page is fully loaded
window.addEventListener('load', function () {
  extractColorsFromStyles();
  extractColorsFromAttributes();
});
