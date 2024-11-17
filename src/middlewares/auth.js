const adminAuth = (req, res, next) => {
    console.log("adminAuth middleware called");
    const token = "xyz"; 
    const isAdminAuthorized = token === "xyz"; 
    if (!isAdminAuthorized) {
        console.log("Unauthorized request");
        return res.status(401).send("Unauthorized request");
    } else {
        console.log("Authorized request");
        next();
    }
};

module.exports = { adminAuth };
