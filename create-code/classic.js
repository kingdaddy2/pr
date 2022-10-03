const Discord = require("discord.js"),
Eris = require('eris'),
  nodeHtmlToImage = require("node-html-to-image"),
  config = require("../config.json"),
  puppeteer = require("puppeteer"),
  express = require("express"),
  fetch = require('node-fetch'),
  app = express()
  const port = 3246;

let client = Eris(config.token)
var datatosend;
const mongoose = require("mongoose")

    let r = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

   app.get("/", function(e, t) {
      t.send(datatosend);
    });
// r.close
var mime = require("mime"),
  fs = require("fs"),
  path = require("path");
async function nitrogenerator(usernameAuthor, avatarAuthor, username, thank, avatar, channel, authorID) {



  let a = formatAMPM(new Date());
  let n = formatAMPM(new Date(Date.now() - 6e4)),
    o = await fs.readFileSync(`./html/testing.html`, "utf8");
  (datatosend = o),
    (datatosend = datatosend.replace(
      "FIRSTAUTHORURL",
      avatarAuthor
    )),
    (datatosend = datatosend.replace("THEFIRSTAUTHOR", usernameAuthor)),
    (datatosend = datatosend.replace(
      "SECONDAUTHORURL",
      avatar
    )),
    (datatosend = datatosend.replace("THESECONDAUTHOR", username)),
    (datatosend = datatosend.replace("RESPONSETONITRO", thank)),
    (datatosend = datatosend.replace("FIRSTAUTHORDATE", "Today at " + n)),
    (datatosend = datatosend.replace("SECONDAUTHORDATE", "Today at " + a))
 
 

  const s = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }),
    i = await s.newPage();
  await i.goto(`http://localhost:${port}`),
    await i.waitForSelector(".scrollerInner-2YIMLh");
  const d = await i.$(".scrollerInner-2YIMLh");
  let c = await d.screenshot({ type: "png" });
  await s.close();
  const l = new Discord.MessageAttachment(c, "NitroProof.png");
  return client.createMessage(channel, `<@${authorID}>`, [{file:l.attachment, name: l.name}])
}
function formatAMPM(e) {
  var t = e.getHours(),
    a = e.getMinutes(),
    n = t >= 12 ? "PM" : "AM";
  return (t = (t %= 12) || 12) + ":" + (a = a < 10 ? "0" + a : a) + " " + n;
}
client.on("ready", () => {

  console.log("Online.");
});


  client.on("messageCreate", async e => {
let message = e
let msg = e
if(e.author.bot || !e.channel.guild) return;
fetch(('https://setting-premium.glitch.me/data/' + client.user.id) , {method: 'GET', headers: { 'Content-Type': 'application/json' }, referrerPolicy: "no-referrer"}).then(async gts =>{
  let json = await gts.json();
if(!json.time) return;
if(!e.content.startsWith(`${json.prefix}classic`) && !e.content.startsWith(`${json.prefix}create-classic`)) return;
if(json.time - Date.now() < 1) return client.createMessage(msg.channel.id, `**You Must renew your bot to be able to use it**`)
if(!json.whitelist.includes(e.author.id) && msg.author.id !== json.owner) return client.createMessage(msg.channel.id, `**Ask The Owner To Add You To The Whitelist**`)
const args = e.content.slice(json.prefix.length).trim().split(/ +/),
 commandName = args.shift().toLowerCase();
if(commandName === "classic"){
    var argss = message.content.split(`,`)
var users = []
for(const data of client.users) users.unshift(data[0])
let user = client.users.get(users[Math.floor(Math.random() * users.length)])
if(!user) return await nitrogenerator(msg.author.username, msg.author.avatarURL, argss[0].replace(json.prefix + 'classic', ''), argss[1], msg.author.avatarURL, msg.channel.id, msg.author.id)

await nitrogenerator(msg.author.username, msg.author.avatarURL, argss[0].replace(json.prefix + 'classic', ''), argss[1], user.avatarURL, msg.channel.id, msg.author.id)

}
if(commandName === "create-classic"){

var username;
var avatarAuthor;
var thank;
var dn = false
client.createMessage(msg.channel.id, `Enter Username Of Fake user`)
  client.on("messageCreate", async msg1 => {
if(dn || msg1.author.id !== msg.author.id || msg.channel.id !== msg1.channel.id) return;
if(!username){
username = msg1.content
client.createMessage(msg.channel.id, `Enter Link Avatar Of Fake user`)
}else
if(!avatarAuthor){
avatarAuthor = msg1.content
client.createMessage(msg.channel.id, `Enter Message Of Fake User`)
}else
if(!thank){
thank = msg1.content
dn = true
await nitrogenerator(msg.author.username, msg.author.avatarURL, username, thank, avatarAuthor, msg.channel.id, msg.author.id)
}

})
}

})
  }),

  client.connect();
