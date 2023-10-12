/**
 * Provides methods for interacting with images server.
 */
class Service {

    /**
     * Creates the image service.
     */
    constructor() {
        this.server = 'http://127.0.0.1:3000';
        this.resource = 'images';
        this.baseUrl = `${this.server}/${this.resource}`;
    }

    /**
     * Gets all images.
     * 
     * @returns A promise that resolves to an array of images.
     */
    getAll() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', this.baseUrl, true);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.onload = () => resolve(JSON.parse(xhr.responseText));
            xhr.onerror = () => reject(xhr.status);

            xhr.send();
        });
    }

    /**
     * Saves an image.
     * 
     * @param {String} dataurl The 'data-url' representation of the image. 
     * @returns A promise that resolves to the saved image.
     */
    save(dataurl) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('POST', this.baseUrl, true);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => resolve(JSON.parse(xhr.responseText));
            xhr.onerror = () => reject(xhr.status);

            xhr.send(JSON.stringify({dataurl}));
        });
    }

    /**
     * Deletes an image by its ID.
     * 
     * @param {Number} id The ID of the image.
     * @returns A promise that resolves to nothing.
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('DELETE', `${this.baseUrl}/${id}`, true);
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.onload = () => resolve();
            xhr.onerror = () => reject(xhr.status);

            xhr.send();
        });
    }
}