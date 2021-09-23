import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    console.log(req.body);
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match",
        });
    }
    const usernameExists = await User.exists({$or: [{username}, {email}]});
    if (usernameExists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch {
        return  res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        })
    }
};
export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({username});
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage : "An account with this username does not exists.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle: pageTitle,
            errorMessage : "Wrong password or username",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseURL = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: "03d39f950337bd29d9eb",
        allow_signup:false,
        scope:"read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseURL}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = (req, res) => {

}

export const see = (req, res) => res.send("see");
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
