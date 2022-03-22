import Head from 'next/head'

import { getDropboxPaperDocuments, getDropboxPaperPost } from '../../lib/dropbox_posts'

import Layout from '../../components/layout'
import Date from '../../components/date'

import utilStyles from '../../styles/utils.module.css'

export async function getStaticProps({ params }) {
  const postData = await getDropboxPaperPost(params.id)
  return {
    props: {
      postData
    }
  }
}

export async function getStaticPaths() {
  const allPostsData = await getDropboxPaperDocuments(null, {
    folder_key: process.env.DROPBOXPAPER_FOLDER
  })
  return {
    paths: allPostsData.map(p => ({ params: { id: p.id } })),
    fallback: false
  }
}

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}
