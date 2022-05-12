let fullData = {};

const showData = (data) => {

};

// load results
fetch('data.json')
    .then(r => r.json())
    .then(jsonData => {
            fullData = jsonData;
    });

document.getElementById('searchForm').onsubmit = (e) => {
    const searchStrig = document.getElementById('search').value.toLowerCase();
    e.preventDefault();
    const found = fullData.items.filter(x=>x.name.toLowerCase().includes(searchStrig));
    console.log('serach', found);
};

