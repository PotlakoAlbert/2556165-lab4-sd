document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("countryName");
  const submit = document.getElementById("submit");

  if (!inputField || !submit) {
      console.error("Required elements not found.");
      return;
  }

  submit.addEventListener("click", () => {
      const countryName = inputField.value.trim();
      if (countryName) {
          countryData(countryName);
      } else {
          alert("Please enter a country name.");
      }
  });

  function countryData(countryName) {
      fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Country not found. Please check the spelling.");
          }
          return response.json();
        })
        .then(data => {
          if (!data || data.length === 0) {
            throw new Error("No country data found.");
          }
          displayData(data[0]);
        })
        .catch(error => {
          document.getElementById("country-info").innerHTML = `<p style="color: red; text-align: center;">${error.message}</p>`;
          document.getElementById("bordering-countries").innerHTML = "";
          console.error(error);
        });
  }

  function displayData(countryData) {
    const sectionCountryInfo = document.getElementById("country-info");
    const sectionBorderingCountries = document.getElementById("bordering-countries");

    const capital = countryData.capital ? countryData.capital[0] : "N/A";
    const population = countryData.population.toLocaleString();
    const region = countryData.region || "N/A";
    const flag = countryData.flags?.svg || "";

    sectionCountryInfo.innerHTML = `
      <h2 style="text-align: center;">${countryData.name.common}</h2>
      <ul style="list-style-type: square; text-align: center;">
        <li><strong>Capital:</strong> ${capital}</li>
        <li><strong>Population:</strong> ${population}</li>
        <li><strong>Region:</strong> ${region}</li>
      </ul>
      <p style="text-align: center;">
        <img src="${flag}" alt="Flag of ${countryData.name.common}" width="150">
      </p>
    `;

    if (countryData.borders && countryData.borders.length > 0) {
      fetchBorderingCountries(countryData.borders);
    } else {
      sectionBorderingCountries.innerHTML = "<p style='text-align: center;'>No bordering countries.</p>";
    }
  }

  function fetchBorderingCountries(borderCodes) {
    const sectionBorderingCountries = document.getElementById("bordering-countries");

    fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`)
      .then(response => response.json())
      .then(data => {
        sectionBorderingCountries.innerHTML = `
          <h3 style="text-align: center;">Bordering Countries:</h3>
          <ul style="
            display: flex; 
            justify-content: center; 
            flex-wrap: wrap; 
            list-style: none; 
            padding: 0; 
            gap: 20px;
          ">
        `;

        data.forEach(country => {
          sectionBorderingCountries.innerHTML += `
            <li style="text-align: center;">
              <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="80"><br>
              <strong>${country.name.common}</strong>
            </li>
          `;
        });

        sectionBorderingCountries.innerHTML += "</ul>";
      })
      .catch(error => {
        sectionBorderingCountries.innerHTML = "<p style='color: red; text-align: center;'>Error fetching bordering countries.</p>";
        console.error(error);
      });
  }
});
