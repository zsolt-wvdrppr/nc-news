async function fetchData() {
  const response = await fetch("/api/data.json");
  const data = await response.json();
  const container = document.getElementById("endpoints-container");
  const template = document.getElementById("endpoint-template");
  const statusTemplate = document.getElementById("status-template");
  const queryParamsTemplate = document.getElementById("query-params-template");
  const notAvailableTemplate = document.getElementById("not-available");
  const navTemplate = document.getElementById("nav-template");
  const navContainer = document.querySelector("nav ul");

  data.sections.forEach((section) => {
    const clone = template.content.cloneNode(true);
    const queryParamsContainer = clone.querySelector(
      "div.query-params-container",
    );

    // Add nav menu
    const cloneNavMenu = navTemplate.content.cloneNode(true);
    console.log(cloneNavMenu);
    cloneNavMenu.querySelector("li a span.part1").textContent = section.method;
    cloneNavMenu.querySelector("li a span.part2").textContent =
      section.endpoint;
    cloneNavMenu.querySelector("a").href = "#" + section.anchor;
    navContainer.appendChild(cloneNavMenu);

    clone.querySelector("div").id = section.anchor;
    clone.querySelector("div h2").textContent =
      `${section.method} ${section.endpoint}`;

    // Get titles
    data.sectionSubTitles.forEach((title) => {
      const selector = Object.keys(title)[0];
      clone.querySelector("h3." + selector).textContent = title[selector];
    });

    // Get description body
    clone.querySelector("div p.description").textContent = section.description;

    // Get query params body
    if (section.queryParams) {
      section.queryParams.forEach((queryParam) => {
        const queryParamsClone = queryParamsTemplate.content.cloneNode(true);

        queryParamsClone.querySelector("div p.qp-example").textContent =
          queryParam.description;
        queryParamsClone.querySelector("div p.qp-description").textContent =
          queryParam.example;

        queryParamsContainer.appendChild(queryParamsClone);
      });
    } else {
      const queryParamsClone = notAvailableTemplate.content.cloneNode(true);
      queryParamsContainer.appendChild(queryParamsClone);
    }

    // Get request body params
    clone.querySelector("div p.req-body").textContent = section.reqBody;
    // Get response body params
    clone.querySelector("div p.res-body").textContent = section.resBody;

    // Get status codes
    section.statusCodes.forEach((statusCode) => {
      const statusClone = statusTemplate.content.cloneNode(true);
      statusClone.querySelector("div").classList.add(statusCode.type);
      statusClone.querySelector("div p.status-code").textContent =
        statusCode.code;
      statusClone.querySelector("div p.status-title").textContent =
        statusCode.title;
      statusClone.querySelector("div p.status-description").textContent =
        statusCode.description;
      clone.appendChild(statusClone);
    });

    container.appendChild(clone);
  });
}

fetchData();
