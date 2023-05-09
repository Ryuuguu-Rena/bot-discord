import fetch from 'node-fetch';
import WebSocket from 'ws';
import 'dotenv/config';
// let obj = {
//     op: 0, //?
//     d: {},
//     t: "Message Reaction Add"
//}

//let response = await fetch("https://discord.com/api/v10/guilds/1046491068880912455/members/692611850499784724", {


/*await fetch("https://discord.com/api/v10/guilds/1046491068880912455/members/692611850499784724/roles/1105498990281232455", {
    method: 'PUT',
    headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    }
})*/



let getTime = () => {
    let now = new Date();
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()} `
}

let heartbeatInterval, resumeGatewayUrl, session_id;
let response = await fetch("https://discord.com/api/gateway/bot", {
    method: 'GET',
    headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
    }
});
let data = await response.json();
console.log(data);
let maxConcurrency = data.session_start_limit.max_concurrency;

let url = data.url + '?v=10&encoding=json';
let socket = new WebSocket(url);

socket.onopen = () => {
    console.log(getTime() + '\x1b[35m[open]\x1b[0m connection is established')
}
socket.onmessage = async (event) => {
    console.log(getTime() + '\x1b[35m[message]\x1b[0m data is received');
    data = JSON.parse(event.data);
    console.log(data)
    if (data.op == 0){
        if (data.t == 'READY'){
            resumeGatewayUrl = data.d.resume_gateway_url;
            session_id = data.d.session_id
        }
        else if (data.t == 'MESSAGE_REACTION_ADD' && data.d.channel_id == '1105508293172002917' &&
            data.d.message_id == '1105508353024741527' && data.d.emoji.name == '🫢'){
            fetch(`https://discord.com/api/v10/guilds/1046491068880912455/members/
                ${data.d.user_id}/roles/1105498990281232455`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                }
            })
        }
        else if (data.t == 'MESSAGE_REACTION_REMOVE' && data.d.channel_id == '1105508293172002917' &&
            data.d.message_id == '1105508353024741527' && data.d.emoji.name == '🫢'){
            fetch(`https://discord.com/api/v10/guilds/1046491068880912455/members/
                ${data.d.user_id}/roles/1105498990281232455`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                }
            })
        }
    }
    else if (data.op == 10){
        heartbeatInterval = data.d.heartbeat_interval;
        let heartbeatObj = {
            op: 1,
            d: data.s
        };
        console.log(getTime() + '\x1b[35m[send]\x1b[0m sending heartbeat:');
        console.log(heartbeatObj);
        socket.send(JSON.stringify(heartbeatObj));
        let identifyingObj = {
            op: 2,
            d: {
                token: process.env.DISCORD_TOKEN,
                intents: 1025,
                properties: {
                    os: 'windows 10',
                    browser: 'myDisco',
                    device: 'myDisco'
                }
            }
        };
        console.log(getTime() + '\x1b[35m[send]\x1b[0m sending identifying:');
        console.log(identifyingObj);
        socket.send(JSON.stringify(identifyingObj));
    }
    else if (data.op == 11){
        let delay = Math.random() * heartbeatInterval;
        setTimeout(() => {
            let heartbeatObj = {
                op: 1,
                d: data.s
            };
            console.log(getTime() + `\x1b[35m[send]\x1b[0m sending heartbeat(${delay})`);
            console.log(heartbeatObj);
            socket.send(JSON.stringify(heartbeatObj))
        }, delay)
    }

}
socket.onclose = (event) => {
    console.log(getTime() + '\x1b[35m[close]\x1b[0m connection is closed with code ' + event.code);
}


/*let socket = new WebSocket(url);

socket.onopen = () => {
    console.log('\x1b[35m[open]\x1b[0m connection is established')
}

let hearbeatInterval

socket.onmessage = async (event) => {
    console.log('\x1b[35m[message]\x1b[0m data is received');
    data = await JSON.parse(event.data);
    console.log(data);
    hearbeatInterval = data.d.heartbeat_interval;
}    

console.log(hearbeatInterval);


socket.onclose = (event) => {
    console.log('\x1b[35m[close]\x1b[0m connection is closed with code ' + event.code);
}/*





/*let res = await fetch("https://discord.com/api/gateway");
let data = await res.json();
const url = data.url + '?v=10&encoding=json';
console.log(data);

let socket = new WebSocket(url);

socket.onopen = () => {
    console.log('\x1b[35m[open]\x1b[0m connection is established')
}

let hearbeatInterval

socket.onmessage = async (event) => {
    console.log('\x1b[35m[message]\x1b[0m data is received');
    data = await JSON.parse(event.data);
    console.log(data);
    hearbeatInterval = data.d.heartbeat_interval;
}    

console.log(hearbeatInterval);


socket.onclose = (event) => {
    console.log('\x1b[35m[close]\x1b[0m connection is closed with code ' + event.code);
}*/

// console.log('\x1b[35m[open]\x1b[0m');