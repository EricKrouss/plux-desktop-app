import { posts } from './data.js';
import { users } from './data.js';

export function loadUsername() {
    let userElements = document.getElementsByClassName('username');
    for (let element of userElements) {
        element.innerHTML = element.innerHTML.replace('user.name', posts.post1.userId);
    }
}

export function loadPosts() {
    let postElements = document.getElementsByClassName('post');
    for (let element of postElements) {
        element.innerHTML = element.innerHTML.replace('user.post', posts.post1.post);
    }
}

// Call functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadUsername();
    loadPosts();
});