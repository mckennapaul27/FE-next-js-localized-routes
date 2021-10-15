import client from '../lib/apollo-client';
import { gql } from '@apollo/client';

export const getGlobalData = async (locale) => {
    const { data } = await client.query({
        query: gql`
            query GetGlobal($locale: String) {
                global(locale: $locale) {
                    locale
                    navbar {
                        links {
                            id
                            name
                            url
                            newTab
                        }
                    }
                }
            }
        `,
        variables: {
            locale,
        },
    });

    return data.global;
};
