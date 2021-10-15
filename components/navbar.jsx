import LocaleSwitch from './locale-switch';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({ pageContext, global }) {
    const [active, toggleActive] = useState(false);
    return (
        <>
            <nav
                className='navbar active'
                role='navigation'
                aria-label='main navigation'>
                <div className='navbar-brand'>
                    <a
                        onClick={() => toggleActive(!active)}
                        role='button'
                        className={`navbar-burger ${active && 'is-active'}`}
                        data-target='navbarBasic'
                        aria-label='menu'
                        aria-expanded='false'>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                        <span aria-hidden='true'></span>
                    </a>
                </div>

                <div
                    id='navbarBasic'
                    className={`navbar-menu ${active && 'is-active'}`}>
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
