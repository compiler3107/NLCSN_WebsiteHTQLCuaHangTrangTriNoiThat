const adminRouter = require('./Admin');


function router(app){
    app.use('/',adminRouter)
    // app.use('/manager',managerRouter)
    // app.use('/staff',staffRouter)
}
module.exports = router;