import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import _ from 'lodash';
import { verifyChapter } from '../../util/imgbb';
import { previewChapter } from '../../components/';
import './HomeView.scss';

export function HomeView () {
    
    const saved = localStorage.getItem('savedChapters');
    const [ savedChapters, setSavedChapters ] = useState(saved ? saved.split(',') : []);
    const [ chapterPreviews, setChapterPreviews ] = useState({});
    const [ shouldShowError, setShouldShowError ] = useState(false);
    const [ val, setVal ] = useState('');
    const history = useHistory();

    useEffect(async function () {
        console.info('Updated saved chapters: ' + savedChapters);
        console.info('Number of saved chapters: ' + savedChapters.length);
        localStorage.setItem('savedChapters', savedChapters.join(','));
        const chapters = await Promise.all(
            savedChapters.map((c, i) => previewChapter(c, i, savedChapters, setSavedChapters))
        );
        setChapterPreviews(_.groupBy(chapters, chapterPreview => chapterPreview.props.chapter.mangaTitle));
    }, [ savedChapters ]);

    function viewChapter (id: string) {
        verifyChapter(id, 
            function () {
                history.push(`/chapter/${val}`);
            },
            function () {
                setShouldShowError(true);
            }
        );
    }
    
    function saveChapter (id: string) {
        if (!savedChapters.includes(id)) {
            verifyChapter(id, 
                function () {
                    setSavedChapters(_.concat(savedChapters, id));
                    setShouldShowError(false);
                },
                function () {
                    setShouldShowError(true);
                }
            );
        }
    }

    return (
        <>
            <div className="actions">
                <h1>Shiori</h1>
                <input type="text" placeholder="Enter an ibb album ID (e.g. TWNhqf)" onInput={ (evt) => setVal(evt.target.value) }></input>
                <a onClick={ () => viewChapter(val) }>View Chapter</a>
                <a onClick={ () => saveChapter(val) }>Save Chapter</a>
                <a onClick={ () => [ localStorage.clear(), location.reload() ] }>Clear Saved</a>
                {
                    shouldShowError &&
                    <p className="error">Invalid album ID.</p>
                }
            </div>
            <div className="saved-chapters">
                <h1>Saved Chapters</h1>
                {
                    Object.entries(chapterPreviews).map(([ mangaTitle, chapter ], i) => (
                        mangaTitle === 'undefined' ? chapter : (
                            <div key={ i } className="manga-preview">
                                <h2>{ mangaTitle }</h2>
                                { chapter }
                            </div>
                        )
                    ))
                }
            </div>
        </>
    );
}