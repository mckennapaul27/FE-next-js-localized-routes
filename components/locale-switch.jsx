import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { getLocalizedPage, localizePath } from '../utils/localize-helpers';
import { FaGlobe } from 'react-icons/fa';

export default function LocaleSwitch({ pageContext }) {
    const isMounted = useRef(false); // We utilise useRef here so that we avoid re-render once it is mounted
    const router = useRouter();
    const [active, toggleActive] = useState(false);
    const [locale, setLocale] = useState();

    const handleLocaleChange = async (selectedLocale) => {
        Cookies.set('NEXT_LOCALE', selectedLocale); // set the out-of-the-box Next cookie 'NEXT_LOCALE'
        setLocale(selectedLocale);
    };

    const handleLocaleChangeRef = useRef(handleLocaleChange); // use a ref so that it does not re-render unless necessary. Note we are using handleLocaleChange(locale) without the ref in our Link components below

    useEffect(() => {
        const localeCookie = Cookies.get('NEXT_LOCALE');
        if (!localeCookie) {
            // if there is no NEXT_LOCALE cookie set it to the router.locale
            handleLocaleChangeRef.current(router.locale);
        }

        const checkLocaleMismatch = async () => {
            if (
                // if localeCookie IS SET and does not match pageContextlocale
                !isMounted.current &&
                localeCookie &&
                localeCookie !== pageContext.locale
            ) {
                // For example if localeCookie = 'es' and user lands on /de/erste-seite, it will call getLocalizedPage with 'es' and pageContext
                const localePage = await getLocalizedPage(
                    localeCookie,
                    pageContext
                ); // we then fetch the correct localized page

                // object assign overrides locale, localizations, slug
                router.push(
                    // router.push the correct page which is /es/primera-pagina
                    `${localizePath({ ...pageContext, ...localePage })}`, //url
                    `${localizePath({ ...pageContext, ...localePage })}`, // as
                    { locale: localePage.locale } // options
                    // we need to include the 'as' href otherwise the router will try to redirect to /es/[[...slug]]]
                );
            }
        };

        setLocale(localeCookie || router.locale);
        checkLocaleMismatch();

        return () => {
            // sets the ref isMounted to true which will persist state throughout.
            isMounted.current = true;
        };
    }, [locale, router, pageContext]); // called again if locale, router or pageContext change

    return (
        <div className={`dropdown is-right ${active && 'is-active'} `}>
            <div className='dropdown-trigger'>
                <button
                    onClick={() => toggleActive(!active)}
                    className='button is-small is-rounded'
                    aria-haspopup='true'
                    aria-controls='dropdown-menu3'>
                    <span className='icon is-small'>
                        <FaGlobe />
                    </span>
                </button>
            </div>
            <div className='dropdown-menu' id='dropdown-menu3' role='menu'>
                <div className='dropdown-content'>
                    {pageContext.localizedPaths &&
                        pageContext.localizedPaths.map(({ href, locale }) => (
                            <Link
                                href={href}
                                locale={locale}
                                key={locale}
                                role={'option'}
                                passHref>
                                <a
                                    className='dropdown-item'
                                    style={{ padding: '0.25rem 1rem' }}
                                    onClick={() => handleLocaleChange(locale)}>
                                    {locale}
                                </a>
                            </Link>
                        ))}
                </div>
            </div>
        </div>
    );
}
