export const errorHandler = (statusCode, message) => {
  const error = new Error(message); // Pass message to Error constructor
  error.statusCode = statusCode; // Standardize to statusCode
  return error;
};
