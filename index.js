const mongoose = require("mongoose")

let ms = require('ms')
const pms = require("pretty-ms")
let express = require('express')
const got = require('got');
let data = require('./create-code/nitro.js')
data
let datas = require('./create-code/classic.js')
datas
let fs = require('fs')
let app = express()
const imageToBase64 = require('image-to-base64');

const { ReactionCollector, MessageCollector } = require("eris-collector");

app.get('/', async (req, res) =>{
res.sendStatus(200)
})
let Eris = require('eris')
const port = 3000;
mongoose.connect("mongodb+srv://yousuf:41371755aa@cluster0.muke2.mongodb.net/data" , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    });

const collection = mongoose.model("premium", new mongoose.Schema({
            _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
            "id": { type: String } ,
            "prefix": { type: String, default: "$" },
            "guild": { type: String, default: "none" },
            "owner": { type: String },
            "time": {type: Number },
            "invite": {type: String },
            "status": {type: String, default: "online" },
            "game": {type: String, default: "[none]"  },
            "white": {type: Array, default: [] }
}));
  mongoose.connection.on('connected', async () =>{
      console.log('Mongoose has successfully connected!')

    });

var listen = false
if(!listen){
listen = true
app.listen(port);
}
const bodyParser = require('body-parser');
let config = JSON.parse(fs.readFileSync("./config.json", "utf8"))
app.use(bodyParser.json());

let client = Eris(config.token, {restMode:true})
setInterval(async () => {
let config = await collection.find({id: client.user.id})
if(config.length < 1) return;
for(const guild of client.guilds){
if(guild[0] !== config[0].guild) client.leaveGuild(guild[0])
if(guild[0] === config[0].guild && config[0].time < 1) client.leaveGuild(guild[0])
}
}, 10000)
client.on('ready', async () =>{
console.log('Ready')

let config = await collection.find({id: client.user.id})
if(config.length < 1) return;
await client.editStatus(config[0].status, {
name: config[0].game.replace('[none]', ''),
type: 0, // 0 playing , 1 stream , 2 listen , 3 watch
url: null // رابط الستريم لو فيه
})


})
client.on('messageCreate', async (message) => {
	if (message.author.bot || !message.channel.guild) return;
let msg = message
let config = await collection.find({id: client.user.id})
if(!config[0]) config[0] = {prefix: "$", guild: "none"}
	let args = message.content.slice(config[0].prefix.length).trim().split(/ +/);
if(!message.content.startsWith(config[0].prefix)) return;
	let commandName = args.shift().toLowerCase();
if(!config[0] || config[0].guild !== message.channel.guild.id && commandName !== "create") return;
if(commandName === "list"){
  var msgs = ``
  let config = await collection.find({id: client.user.id})
  if(config.length < 1 || config[0].time - Date.now() < 1) return;
 
  for(const id of config[0].white) msgs = msgs + `\`-\` <@${id}> (${id})\n`
  
  client.createMessage(msg.channel.id, `${msgs || "**There is no one in the whitelist , To add someone use the command `add`**"}`)
}
if(commandName === "ping"){
let config = await collection.find({id: client.user.id})
if(config.length < 1 || config[0].time - Date.now() < 1) return;
let pingdbold = Date.now()  
let testpingdb = await collection.find({id: client.user.id})

let pingdb = Date.now() - pingdbold 
let clientping = Date.now()
client.createMessage(msg.channel.id, `pong`).then(msgs =>{
msgs.edit(`**Database**: ${pingdb}\n**Client**: ${msgs.timestamp - clientping}`)
})


}

if(commandName === "remove"){

  
let config = await collection.find({id: client.user.id})
if(config.length < 1 || config[0].time - Date.now() < 1) return;
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)

if(args[0] === "all"){
await collection.updateOne({id: client.user.id}, {"white": []})
return client.createMessage(msg.channel.id, "**Done Delete all Blacklisted**")
}else{
let config = await collection.find({id: client.user.id})
if(config.length < 1 ) return;
let mentions = msg.mentions[0]
if(mentions) mentions = msg.mentions[0].id
if(!mentions) mentions = args[0]
var able2 = true
client.getRESTUser(mentions).catch(err =>{
able2 = false
}).then(async user =>{
if(!able2) return client.createMessage(msg.channel.id, `User Is Defined`)
if(!config[0].white.includes(user.id)) return client.createMessage(msg.channel.id, `I can't find this user in whitelist`)
let white = []
config[0].white.forEach(async users =>{
if(users !== user.id) white.unshift(users)
})
await collection.updateOne({id: client.user.id}, {"white": white})
return client.createMessage(msg.channel.id, "**Done Delete This User**")
})
}
}else//Here
if(commandName === "help"){
client.createMessage(msg.channel.id, {
  "embed": 
    {
      "title": "Premium Proof Bot ",
      "color": 1097758,
      "fields": [
        {
          "name": "**__General Commands__**",
          "value": "**`-` proof \n     To know how many time the bot have left\n\n `-` ping\n To know the ping of the bot**"
        },
        {
          "name": "**__Whitelist Commands__**",
          "value": "**`-` boost (name) (message)\n     To Make Nitro Boost Proof\n\n   `-` create-boost\n To Make Nitro Boost Proof Manualy\n\n `-` classic (name) (message)\n     To Make Nitro Classic Proof\n\n `-` Create-Classic\n To Make Nitro Classic Proof Manualy**"
        },
        {
          "name": "**__Owner Commands__**",
          "value": "**\n   `-` proof username (new name)\n      To Change Bot's Name\n\n   `-` proof avatar (avatar link)\n     To Change Bot's Avatar\n\n   `-` proof prefix (new prefix)\n     To Change Bot's Prefix\n\n   `-` proof game\n To Change The bot custom game\n\n `-` proof status\n To Choose ('online','idle','dnd','invisible')\n\n  `-` proof restart\n To restart the bot\n\n `-` add (mention)\n     To Add Someone To The Whitelist\n\n   `-` remove (mention)\n     To Remove Someone From The Whitelist\n\n `-` remove all\n To remove all the whitelist members\n\n   `-` proof Move (mention)\n     To Transfer The Ownership of The Bot to another one\n\n   `-` invite\n     To invite The Bot To your server**"
        }
      ],
      "footer": {
        "text": "To Buy The Bot Contact With Daddy.#8888"
      },
      "timestamp": new Date()
    }
  
})
}
if(commandName === "add"){

let config = await collection.find({id: client.user.id})
if(config.length < 1 || config[0].time - Date.now() < 1) return;
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)

let mentions = msg.mentions[0]
if(mentions) mentions = msg.mentions[0].id
if(!mentions) mentions = args[0]
var able1 = true
console.log(mentions)
client.getRESTUser(mentions).catch(err =>{
able1= false
  console.log(err.message)
}).then(async user =>{
if(!able1) return client.createMessage(msg.channel.id, `User Is Defined`)
if(config[0].white.includes(user.id)) return client.createMessage(msg.channel.id, `User Is Already add`)
let white = [user.id]
//if(config[0].white > 9) return client.createMessage(msg.channel.id, `Max of white list 10 Members`)
config[0].white.forEach(async users =>{
white.unshift(users)
})
await collection.updateOne({id: client.user.id}, {"white": white})
return client.createMessage(msg.channel.id, "**Done Add This User**")
})

}else

if(commandName === "proof"){
  if(args[0] === "prefix"){
let config = await collection.find({id: client.user.id})
if(config.length < 1 || config[0].time - Date.now() < 1) return;
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
client.createMessage(msg.channel.id, `**Done Set Prefix to ${args[1] || "$"}**`)
await collection.updateOne({id: client.user.id}, {"prefix": args[1] || "$"})
}else
if(args[0] === "restart"){
  if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
const child_process = require("child_process");
listen = true
client.createMessage(msg.channel.id, `**Restarting..**`).then(msg =>{
listen = true
        client.disconnect({reconnect: true})
listen = true
        child_process.fork(__dirname + "/index.js");
client.connect()
listen = true
msg.edit('**Done Restarting**')
})
listen = true
}
}
if(commandName === "invite"){
let config = await collection.find({id: client.user.id})
if(config.length < 1 ) return;
if(config[0].time - Date.now() < 1) return client.createMessage(msg.channel.id, `**You Must renew your bot to be able to use it**`)
if(config[0].owner !== message.author.id && msg.author.id !== "463208341804548097" && msg.author.id !== "535423612308422668") return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)

let dm = await message.author.getDMChannel().catch(err =>{ return client.createMessage(msg.channel.id, `**Open DM**`) })
var able = true
dm.createMessage(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&response_type=code&redirect_uri=https://setting-premium.glitch.me/invite&permissions=2080374975&state=${config[0].invite}`).catch(err =>{
able = false
}).then(m =>{
if(!able) return client.createMessage(message.channel.id, `Open DM`)
client.createMessage(message.channel.id, `Check DM`)
})
}
if(commandName === "create"){
let random = require('random-id-generator')
let config = await collection.find({id: client.user.id})
if(config.length < 1) {
if(msg.author.id !== "463208341804548097" && msg.author.id !== "535423612308422668") return;
if(!args[0] || !args[1]) return client.createMessage(msg.channel.id, `use: ${config.prefix}create [idowner] [time]`)
if(!ms(args[1])) return client.createMessage(msg.channel.id, `Time Is Defined`)
 new collection({id: client.user.id, owner: msg.author.id, guild: msg.channel.guild.id, time: Date.now() + ms(args[1]), invite: random(16)}).save();
 return client.createMessage(msg.channel.id, `Create Database of this bot`)
}else{
 return client.createMessage(msg.channel.id, `This Bot Already Created`)
}
}
if(commandName === "proof"){
if(!msg.member.permission.has("administrator")) return;

let config = await collection.find({id: client.user.id})
if(config.length < 1) return;
if(config[0].time - Date.now() < 1) return client.createMessage(msg.channel.id, `**You Must renew your bot to be able to use it**`)

if(args[0] === "move"){
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)

let user = message.mentions[0]

if(!user) return client.createMessage(message.channel.id, `Mention any user`);
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
     await client.createMessage(message.channel.id, `To Confirm Type  \`متاكد\` or \`sure\`
You Have 20 seconds
 `);
 
        let filter = (m) => m.content === "sure" && m.author.id === message.author.id || m.content === "متاكد" && m.author.id === message.author.id;
 
        let collector = new MessageCollector(client, message.channel, filter, {
            time: 1000 * 20
        });

        collector.on("collect", async (m) => {
 config = await collection.find({id: client.user.id})
if(config.length < 1) return;
if(config[0].time - Date.now() < 1) return client.createMessage(msg.channel.id, `**You Must renew your bot to be able to use it**`)
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
let random = require('random-id-generator')

await collection.updateOne({id: client.user.id}, {"owner": user.id, "invite": random(16)})
client.createMessage(message.channel.id, `**Succeeded Transfer Owner**`)

        });
}else
if(!args[0]){
client.createMessage(msg.channel.id, `**Purchase By** <@${config[0].owner}>\n**Ends In** ${pms(config[0].time - Date.now(), { verbose: true })}`)
}else
if(args[0] === "status"){
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
if(!args[1]) return client.createMessage(message.channel.id, `**select one please 'online', 'idle', 'dnd', 'offline'`)
let status = args[1].replace('offline', 'invisible')
let list = ['online','idle','dnd','invisible']
if(!list.includes(status)) return client.createMessage(message.channel.id, `**select one please 'online', 'idle', 'dnd', 'offline'`)
await client.editStatus(status, {
name: config[0].game,
type: 0, // 0 playing , 1 stream , 2 listen , 3 watch
url: null // رابط الستريم لو فيه
})
await collection.updateOne({id: client.user.id}, {"status": status})
client.createMessage(message.channel.id, `**Done Edit Status**`)
}
if(args[0] === "game"){
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
let status = args.slice(1).join(" ") || "[none]"
if(status === '[none]'){
//await setting.editgame("", data)
await collection.updateOne({id: client.user.id}, {"game": status})

client.editStatus( config[0].status, {
name: "",
type: 0, // 0 playing , 1 stream , 2 listen , 3 watch
url: null // رابط الستريم لو فيه
})
}else{
await collection.updateOne({id: client.user.id}, {"game": status})

client.editStatus(config[0].status, {
name: status,
type: 0, // 0 playing , 1 stream , 2 listen , 3 watch
url: null // رابط الستريم لو فيه
})
}
client.createMessage(message.channel.id, `**Done Edit Status**`)
}
if(args[0] === "avatar"){
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
let url = msg.attachments[0]
if(url) url = url.url
if(!url) url = args[1]
if(!url) return client.createMessage(msg.channel.id, `**خطا في الصورة!**`)

    try {

        const response = await got(url, { responseType: 'buffer' });
        const buffer = response.body;
var able = true
 client.createMessage(msg.channel.id, `Testing..`, [{file:buffer, name: "profile.jpg"}]).catch(err =>{
able = false
}).then(msgs =>{
msgs.delete()
if(!able) return client.createMessage(msg.channel.id, `**خطا في الصورة!**`)
imageToBase64(url).then((response) => {

client.editSelf({avatar: `data:text/plain;base64,` + response}).catch(err =>{
return client.createMessage(msg.channel.id, `**${err.message.replace('Invalid Form Body', '').replace('  avatar: ', '').replace('\n', '')}**`)
})
})
 })
    } catch (error) {
return client.createMessage(msg.channel.id, `**خطا في الصورة!**`)
    }

}

if(args[0] === "username"){
if(config[0].owner !== message.author.id) return client.createMessage(msg.channel.id, `**Just Owner Bot Can use This Command**`)
client.editSelf({username: args.slice(1).join(" ") || "Giveaway Bot"}).catch(err =>{
return client.createMessage(msg.channel.id, `**${err.message.replace('Invalid Form Body', '').replace('  username: ', '').replace('\n', '')}**`)
})
}
}else
if(commandName === "set"){
let config = await collection.find({id: client.user.id})
if(config.length < 1) return;
if(msg.author.id !== "463208341804548097" && msg.author.id !== "535423612308422668") return;
if(!ms(args[0])) return client.createMessage(msg.channel.id, `Time Is Defined`)
 await collection.updateOne({id: client.user.id}, {"time": ms(args[0]) + Date.now()})
 return client.createMessage(msg.channel.id, `Done`)
}

})
client.connect()