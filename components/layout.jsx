import { useRouter } from 'next/router';
import { formatSlug } from '../utils/localize-helpers';
import Navbar from './navbar';

const Layout = ({ children, pageContext, global }) => {
    const router = useRouter();
    const { locale, locales, defaultLocale, asPath } = router;
    const page = pageContext
        ? pageContext
        : {
              // if there is no pageContext because it is SSR page or non-CMS page
              // the following is from useRouter and is used for non-translated, non-localized routes
              locale, // current locale
              locales, // locales provided by next.config.js
              defaultLocale, // en = defaultLocale
              slug: formatSlug(asPath.slice(1), locale, defaultLocale), // slice(1) because asPath includes /
              localizedPaths: locales.map((loc) => ({
                  // creates an array of non-translated routes such as /normal-page /es/normal-page /de/normal-page. Will make more sense when we implement the LocaleSwitcher Component
                  locale: loc,
                  href: formatSlug(asPath.slice(1), loc, defaultLocale),
              })),
          };

    return (
        <div>
            <div className='container'>
                <Navbar pageContext={page} global={global} />
                {children}
            </div>
        </div>
    );
};

export default Layout;
