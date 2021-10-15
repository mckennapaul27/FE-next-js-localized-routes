import { gql } from '@apollo/client';
import Layout from '../../components/layout';
import client from '../../lib/apollo-client';
import { getGlobalData } from '../../utils/api-helpers';
import { getLocalizedPaths } from '../../utils/localize-helpers';
import ReactMarkdown from 'react-markdown';
import Head from 'next/head';

export default function DynamicBlog({ pageContext, global, title, body }) {
    return (
        <>
            <Head>
                {pageContext.localizedPaths.map((p) => (
                    <link
                        key={p.locale}
                        rel='alternate'
                        href={p.href}
                        hrefLang={p.locale}
                    />
                ))}
            </Head>
            <Layout global={global} pageContext={pageContext}>
                <div className='content'>
                    <h1>{title}</h1>
                    <ReactMarkdown>{body}</ReactMarkdown>
                </div>
            </Layout>
        </>
    );
}

export async function getStaticPaths({ locales }) {
    const paths = (
        await Promise.all(
            locales.map(async (locale) => {
                const { data } = await client.query({
                    query: gql`
                        query GetBlogs($locale: String) {
                            blogs(locale: $locale) {
                                slug
                                locale
                            }
                        }
                    `,
                    variables: { locale },
                });
                return {
                    pages: data.blogs,
                    locale,
                };
            })
        )
    ).reduce((acc, item) => {
        item.pages.map((p) => {
            acc.push({
                params: {
                    slug: p.slug,
                },
                locale: p.locale,
            });
            return p;
        });
        return acc;
    }, []);

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({
    locales,
    locale,
    defaultLocale,
    params,
}) {
    const globalData = await getGlobalData(locale);
    const { data } = await client.query({
        query: gql`
            query GetBlog($slug: String, $locale: String) {
                blogs(locale: $locale, where: { slug: $slug }) {
                    title
                    slug
                    body
                    locale
                    localizations {
                        id
                        slug
                        locale
                    }
                }
            }
        `,
        variables: {
            slug: params.slug,
            locale,
        },
    });

    const page = data.blogs[0];
    const { title, body } = page;

    const pageContext = {
        locale: page.locale,
        locales,
        defaultLocale,
        slug: params.slug,
        localizations: page.localizations,
    };

    const localizedPaths = getLocalizedPaths({ ...pageContext }).map((path) => {
        let arr = path.href.split('');
        const index = arr.lastIndexOf('/') + 1;
        arr.splice(index, 0, 'blog/').join('');
        path.href = arr.join('');
        return path;
    });

    return {
        props: {
            global: globalData,
            title,
            body,
            pageContext: {
                ...pageContext,
                localizedPaths,
            },
        },
    };
}
