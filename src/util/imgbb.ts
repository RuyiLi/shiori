const CORS_PROXY_URL = 'https://jsonp.afeld.me/?url=';
const ALBUM_BASE_URL = 'https://ibb.co/album/';

function firstNumFromStr (s: string): number {
    let num = '';
    for (let i = 0; i < s.length; i++) {
        if ('0' <= s[i] && s[i] <= '9') {
            num += s[i];
        } else if (num !== '') {
            break;
        }
    }
    return Number(num);
}

const titleRegex = /^(.+)\sCh(\.|apter)\s(\d+)$/;
function fetchMangaDataFromChapter (chapterTitle) {
    const ret = titleRegex.exec(chapterTitle);
    if (ret) {
        return {
            mangaTitle: ret[1],
            mangaChapter: Number(ret[3]),
        }
    }
    return null;
}

export class Chapter {
    title: string;
    desc: string;
    author: string;
    pages: Page[];

    mangaTitle: string | null;
    mangaChapter: number | null;

    constructor (html: string) {
        const fetcher = document.createElement('div');
        fetcher.innerHTML = html;

        const title: HTMLElement = fetcher.querySelector('[data-text="album-name"]');
        const desc: HTMLElement = fetcher.querySelector('[data-text="album-description"]');
        const author: HTMLElement = fetcher.querySelector('[rel="author"]');
        const images: HTMLElement[] = Array.from(fetcher.querySelectorAll('div[data-type="image"]'));

        this.title = title.title || title.textContent;
        this.desc = desc.textContent;
        this.author = author.textContent;
        this.pages = images.map(Page.asPage).sort(Page.compare);

        const mangaDetails = fetchMangaDataFromChapter(this.title);
        if (mangaDetails) {
            this.mangaTitle = mangaDetails.mangaTitle;
            this.mangaChapter = mangaDetails.mangaChapter;
        }
    }
}

class Page {
    id: number;
    src: string;

    constructor (el: HTMLElement) {
        const id = el.querySelector('[data-text="image-title"]').textContent;
        const src = (el.querySelector('.image-container > img') as HTMLImageElement).src;

        this.id = firstNumFromStr(id);
        this.src = src;
    }

    static asPage (el: HTMLElement) {
        return new Page(el);
    }

    static compare (page: Page, other: Page) {
        return page.id - other.id;
    }
}

async function fetchChapter (albumID: string) {
    // https://ibb.co/album/cDsYKF
    const url: string = CORS_PROXY_URL + ALBUM_BASE_URL + albumID;
    const html: string = await fetch(url).then(res => res.text());
    return new Chapter(html);
}

function verifyChapter (albumID: string, cbIfOk: CallableFunction, cbIfFail: CallableFunction) {
    fetchChapter(albumID)
        .then(() => cbIfOk())
        .catch(() => cbIfFail());
}

async function fetchUser (username: string) {

}

export {
    fetchChapter,
    fetchUser,
    verifyChapter,
}