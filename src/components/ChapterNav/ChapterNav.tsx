import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './ChapterNav.scss';

export function ChapterNav ({ chapter }) {
    const nav = useRef(null);
    const footer = useRef(null);

    function onMouseMove (evt: MouseEvent) {
        const navEl: HTMLElement = nav.current;
        const footerEl: HTMLElement = footer.current;

        const navHeight = navEl.clientHeight;
        const footerHeight = footerEl.clientHeight;

        if (evt.y <= navHeight || evt.y >= window.innerHeight - footerHeight) {
            navEl.style.transform = `translateY(0)`;
            footerEl.style.transform = `translateY(0)`;
        } else {
            navEl.style.transform = `translateY(-${navHeight}px)`;
            footerEl.style.transform = `translateY(${footerHeight}px)`;
        }
    }

    useEffect(function () {
        document.addEventListener('mousemove', onMouseMove);
        return function () {
            document.removeEventListener('mousemove', onMouseMove);
        }
    }, [ nav.current, footer.current ]);

    return (
        <>
            <nav className="chapter-nav" ref={ nav }>
                <Link to="/">&lt;</Link>
                <div className="chapter-details">
                    { chapter?.mangaTitle ? (
                            <>
                                <h1 className="title">{ chapter?.mangaTitle }</h1>
                                <h2 className="chapter-num">Chapter { chapter?.mangaChapter }</h2>
                            </>
                        ) : (
                            <h1 className="title">{ chapter?.title }</h1>
                        )
                    }
                </div>
            </nav>
            <footer className="chapter-footer" ref={ footer }>
                <h2 className="description">Uploaded by { chapter?.author }. { chapter?.desc }</h2>
            </footer>
        </>
    );
}