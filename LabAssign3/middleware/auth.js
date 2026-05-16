function isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) return next();
    req.flash('error', 'You must be logged in to access that page.');
    res.redirect('/auth/login');
}

function isAdmin(req, res, next) {
    if (req.session && req.session.userId && req.session.role === 'admin') {
        return next();
    }
    req.flash('error', 'Access Denied: Admins only.');

    if (user.role === 'admin') {
    return res.redirect('/admin');
}

    res.redirect('/');
}

module.exports = { isLoggedIn, isAdmin };