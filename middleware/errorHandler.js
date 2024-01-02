const errorHandler  = (err, req, res, next) => {
    console.log(err.stack);
    const status = res.statusCode || 500;
    res.status(status);
    res.json({message: res.message});
}

module.exports = { errorHandler };