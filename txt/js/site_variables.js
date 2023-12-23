const website_name = 'Jims Code Blog';
const website_url = "https://www.jimscode.blog";
const gen_stars = () => {
    const stars = 600;
    const smallStarCount = Math.floor(stars * 0.9); // 90% of stars are small

    const randomPosition = (innerwidth, innerheight) => {
        return [Math.floor(Math.random() * innerwidth), Math.floor(Math.random() * innerheight)]
    }
    const in_width = window.innerWidth;
    const in_height = window.innerHeight;
    const star_div = document.getElementById('star-area');
    star_div.innerHTML = "";
    for (let i = 0; i < stars; i++) {
        let [x, y] = randomPosition(in_width, in_height);
        let star = document.createElement('div');
        star.className = 'stars';
        star.style.top = y + 'px';
        star.style.left = x + 'px';
        star.style.borderRadius = '100%';
        star.style.zIndex = 1;
        let rand_num = Math.floor(Math.random() * 10); // generate a number between 0 and 9
        if (i < smallStarCount) {
            // 90% of stars are between 1 and 3 pixels
            star.style.width = rand_num < 4 ? rand_num + 'px' : '2px';
            star.style.height = rand_num < 4 ? rand_num + 'px' : '2px';
        } else {
            // 10% of stars are between 4 and 6 pixels
            star.style.width = rand_num < 5 ? (rand_num + 3) + 'px' : '2px';
            star.style.height = rand_num < 5 ? (rand_num + 3) + 'px' : '2px';
        }
        star_div.append(star);
    }
}

let stars_generated = false;
const toggle_nightmode = () => {
    if (!stars_generated) {
        gen_stars();
        window.addEventListener("resize", gen_stars);
        stars_generated = true;
    }
}

