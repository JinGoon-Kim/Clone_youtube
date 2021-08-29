export const join = (req, res) => res.send("Join");
export const see = (req, res) => {
    console.log(req.params);
    return res.send("Watch");
}
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Log out");
