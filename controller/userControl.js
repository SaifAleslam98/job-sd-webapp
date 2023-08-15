

exports.isNotSignIn = async function (req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('back');
    return;
  }
  next();
};

exports.isSignIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/users/signin');
    return;
  }
  next();
};

exports.isClient = async(req, res, next) => {
  if(req.user.accountType == 'client'){
    res.redirect('back');
  }
  next();
};

exports.isOwner = async(req, res, next) => {
  if(req.user.accountType == 'owner'){
    res.redirect('back');
  }
  next();
}