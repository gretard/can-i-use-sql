console.log('aa');
var fs = require('fs');
const baseDir = 'data';
const items = [];
const dbs = [];

fs.readdirSync(baseDir).forEach(db => {
    const dbDir = `${baseDir}/${db}`;
    fs.readdirSync(dbDir).forEach(dbVersion => {
        dbs.push(`${db}_${dbVersion}`.toLowerCase());
    });
});
dbs.sort();

fs.readdirSync(baseDir).forEach(db => {
    const dbDir = `${baseDir}/${db}`;
    fs.readdirSync(dbDir).forEach(dbVersion => {
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
                const functions = line.split(/\t/)[0].split(',');
                functions.forEach(fun => {
                    const name = fun.replace('(', '').replace(')', '').trim();
                    if (name.length === 0) {
                        return;
                    }
                    const key = name.toLowerCase();
                    const item = items.find(x => x.key === key);
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
            });
        })

    })
});

const contents = [];
contents.push("<table>");
contents.push("<thead>");
contents.push("<tr>");
contents.push(`<th>Name</th>`);
dbs.forEach(x => {
    contents.push(`<th>${x}</th>`);
});
contents.push("</tr>");
contents.push("</thead>");
contents.push("<tbody>");
items.forEach(item => {
    contents.push("<tr>");
    contents.push(`<td>${item.name}</td>`);

    dbs.forEach(x => {
        const supported = item.supportedBy.find(db => db === x);
        if (supported) {
            contents.push(`<td>Y</td>`);
            return;
        }
        contents.push(`<td>N</td>`);
    });
    contents.push("</tr>");
});
contents.push("</tbody>");
contents.push("<tfoot class='hidden'>");
contents.push("<tr>");
contents.push(`<td colspan=${dbs.length + 1}>No results found, please check search</td>`);
contents.push("</tr>");
contents.push("</tfoot>");
contents.push("</table>");

const template = fs.readFileSync("./app/template.html", 'utf-8');
fs.writeFile('app/index.html', template.replace("{}", contents.join('\r\n')), err => {
    if (err) {
        console.error(err);
    }
});
