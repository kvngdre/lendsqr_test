import Joi from 'joi';

function formatErrorMessage(errorMessage) {
  //  * Regex to locate the appropriate space for inserting commas in numbers.
  const regex = /(?<!.*ISO \d)\B(?=(\d{3})+(?!\d))/g;

  // * Remove quotation marks and insert comma to number found.
  return `${errorMessage.replaceAll('"', '').replace(regex, ',')}.`;
}

/**
 * This function takes a Joi validation error object and returns an object with refined error messages.
 * The keys of the returned object are the dot-separated paths of the invalid data, and the values are the formatted error messages.
 * @param {Joi.ValidationError} error The Joi validation error object to refine.
 * @returns {Object.<string, string>} The refined error object with path-message pairs
 */
export default function refineValidationError(error) {
  /**
   * This function joins the elements of the error path array.
   * Example: ['name', 'first'] becomes 'name.first'.
   * @param {string} accumulator
   * @param {string} nextValue
   * @returns {string}
   */
  const reducer = (accumulator, nextValue) => {
    if (accumulator === '') return accumulator + nextValue;
    return accumulator + '.' + nextValue;
  };

  const refinedError = {};
  for (const errorDetail of error.details) {
    refinedError[errorDetail.path.reduce(reducer, '')] = formatErrorMessage(
      errorDetail.message,
    );
  }

  return refinedError;
}
