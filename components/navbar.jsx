import LocaleSwitch from './locale-switch';
import Link from 'next/link';

export default function Navbar({ pageContext, global }) {
    return (
        <>
            <nav
                className='navbar'
                role='navigation'
                aria-label='main navigation'>
                <div className='navbar-brand'>
                    <a
                        role='button'
                        className='navbar-burger'
                        data-target='navbarBasic'
                        aria-label='menu'
                        aria-expanded='false'>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                    </a>
                </div>

                <div id='navbarBasic' className='navbar-menu'>
                    <div className='navbar-start'>
                        {global.navbar.links.map((link) => (
                            <Link
                                key={link.id}
                                href={link.url}
                                locale={global.locale}>
                                <a className='navbar-item'>
                                    <span> {link.name} </span>{' '}
                                </a>
                            </Link>
                        ))}
                    </div>
                    <div className='navbar-end'>
                        <div className='navbar-item'>
                            <LocaleSwitch pageContext={pageContext} />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
