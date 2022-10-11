const membersData = require('../public/data/membersData')

module.exports.getContact = (req, res) => {
    try {
        res.render('pages/contact',{
            membersData
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
    
}