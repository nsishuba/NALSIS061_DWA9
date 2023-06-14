/**
 * Made use of factory functions to create an object that encapsulates the function.
 * Encapsulation was applied to the createPreview function, createOptionsElement and createOptionsFragment. 
 */

import { books, authors, genres, BOOKS_PER_PAGE } from './modules/data.js';
import { createOptionsFactory } from './modules/createOptions.js';
import { setTheme } from './modules/theme.js';
// import { getHtml } from './modules/helpers.js'

let page = 1;
let matches = books

//Creates a list of preview elements and appends them to the document
const createPreviewFactory = () => {
    const fragment = document.createDocumentFragment()

    const createPreview = () => {
        for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)

            element.innerHTML = `
                <img
                    class="preview__image"
                    src="${image}"
                />
                
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `

            fragment.appendChild(element)
        }
            return fragment;
    }
    return {
        createPreview
    }
}
//encapsulation
const listPreviewFactory = createPreviewFactory();
const listPreviewFragment = listPreviewFactory.createPreview();
document.querySelector('[data-list-items]').appendChild(listPreviewFragment) //call function
//encapsulation
const optionsFactory = createOptionsFactory();

const genreHtml = document.createDocumentFragment()
genreHtml.appendChild(optionsFactory.createOptionsElement('any', 'All Genres'))
genreHtml.appendChild(optionsFactory.createOptionsFragments(genres)) 
document.querySelector('[data-search-genres]').appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
authorsHtml.appendChild(optionsFactory.createOptionsElement('any', 'All Authors'))
authorsHtml.appendChild(optionsFactory.createOptionsFragments(authors))
document.querySelector('[data-search-authors]').appendChild(authorsHtml)

//sets initial theme based on settings of the users device.
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    setTheme('night') //call function 
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    setTheme('day') //call function
}

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)
    //sets theme based on settings selected by user within BookConnect
    setTheme(theme)
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''

    document.querySelector('[data-list-items]').appendChild(createPreview()) //call function
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    document.querySelector('[data-list-items]').appendChild(createPreview()) //call function
    page += 1
})

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})