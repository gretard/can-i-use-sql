const allNodes = Array.from(document.querySelectorAll('tbody tr td:first-child'));
const searchTextNode = document.getElementById('searchText');
const tableFooter = document.getElementsByTagName('tfoot')[0];
const hiddenNodeClass = 'hidden';

const resetNodes = () => {
    allNodes.forEach(item => {
        const parent = item.parentNode;
        parent.classList.remove(hiddenNodeClass);
    });
    tableFooter.classList.remove(hiddenNodeClass);
};

const searchNodes = () => {
    const searchString = searchTextNode.value.toLowerCase();
    const foundItems = allNodes.filter(el => el.textContent.toLowerCase().includes(searchString));
    let anyFound = false;
    allNodes.forEach(item => {
        const parent = item.parentNode;
        if (foundItems.includes(item)) {
            parent.classList.remove('hidden');
            anyFound = true;
        } else {
            parent.classList.add('hidden');
        }
    });
    if (anyFound) {
        tableFooter.classList.add(hiddenNodeClass);
    }else {
        tableFooter.classList.remove(hiddenNodeClass);
    }
};

document.getElementById('searchForm').onsubmit = (e) => {
    e.preventDefault();
    searchNodes();
};

document.getElementById('resetBtn').onclick = resetNodes;