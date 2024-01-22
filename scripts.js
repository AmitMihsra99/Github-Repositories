document.addEventListener('DOMContentLoaded', () => {
    const ApiUrl = "https://api.github.com/users/";
    const main = document.querySelector("#main");
    let RepoData = [];
    let itemsPerPage = 9;
    let currentPage = 1;
    let currentUsername = "";

    const NextBtn = () => {
        const totalPages = Math.ceil(RepoData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderReposPerPage();
        }
    }

    const PrevBtn = () => {
        if (currentPage > 1) {
            currentPage--;
            renderReposPerPage();
        }
    };

    const formSubmit = (e) => {
        e.preventDefault();
        const searchbox = document.querySelector("#search");

        if (searchbox.value !== "") {
            getUser(searchbox.value);
        }

        return false;
    };

    const getRepos = async (username) => {
        const response = await fetch(`${ApiUrl}${username}/repos?per_page=1000`);
        const data = await response.json();
        RepoData = data;
        console.log(data);

        renderReposPerPage();
    };

    const getUser = async (username) => {
        const response = await fetch(ApiUrl + username);
        const data = await response.json();

        const card = `<div class="responsive-section">
            <div class="left-side">
                <img class="image" src="${data.avatar_url}" alt="User Image">
            </div>
            <div class="right-side">
                <h1>${data.name}</h1>
                <h2>Company: ${data.company}</h2>
                <h2>Bio: ${data.bio}</h2>
                <h3>Followers: ${data.followers}</h3>
                <h3>Following: ${data.following}</h3>
                <h3>Public Repos: ${data.public_repos}</h3>
                <div class="social-links">
                    <h4>
                        <a href="${data.twitter_username}" target="_blank">Twitter-link</a>
                        <a href="${data.html_url}" target="_blank">GitHub-link</a>
                    </h4>
                </div>
            </div>
        </div>
        <div id="repos"></div>`;
        main.innerHTML = card;
        currentUsername = username;
        await getRepos(currentUsername);
        renderReposPerPage();
    };

    const renderReposPerPage = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, RepoData.length);
        const reposToShow = RepoData.slice(startIndex, endIndex);
        renderRepos(reposToShow);

        // Display the current page in the DOM
        const currentPageElement = document.getElementById("currentPage");
        currentPageElement.innerText = `Page ${currentPage}`;
    };


    const init = () => {
        getUser("taylorotwell");

        document.getElementById("prevBtn").addEventListener("click", PrevBtn, false);
        document.getElementById("nextBtn").addEventListener("click", NextBtn, false);

        const form = document.querySelector("#search-form");
        form.addEventListener("submit", formSubmit);
    };

    init();

    const renderRepos = (repos) => {
        const reposContainer = document.querySelector("#repos");
        reposContainer.innerHTML = '';

        repos.map((repo) => {
            const repoCard = document.createElement("div");
            repoCard.classList.add("Repos-card");

            repoCard.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${repo.description || "No description available"}</p>
                <div class="tags">
                    <h4>Size- ${repo.size}</h4>
                    <h4>${repo.language || "React.js"}</h4>
                    <h4>${repo.visibility || "private"}</h4>
                    <h4>Watchers- ${repo.watchers_count}</h4>
                    <h4>Forks- ${repo.forks_count}</h4>
                </div>
            `;

            reposContainer.appendChild(repoCard);
        });
    };
});
