import React from 'react';

import { Link } from 'react-router-dom';
import { fetchChapter } from '../../util/imgbb';
import _ from 'lodash';

import './ChapterPreview.scss';

export function ChapterPreview (props) {
    function deleteThis () {
        props.setSavedChapters(_.without(props.savedChapters, props.id));
    }

    const previewStyle = { backgroundImage: `url('${props.chapter.pages[0].src}')` };
    return (
        <div className="chapter-card" style={ previewStyle }>
            <Link to={ `/chapter/${props.id}` } className="chapter-card--link">
                <div className="chapter-card--cover">
                    <h1>{ props.chapter.title }</h1>
                </div>
            </Link>
            <span className="delete" onClick={ deleteThis }>X</span>
        </div>
    )
}

export async function previewChapter (chapterAlbumID, idx, savedChapters, setSavedChapters) {
    const chapter = await fetchChapter(chapterAlbumID);
    return (
        <ChapterPreview key={ idx } chapter={ chapter } id={ chapterAlbumID }
        savedChapters={ savedChapters } setSavedChapters={ setSavedChapters }/>
    )
}