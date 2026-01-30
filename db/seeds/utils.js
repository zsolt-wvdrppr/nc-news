const { format } = require("node-pg-format");

const getColTitles = (data) => Object.keys(data[0]).toString();
const getColValues = (data) => data.map((row) => Object.values(row));
const getTableDataInsertionQuery = (tableName, data, colsToReturn = null) => {
  const queryStr = format(
    `
    INSERT INTO ${tableName} (${getColTitles(data)}) VALUES %L ${colsToReturn ? "RETURNING " + colsToReturn.toString() : ""}`,
    getColValues(data),
  );
  return queryStr;
};

const findPropWhereMatches = (
  propToGet,
  matchAtProp,
  valueToMatch,
  dataArr,
) => {
  const filteredArr = dataArr.filter(
    (obj) => obj[matchAtProp] === valueToMatch,
  );
  return filteredArr?.[0]?.[propToGet] || null; // Don't assume it's never empty
};

module.exports = {
  getTableDataInsertionQuery,
  findPropWhereMatches,
  getColTitles,
  getColValues,
};
