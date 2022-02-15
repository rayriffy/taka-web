import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Fragment } from 'react'

interface Props {
  title: string
  content: string
}

const Page: NextPage<Props> = props => {
  const { title, content } = props

  return (
    <Fragment>
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className='prose prose-a:text-blue-500' dangerouslySetInnerHTML={{ __html: content }}></div>
    </Fragment>
  )
}

export const getStaticProps: GetStaticProps<Props> = async ctx => {
  const { default: fs } = await import('fs')
  const { default: path } = await import('path')
  const { default: matter } = await import('gray-matter')
  const { marked } = await import('marked')

  const slug = ctx.params.slug as string
  const filePath = path.join(process.cwd(), 'src/contents', `${slug}.md`)
  const fileContent = fs.readFileSync(filePath).toString()

  const { data: frontmatter, content } = matter(fileContent) 

  return {
    props: {
      title: frontmatter.title,
      content: marked(content),
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { default: fs } = await import('fs')
  const { default: path } = await import('path')

  const contentsPath = path.join(process.cwd(), 'src/contents')
  const contentLists = fs
    .readdirSync(contentsPath)
    .filter(o => o.endsWith('.md') && !o.startsWith('.'))

  return {
    paths: contentLists.map(contentList => ({
      params: {
        slug: contentList.replace('.md', ''),
      },
    })),
    fallback: false,
  }
}

export default Page
