const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazyload');
        observer.unobserve(img);
        }
    });
    }, {
    rootMargin: '0px',
    threshold: 0.1
});
const lazyloadImages = document.querySelectorAll('.lazyload');
lazyloadImages.forEach(img => {
    observer.observe(img);
});


document.getElementById('day').addEventListener('click', updateThemeCache);
document.getElementById('night').addEventListener('click', updateThemeCache);
document.getElementById('search').addEventListener('keypress', event => event.key === 'Enter' ? (event.preventDefault(), search()) : null);
