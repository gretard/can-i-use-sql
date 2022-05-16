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
    } else {
        tableFooter.classList.remove(hiddenNodeClass);
    }
};

const applyTableFilter = (e) => {
    tableFooter.classList.add(hiddenNodeClass);

    const type = e.target.value?.toUpperCase();
    const dataIndex = e.target.getAttribute('data-index');
    if (type === 'R') {
        const rows = document.querySelectorAll(`tbody tr`);
        rows.forEach(row => {
            row.classList.remove(hiddenNodeClass);

        });
        return;
    };
    const nodes = document.querySelectorAll(`tbody tr td:nth-child(${dataIndex})`);
    nodes.forEach(node => {
        const parent = node.parentNode;
        if (node.innerText !== type) {
            parent.classList.add('hidden');
        }
    });

}

document.getElementById('searchForm').onsubmit = (e) => {
    e.preventDefault();
    searchNodes();
};

document.getElementById('resetBtn').onclick = resetNodes;
document.querySelectorAll('select').forEach(node => {
    node.onchange = applyTableFilter;
});