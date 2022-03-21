import fs from "fs";
import { Feed } from "feed";

export async function generateRssFeed(posts: any) {
  const siteURL = "/";
  const date = new Date();
  const author = {
    name: "TKNGUE",
    email: "takegue@gmail.com",
    link: "https://twitter.com/takegue",
  };

  const feed = new Feed({
    title: "Sreetam Das' blog",
    description: "",
    id: siteURL,
    link: siteURL,
    image: `/logo.svg`,
    favicon: `/favicon.png`,
    // copyright: `All rights reserved ${date.getFullYear()}, takegue`,
    updated: date,
    generator: "Feed for Node.js",
    feedLinks: {
      atom: `rss/atom.xml`,
    },
    author,
  });

  posts.forEach((post) => {
    const url = `/posts/${post.id}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      content: post.summary,
      author: [author],
      date: date,
    });
  });

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
};
