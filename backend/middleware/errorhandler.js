const errorHandler = (err, req, res, next) => { 
    let error = { ...err };
    error.message = err.message;

    console.log(err);

    //* Handling bad ObjectId (MongoDB)
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    //* Handling duplicate keys (MongoDB)
     if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    //* Handling validation errors (Mongoose)
     if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    //* Handling JWT errors
    if (err.name === 'JsonWebTokenError') {  
        const message = 'Invalid token';
        error = { message, statusCode: 401 };  
    }

       if (err.name === 'TokenExpiredError') {  
        const message = 'Token expired';
        error = { message, statusCode: 401 };  
    }

     res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;