// ==UserScript==
// @name         Amazon Laplace Reviews
// @namespace    http://0bit.dev
// @version      1.0
// @description  Calculate the probability of a 5-star experience using Laplace's rule of succession for Amazon reviews.
// @match        https://www.amazon.com/*
// @grant        none
// ==/UserScript==

(function() {
    // Function to calculate Laplace's rule of succession
    function calculateProbability(fiveStarReviews, totalReviews) {
        const n = totalReviews;
        const r = fiveStarReviews;

        return ((r + 1) / (n + 2)) * 100;
    }

    // Function to extract the number of 5-star reviews and total reviews
    function extractReviewsInfo() {
        const totalReviewsElement = document.querySelector('.averageStarRatingNumerical > span');
        var total = 0;
        if (totalReviewsElement) {
            const reviewText = totalReviewsElement.textContent;
            const matches = reviewText.match(/(\d+) global ratings?/);
            if (matches && matches.length === 2) {
                console.log(matches[1]);
                total = parseInt(matches[1]);
            } else {
              console.log("Couldn't parse total ratings", matches);
              return null;
            }
        } else {
          console.log("Page didn't contain total ratings element");
          return null;
        }
        const fiveStars = document.querySelector('tr.a-histogram-row:nth-child(1) > td:nth-child(3) > :is(span, a):nth-child(2)');
        if (fiveStars) {
            const fiveStarText = fiveStars.textContent;
            const matches = fiveStarText.match(/(\d+)%/);
            if (matches && matches.length === 2) {
              console.log(matches[1]);
              const absolute = parseInt(matches[1]) / 100 * total;
              return {absolute, total};
            } else {
              console.log("Couldn't parse five-stars text", matches);
              return null;
            }
        } else {
          console.log("Page didn't contain element with 5-star %");
        }
        return null;
    }

    // Function to display the probability on the page
    function displayProbability(probability) {
        const probabilityText = `Probability of a 5-star experience: ${Math.round(probability)}%`;
        const titleElement = document.querySelector('#productTitle');
        if (titleElement) {
            const probabilityElement = document.createElement('p');
            probabilityElement.textContent = probabilityText;
            titleElement.parentNode.appendChild(probabilityElement);
        } else {
          console.log("Couldn't find product title element");
        }
    }

    // Main script
    const reviewsInfo = extractReviewsInfo();
    if (reviewsInfo) {
        const {absolute, total} = reviewsInfo;
        console.log(absolute, total);
        const probability = calculateProbability(absolute, total);
        displayProbability(probability);
    } else {
      console.log("reviewsInfo was null");
    }
})();
