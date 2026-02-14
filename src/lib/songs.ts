export interface Song {
    title: string;
    artist: string;
    cover: string;
    audio: string;
}

export const songs: Song[] = [
    {
        title: "Blue",
        artist: "",
        cover: "/vinyl/blue.jpg",
        audio: "https://res.cloudinary.com/dbjapztc3/video/upload/v1771071482/blue_b8e1g5.mp3",
    },
    {
        title: "Loverboy",
        artist: "",
        cover: "/vinyl/loverboy.jpg",
        audio: "https://res.cloudinary.com/dbjapztc3/video/upload/v1771071486/loverboy_cuk0ls.mp3",
    },
];
