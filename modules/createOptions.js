export const createOptionsFactory = () => {
    /**
     * 
     * This function creates an option element and sets the parameters to the 
     * element value and inner text.
     * @param {string} id 
     * @param {string} name 
     * @returns {HTMLElement}
     */
    const createOptionsElement = (id, name) => {
        const element = document.createElement('option')
            element.value = id
            element.innerText = name
        return element 
    };
    /**
     * 
     * This function generates a document fragment which holds the option element.
     * The element will be populated with key-value pairs from data object.
     * @param {Object} data Extracts genres or authors from data.js
     * @returns Populated document fragment
     */ 
    const createOptionsFragments = (data) => {
        const fragment = document.createDocumentFragment();

        for (const [id, name] of Object.entries(data)) {
            fragment.appendChild(createOptionsElement(id, name))
        }
        return fragment
    };

    return {
        createOptionsElement,
        createOptionsFragments
    };
};