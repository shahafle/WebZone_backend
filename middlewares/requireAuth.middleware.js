// Checks if theres a session and if theres a user on the session
async function requireAuth(req, res, next) {
  // if (!req?.session?.user) { // check later if it works
  if (!req.session || !req.session.user) {
    res.status(401).end('Unauthorized!') // response doesn't stop the code
    return // to stop the function from going to next()
  }
  next() // Next allows moving forward to the next function in line
}

module.exports = {
  requireAuth
}