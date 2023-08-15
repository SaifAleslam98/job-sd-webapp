const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

exports.getUserData = asyncHandler(async (req, res, next) => {
    const userData = {
        name: req.user.name,
        address: req.user.city,
        phone: req.user.phone,
        email: req.user.email,
        job: req.user.job,
        accountType: req.user.accountType
    }
    var owner = null
    async function checkOwner() {
        if (req.isAuthenticated()) {
            if (req.user.accountType == "client") {
                owner = false
            }
            else {
                owner = true
            }
        }
    }
    checkOwner()
    const createAt = userData.job
    console.log(createAt)
    res.render('usersView/profile', {
        userData: userData,
        checkprofile: true,
        isOwner: owner,
        checkuser: req.isAuthenticated()
    })
})
