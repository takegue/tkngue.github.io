import Head from 'next/head'
import utilStyles from '../styles/utils.module.css'
import Layout, { siteTitle } from '../components/layout'
import { getDropboxPaperDocuments } from '../lib/dropbox_posts';
import { generateRssFeed } from '../lib/rss';
import Link from 'next/link'
import Date from '../components/date'

type IPostData = {
    id: string;
    date: string;
    title: string;
}

export async function getStaticProps() {
  const recentPostData = await getDropboxPaperDocuments(30, {
    folder_key: process.env.DROPBOXPAPER_FOLDER
  })
  generateRssFeed(recentPostData)
  return {
    props: {
      recentPostData
    }
  }
}

export default function Home({ 
  recentPostData
}: {recentPostData: IPostData[]}) {
  return (
    <Layout home>
      {/* Keep the existing code here */}

      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {recentPostData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
              <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
    </section>
    </Layout>
  )
}
