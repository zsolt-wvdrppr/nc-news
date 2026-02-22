const renderSections = async () => {
  const response = await fetch("/api/data.json");
  const data = await response.json();
  const container = document.getElementById("endpoints-container");
  const mainTemplate = document.getElementById("endpoint-template");

  const methodOrder = {
    get: 1,
    post: 2,
    patch: 3,
    delete: 4,
  };

  const compareFn = (a, b) => {
    if (
      a.endpoint < b.endpoint ||
      methodOrder[a.method] < methodOrder[b.method]
    ) {
      return -1;
    } else if (
      a.endpoint > b.endpoint ||
      methodOrder[a.method] > methodOrder[b.method]
    ) {
      return 1;
    } else {
      return 0;
    }
  };

  const sortedDataSections = data.sections.sort(compareFn);
  sortedDataSections.forEach((section) => {
    const cloneMain = mainTemplate.content.cloneNode(true);

    // Add nav menu
    addMenuItem(section, cloneMain);

    // Add section titles
    addSectionTitles(data.sectionSubTitles, cloneMain);

    // Add description body
    cloneMain.querySelector("div p.description").textContent =
      section.description;

    // Add query params body
    addQueryParams(section.queryParams, cloneMain);

    // Add request body params
    cloneMain.querySelector("div code.req-body").textContent =
      typeof section.reqBody === "object" ?
        JSON.stringify(section.reqBody, null, 2)
      : section.reqBody;

    // Add response body params
    cloneMain.querySelector("div code.res-body").textContent =
      typeof section.resBody === "object" ?
        JSON.stringify(section.resBody, null, 2)
      : section.resBody;

    // Add status codes
    addStatusCodes(section.statusCodes, cloneMain);

    container.appendChild(cloneMain);
  });
};

const addQueryParams = (queryParams, parentNode) => {
  const queryParamsTemplate = document.getElementById("query-params-template");
  const notAvailableTemplate = document.getElementById("not-available");
  const queryParamsContainer = parentNode.querySelector(
    "div.query-params-container",
  );
  if (queryParams) {
    queryParams.forEach((queryParam) => {
      const queryParamsClone = queryParamsTemplate.content.cloneNode(true);

      queryParamsClone.querySelector("div p.qp-example").textContent =
        queryParam.example;
      queryParamsClone.querySelector("div p.qp-description").textContent =
        queryParam.description;

      queryParamsContainer.appendChild(queryParamsClone);
    });
  } else {
    const queryParamsClone = notAvailableTemplate.content.cloneNode(true);
    queryParamsContainer.appendChild(queryParamsClone);
  }
};

const addStatusCodes = (statusCodes, parentNode) => {
  const statusCodesContainer = parentNode.querySelector(
    "div.status-codes-container",
  );
  const statusTemplate = document.getElementById("status-template");
  statusCodes.forEach((statusCode) => {
    const statusClone = statusTemplate.content.cloneNode(true);
    statusClone.querySelector("div").classList.add(statusCode.type);
    statusClone.querySelector("div p.status-code").textContent =
      statusCode.code;
    statusClone.querySelector("div p.status-title").textContent =
      statusCode.title;
    statusClone.querySelector("div p.status-description").textContent =
      statusCode.description;
    statusCodesContainer.appendChild(statusClone);
  });
};

const addMenuItem = (currentSection, parentNode) => {
  const navContainer = document.querySelector("nav ul");
  const navTemplate = document.getElementById("nav-template");
  const endpointWithBreaks = currentSection.endpoint.split("/").join("/<wbr>");
  const cloneNavMenu = navTemplate.content.cloneNode(true);

  cloneNavMenu.querySelector("li a span.part1").textContent =
    currentSection.method;
  cloneNavMenu.querySelector("li a span.part2").innerHTML = endpointWithBreaks;
  cloneNavMenu.querySelector("a").href = "#" + currentSection.anchor;
  navContainer.appendChild(cloneNavMenu);

  parentNode.querySelector("div").id = currentSection.anchor;
  parentNode.querySelector("div h2").innerHTML =
    `${currentSection.method}<br>${endpointWithBreaks}`;
};

const addSectionTitles = (titles, nodeToAdd) => {
  titles.forEach((title) => {
    const selector = Object.keys(title)[0];
    nodeToAdd.querySelector("h3." + selector).textContent = title[selector];
  });
};

renderSections();
