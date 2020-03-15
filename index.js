const program = require("commander");
const { exec } = require('child_process');
const fs = require('fs');
var rimraf = require("rimraf");

// console.log(process.argv)
program.name("fcra")
    .usage("<app-name>").on('--help', () => {
        console.log('');
        console.log('Example call:');
        console.log('  $ fcra @aicc/manager-app');
        console.log('');
    }).version("0.0.1")

program.parse(process.argv);

// console.log(process.argv.length)
if (process.argv.length < 3) {
    console.log("!!! Please input appName !!!");
    console.log("");
    exec("node ./index.js --help", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    })

    return;
}

const appName = process.argv[2];


fs.access(`./${appName}`, fs.constants.F_OK, (err) => {
    // console.log(`${file} ${err ? 'does not exist' : 'exists'}`);

    if (!err) return console.log(`${appName} exists`);


    exec(`git clone https://github.com/ljharb/qs.git ./${appName}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);

        // delete .git dir
        rimraf(`./${appName}/.git`, function () {
            // console.log(`delete ./${appName}/.git dir done`);
        });

        const appPackage = require(`./${appName}/package.json`);
        // console.log(appPackage.name);
        // TODO 引入 npm scope 机制，使其能在yarn workspace下工作
        appPackage.name = `${appName}`;
        // console.log(appPackage.name);
        rimraf(`./${appName}/package.json`, function () {
            // console.log(`delete ./${appName}/package.json dir done`);

            fs.writeFile(`./${appName}/package.json`,JSON.stringify(appPackage, null, '\t'),(err)=>{
                if(err) return console.log(err);
                console.log(`update ./${appName}/package.json done`);
            })

        });

    })

});