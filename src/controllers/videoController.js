import Video from "../models/Video";
import {raw} from "express";

/*
export const home = async (req, res) => {
    Video.find({}, (error, videos) => {
        return res.render("home", { pageTitle: "Home", videos});
    });
}
*/
export const home = async (req, res) => {
    try {
        const videos = await Video.find({});
        return res.render("home", {pageTitle: "Home", videos })
    }catch(err) {
        return res.render("server-error", err);
    }
};

export const watch = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video)
        return res.render("404", {pageTitle: "video not found."});
    return res.render("watch", {pageTitle: video.title, video} );
};

export const getEdit = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video)
        return res.render("404", {pageTitle: "video not found."});
    return res.render("edit", {pageTitle: `Edit ${video.title} `, video })
};

export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id: id});
    if (!video)
        return res.render("404", {pageTitle: "video not found."});
    await Video.findByIdAndUpdate(id, {
        title, description, hashtags:hashtags
            .split(",").map((word) => word.startsWith('#') ? word : `#${word}`)
    })
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}
export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body;
    /*const video = new Video({
        title,
        description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map(word => `#${word}`),
        meta: {
            views: 0,
            rating: 0,
        }
    });
    const dbVideo = await video.save();*/
    try{
        await Video.create({
            title,
            description,
            hashtags: hashtags.split(",").map(word => `#${word}`),
        });
        return res.redirect("/");
    }catch(err) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: err._message,
        });
    }
};