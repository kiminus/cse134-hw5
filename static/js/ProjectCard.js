"use strict";
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
article {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    background: white;
    overflow: hidden;
    padding: 20px;
    width: 300px;
}
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

#header-left {
    display: flex;
    align-items: center;
}

#avatar {
    width: 40px;
    height: 40px;
    background: #d1c4e9;
    color: white;
    font-size: 18px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin: 0 10px 0 0;
}

.title-section {
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
}

.subtitle {
    font-size: 12px;
    color: gray;
    margin: 0;
}

#menu-icon {
    font-size: 18px;
    cursor: pointer;
}

.image-container {
    margin: 0;
    & img {
        width: 100%;
        height: auto;
        border-radius: 6px;
    }
}

#content {
    margin: 10px 0 10px 0;
}

#article-desc {
    font-size: 14px;
    color: gray;
}

footer {
    margin-top: 5px;
    text-align: center;
}

#page-link {
    display: inline-block;
    padding: 10px 16px;
    background: #6a4c93;
    color: white;
    text-decoration: none;
    font-size: 14px;
    border-radius: 20px;
    transition: background 0.3s ease-in-out;
    text-align: right;
}

#page-link:hover {
    background: #573b7a;
}
            </style>
            <article>
                <header>
                    <section id="header-left">
                        <figure id="avatar">A</figure>
                        <div class="title-section">
                            <h2 class="title">Article Title</h2>
                            <h4 class="subtitle">Article Subtitle</h4>
                        </div>
                    </section>
                    <aside id="menu-icon">⋮</aside>
                </header>
            
                <figure class="image-container">
                    <img src="https://picsum.photos/260/130" alt="Article image">
                </figure>
            
                <section id="content">
                    <p id="article-desc">Article description</p>
                </section>
            
                <footer>
                    <a id="page-link" href="https://example.com" target="_blank">
                        Go To Page
                    </a>
                </footer>
            </article>

        `;
        const avatar = this.shadowRoot.getElementById('avatar');
        const title = this.shadowRoot.querySelector('.title');
        const subtitle = this.shadowRoot.querySelector('.subtitle');
        const menuIcon = this.shadowRoot.getElementById('menu-icon');
        const image = this.shadowRoot.querySelector('.image-container img');
        const articleDesc = this.shadowRoot.getElementById('article-desc');
        const pageLink = this.shadowRoot.getElementById('page-link');
        const articleTitle = this.getAttribute('title') || "Unnamed";
        const articleSubtitle = this.getAttribute('subtitle') || "";
        const articleImage = this.getAttribute('src') || "https://picsum.photos/200/100";
        const articleDescription = this.getAttribute('desc') || "No description available";
        const articleLink = this.getAttribute('href') || "#";
        title.innerText = articleTitle;
        subtitle.innerText = articleSubtitle;
        image.src = articleImage;
        articleDesc.innerText = articleDescription;
        pageLink.href = articleLink;
        avatar.innerText = articleTitle.charAt(0).toUpperCase();
        avatar.style.setProperty('background-color', this.getBackgroundColor(articleTitle));
    }
    getBackgroundColor(fullName) {
        var _a;
        if (!fullName)
            return "#0000FF"; // Equivalent to Color.Blue
        try {
            // Extract uppercase letters using regex
            const result = ((_a = fullName.match(/[A-Z]/g)) === null || _a === void 0 ? void 0 : _a.join("")) || "";
            let hash = 1;
            if (result.length > 1) {
                hash = (result.charCodeAt(0) - 64) * 100 + result.charCodeAt(1) - 64;
                // Predefined color palette
                const colors = [
                    "#008000", "#0000FF", "#800080", "#800080", "#FF00FF", "#008080", "#FFFF00", "#808080", "#00FFFF",
                    "#000080", "#800000", "#FF3939", "#7F7F00", "#C0C0C0", "#FF6347", "#FFE4B5", "#33023", "#B8860B",
                    "#C04000", "#6B8E23", "#CD853F", "#C0C000", "#228B22", "#D2691E", "#808000", "#20B2AA", "#F4A460",
                    "#00C000", "#8FBC8B", "#B22222", "#843A05", "#C00000"
                ];
                const max = (('Z'.charCodeAt(0) - 64) * 100 + 'Z'.charCodeAt(0) - 64);
                const index = Math.floor((hash / max) * colors.length);
                return colors[index];
            }
        }
        catch (_b) {
            // Fail-safe return
        }
        return "#0000FF"; // Equivalent to Color.Blue
    }
}
customElements.define('project-card', ProjectCard);
