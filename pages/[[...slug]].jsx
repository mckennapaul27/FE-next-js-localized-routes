import { gql } from '@apollo/client';
import Layout from '../components/layout';
import client from '../lib/apollo-client';
import { getGlobalData } from '../utils/api-helpers';
import { getLocalizedPaths } from '../utils/localize-helpers';
import ReactMarkdown from 'react-markdown';

const DynamicPage = ({ global, pageContext, title, body }) => {
    return (
        <Layout global={global} pageContext={pageContext}>
            <div className='content'>
                <h1>{title}</h1>
                <ReactMarkdown>{body}</ReactMarkdown>
            </div>
        </Layout>
    );
};

export default DynamicPage;

export async function getStaticPaths({ locales }) {
    // array of locales provided in context object in getStaticPaths
    const paths = (
        await Promise.all(
            locales.map(async (locale) => {
                // map through locales
                const { data } = await client.query({
                    query: gql`
                        query GetAllPages($locale: String) {
                            pages(locale: $locale) {
                                slug
                                locale
                            }
                        }
                    `, // fetch list of pages per locale
                    variables: { locale },
                });
                return {
                    pages: data.pages,
                    locale,
                };
            })
        )
    ).reduce((acc, item) => {
        item.pages.map((p) => {
            // reduce through the array of returned objects
            acc.push({
                params: {
                    slug: p.slug === '/' ? false : p.slug.split('/'),
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
    locale,
    locales,
    defaultLocale,
    params,
}) {
    const { data } = await client.query({
        query: gql`
            query GetPageBySlug($slug: String, $locale: String) {
                pages(locale: $locale, where: { slug: $slug }) {
                    title
                    body
                    slug
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
            slug: params.slug ? params.slug[0] : '',
            locale,
        },
    });

    const page = data.pages[0];
    const { title, body } = page;

    const pageContext = {
        locale: page.locale,
        localizations: page.localizations,
        locales,
        defaultLocale,
        slug: params.slug ? params.slug[0] : '',
    };

    const localizedPaths = getLocalizedPaths(pageContext);
    const globalData = await getGlobalData(locale);

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
