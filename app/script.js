document.getElementById('searchForm').onsubmit = (e) => {
    const searchStrig = document.getElementById('search').value.toLowerCase();
    e.preventDefault();
    const all = Array.from(document.querySelectorAll('tbody tr td:first-child'));
    const foundItems = all.filter(el => el.textContent.toLowerCase().includes(searchStrig));
    all.forEach(item => {
        const parent = item.parentNode;
        if (foundItems.includes(item)) {
            parent.classList.remove("hidden");
        } else {
            parent.classList.add("hidden");
        }
    })
};

