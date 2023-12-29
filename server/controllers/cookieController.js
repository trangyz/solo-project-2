const cookieController = {};

cookieController.setSSIDCookie = (req, res, next) => {
    console.log('running cookieController.setSSISCookie')
    res.cookie('ssid', res.locals.userID, {
        httpOnly: true,
    });
    console.log(`res.cookie set`)
    return next();
}

module.exports = cookieController;
