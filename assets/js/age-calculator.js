/**
 * Dynamic Age Calculator
 * Automatically calculates and updates the exact age based on birth date (March 30, 2004)
 * Keeps the age 100% accurate across all years without hardcoding.
 */
(function () {
  'use strict';

  function calculateExactAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  }

  function renderAge(birthDateString = '2004-03-30') {
    const age = calculateExactAge(birthDateString);
    const ageElement = document.getElementById('dynamic-age');
    if (ageElement) {
      ageElement.textContent = age;
    }
    return age;
  }

  // Expose to window for dynamic updates from data service / admin settings
  window.AgeCalculator = {
    calculate: calculateExactAge,
    render: renderAge
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderAge());
  } else {
    renderAge();
  }
})();
