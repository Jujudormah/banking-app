'use strict';

//Declarations
const logo = document.getElementById('logo');
const form = document.getElementById('savingsForm');
const resultsContent = document.getElementById('resultsContent');
const placeholder = document.getElementById('placeholder');
const finalAmountEl = document.getElementById('finalAmount');
const totalContributionsEl = document.getElementById('totalContributions');
const interestEarnedEl = document.getElementById('interestEarned');
const breakdownTableEl = document.getElementById('breakdownTable');

//Main Logic
logo.addEventListener('click', function (event) {
  window.location.href = 'landing.html';
});

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

//Form submission
form.addEventListener('submit', e => {
  e.preventDefault();

  const initial = parseFloat(document.getElementById('initial').value) || 0;
  const monthly = parseFloat(document.getElementById('monthly').value) || 0;
  const interest = parseFloat(document.getElementById('interest').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;

  if (initial < 0 || monthly < 0 || interest < 0 || years < 1) {
    alert('Invalid! Enter valid positive numbers');
    return;
  }

  const results = calculateSavings(initial, monthly, interest, years);
  finalAmountEl.textContent = formatCurrency(results.finalBalance);
  totalContributionsEl.textContent = formatCurrency(results.totalContributions);
  interestEarnedEl.textContent = formatCurrency(results.totalInterest);

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

  placeholder.classList.add('hidden');
  resultsContent.classList.remove('hidden');
});
