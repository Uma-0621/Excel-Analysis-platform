// utils/utils.js

/**
 * Formats a date to a more readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date.
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Handles API fetch requests and returns response data.
 * @param {string} url - The API URL to fetch data from.
 * @param {object} options - Fetch options (headers, method, body, etc.).
 * @returns {Promise<object>} - A promise resolving to the response data.
 */
export async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch data error:", error);
    throw error;
  }
}

/**
 * Converts an Excel file's column data into a key-value pair.
 * @param {array} data - The parsed Excel data.
 * @param {string} columnName - The column name to extract values from.
 * @returns {array} - The array of values from the specified column.
 */
export function extractColumnData(data, columnName) {
  return data.map((row) => row[columnName] || "");
}

/**
 * Generates a random string of specified length.
 * @param {number} length - The length of the string.
 * @returns {string} - The generated random string.
 */
export function generateRandomString(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Downloads a JSON object as a file.
 * @param {object} data - The data to download.
 * @param {string} filename - The name of the file.
 */
export function downloadJsonFile(data, filename = "data.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
