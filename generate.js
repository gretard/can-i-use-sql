console.log('aa');
var fs = require('fs');
const baseDir = 'data';
const items = [];
const dbs = [];

fs.readdirSync(baseDir).forEach(db => {
    const dbDir = `${baseDir}/${db}`;
    fs.readdirSync(dbDir).forEach(dbVersion=> {
        dbs.push(`${db}_${dbVersion}`.toLowerCase());
    });
});

fs.readdirSync(baseDir).forEach(db => {
    const dbDir = `${baseDir}/${db}`;
    fs.readdirSync(dbDir).forEach(dbVersion=> {
        console.log(db, dbVersion);
        const dbFiles = `${dbDir}/${dbVersion}`;
        fs.readdirSync(dbFiles).forEach(file => {
            if (file.startsWith("_")) {
                return;
            }
            const dbFile = `${dbFiles}/${file}`;
            fs.readFileSync(dbFile, 'utf-8').split(/\r?\n/).forEach(line => {
                if (line.startsWith("//")) {
                    return;
                };
                const supportedDb = `${db}_${dbVersion}`.toLowerCase();
                const name = line.split(/\t/)[0].replace('(', '').replace(')', '').trim();
                if (name.length === 0) {
                    return;
                }

                const key = name.toLowerCase();
                const item = items.find(x=>x.key === key);
                if (item === undefined) {
                    items.push({
                        name,
                        key,
                        "types": [file],
                        "supportedBy": [
                            supportedDb
                        ]
                    });
                    return;
                }
                item.supportedBy.push(supportedDb);
                item.types.push(file);
            });
        })

    })
});
dbs.sort();
console.log("final", items.filter(x=>x.supportedBy.length > 1), dbs);
const contents = [];
contents.push("<table>");
contents.push("<tr>");
contents.push(`<td>Name</td>`);
dbs.forEach(x=> {
    contents.push(`<td>${x}</td>`);
});
contents.push("</tr>");

items.forEach(item => {
    contents.push("<tr>");
    contents.push(`<td>${item.name}</td>`);

    dbs.forEach(x=> {
        const supported = item.supportedBy.find(db => db === x);
        if (supported) {
            contents.push(`<td>Y</td>`);
            return;

        }
        contents.push(`<td>N</td>`);
    });


    contents.push("</tr>");

});



contents.push("</table>");

const template =  fs.readFileSync("./app/template.html", 'utf-8');
fs.writeFile('app/index.html', template.replace("{}", contents.join('\r\n')), err => {
    if (err) {
      console.error(err);
    }
  });