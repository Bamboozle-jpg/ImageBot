//Setup
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const request = require('request');
const keyy = JSON.parse(fs.readFileSync('./key.JSON'));
const key = keyy.key;
const exec = require('child_process').exec;

//Reads file with token and logs in
const info = JSON.parse(fs.readFileSync('./token.JSON'))
const token = info.token
bot.login(token);

function getImageURL(Term, msg) {
    const term = Term
    request(`https://customsearch.googleapis.com/customsearch/v1?cx=011238257645850637911:in4mq50obk2&exactTerms=${term}&key=${key}&searchType=image&num=1`, { json: true }, (err, res, body) => {
        console.log(body);
        if (body.searchInformation.totalResults == 0) {
            msg.channel.send("No results for " + term);
        } else {
            const link = body.items[0].link;
            msg.channel.send({
                "embed": {
                  "image": {
                    "url": `${body.items[0].link}`
                  }
                }
            });
            const fileFormat = body.items[0].fileFormat.substring(6);
            exec(`curl ${link} > image.${fileFormat}`);
        }
    });
}

bot.on('message', msg=> {
    if (msg.content.slice(0, 6) === '.image') {
        getImageURL(msg.content.slice(7, msg.content.lenght), msg);
    }
})