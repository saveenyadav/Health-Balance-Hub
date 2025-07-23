import asyncHandler from "./asyncHandler.js";

const errorHandler = (err, req, res, nest) => {
    let error = {...err};
    error.message = err.message;
    console.log(err);
 //* Handling bad ObId
 if (err.name === 'CastError') {
    const message = 'Resource is unavailable';
    error = {message, statusCode: 404};
 }

//* Handling duplicate keys
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }



//* Handling validation errors

  if (err.name === 'ValidationError') {
    const message = Object.values(error.errors).map(val => val.message).join(',');
    error = { message, statusCode: 400 };
  }




  //* Handling JWT errors

  if (err.name === 'JwtError') {
    const message = 'Token is invalid';
    error = { message, statusCode: 4001};
  }

   if (err.name === 'ExpiredTokenError') {
    const message = 'Token is expired';
    error = { message, statusCode: 4001};
  }


  res.status(error.statusCode || 500).json({
success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })

  });

};//note: last parenthesis

export default errorHandler;