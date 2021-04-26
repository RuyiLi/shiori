import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import './ChapterView.scss';
import { fetchChapter } from '../../util/imgbb';
import { ChapterNav, PageCounter } from '../../components/';

const PAGE_VISIBILITY_CUTOFF = 0.55;

export function ChapterView () {
    const { albumID } = useParams();
    const [ chapter, setChapter ] = useState(null);
    const [ currPage, setCurrPage ] = useState(0);
    const chapterContainer = useRef(null);

    useEffect(async function () {
        const chapter = await fetchChapter(albumID);
        setChapter(chapter);
    }, []);

    const observer = new IntersectionObserver(function (entries) {
        let maxRatio = -1;
        for (const { target, intersectionRatio } of entries) {
            if (intersectionRatio > maxRatio && intersectionRatio >= PAGE_VISIBILITY_CUTOFF) {
                maxRatio = intersectionRatio;
                setCurrPage((target as HTMLElement).dataset.pageNum);
            }
        }
    }, {
        threshold: PAGE_VISIBILITY_CUTOFF,
    });

    useEffect(function () {
        console.info(`Updated chapter container with ${chapterContainer.current.children.length} children`);
        for (const child of chapterContainer.current.children) {
            observer.observe(child);
        }
    }, [ chapterContainer.current?.children ]);

    return (
        <>
            <div className="chapter-container" ref={ chapterContainer }>
                {
                    chapter?.pages.map((page, i) => (
                        <div className="page" key={ page.id + i } data-page-num={ i + 1 }>
                            {/* <p> { `${chapter?.title} Page ${page.id}` } </p> */}
                            <img src={ page.src } alt={ `${chapter?.title} Page ${page.id}` }/>
                            <p className="page-num">{ i + 1 }</p>
                        </div>
                    ))
                }
            </div>
            <ChapterNav chapter={ chapter }/>
            <PageCounter currPage={ currPage } totalPages={ chapter?.pages.length }/>
        </>
    );
}