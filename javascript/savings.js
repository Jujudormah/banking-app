'use strict';

//Declarations
const logo = document.querySelector('#logo');

console.log('file working');
//Main Logic
logo.addEventListener('click', function (event) {
  window.location.href = 'landing.html';
});

const form = document.getElementById('savingsForm');
const resultsContent = document.getElementById('resultsContent');
const placeholder = document.getElementById('placeholder');
const finalAmountEl = document.getElementById('finalAmount');
const totalContributionsEl = document.getElementById('totalContributions');
const interestEarnedEl = document.getElementById('interestEarned');
const breakdownTableEl = document.getElementById('breakdownTable');

// Format currency
const formatCurrency = amount => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Calculate compound interest with monthly contributions
const calculateSavings = (initial, monthly, rate, years) => {
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;
  let balance = initial;
  const yearlyData = [];

  for (let year = 1; year <= years; year++) {
    let yearStartBalance = balance;
    let yearInterest = 0;

    // Calculate for each month in this year
    for (let month = 1; month <= 12; month++) {
      const interest = balance * monthlyRate;
      yearInterest += interest;
      balance += interest + monthly;
    }

    yearlyData.push({
      year,
      balance,
      interest: yearInterest,
    });
  }

  const totalContributions = initial + monthly * months;
  const totalInterest = balance - totalContributions;

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest,
    yearlyData,
  };
};

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();

  // Get input values
  const initial = parseFloat(document.getElementById('initial').value) || 0;
  const monthly = parseFloat(document.getElementById('monthly').value) || 0;
  const interest = parseFloat(document.getElementById('interest').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;

  // Validate inputs
  if (initial < 0 || monthly < 0 || interest < 0 || years < 1) {
    alert('Please enter valid positive numbers');
    return;
  }

  // Calculate results
  const results = calculateSavings(initial, monthly, interest, years);

  // Display results
  finalAmountEl.textContent = formatCurrency(results.finalBalance);
  totalContributionsEl.textContent = formatCurrency(results.totalContributions);
  interestEarnedEl.textContent = formatCurrency(results.totalInterest);

  // Populate breakdown table
  breakdownTableEl.innerHTML = '';
  results.yearlyData.forEach(data => {
    const row = document.createElement('tr');
    row.innerHTML = `
                    <td>Year ${data.year}</td>
                    <td>${formatCurrency(data.balance)}</td>
                    <td>${formatCurrency(data.interest)}</td>
                `;
    breakdownTableEl.appendChild(row);
  });

  // Show results, hide placeholder
  placeholder.classList.add('hidden');
  resultsContent.classList.remove('hidden');
});
