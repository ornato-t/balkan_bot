import 'dotenv/config';
import { CommentStream } from 'snoostorm';
import Snoowrap from 'snoowrap';

import noFlair from './modules/unflaired.js';
import c from './modules/const.js'

//Configure the Reddit client
const userAgent = 'balkan_bot v1.0.0; Replacing AutoModerator in r/balkans_irl, by u/Nerd02'
const r = new Snoowrap({
    userAgent,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

//Configure a comment stream
const comments = new CommentStream(r, {
    subreddit: 'balkans_irl',
});

const blacklist = ['SaveVideo', 'eazeaze']; //Fill this array with the names of the accounts that should be ignored 

run();

//Main function
async function run() {
    console.log('Starting up...');
    if (c.DEBUG) console.log('Warning, DEBUG mode is ON');

    //Function executed for every comment
    comments.on('item', async comment => {
        if (blacklist.includes(comment.author.name)) return //Comment made by the bot itself, no time to lose here

        try {
            const flair = comment.author_flair_template_id;

            if (flair == null) {
                unflaired(comment);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) { console.log(e.toString()) }
    });
}

//Sends a random message reminding users to flair up. Only answers in a percentage of cases
async function unflaired(comment: Snoowrap.Comment) {
    if (comment == undefined) return;

    //Pick an unflaired insult at random
    const rand = Math.floor(Math.random() * noFlair.length);

    //Only insult the unflaired in a % of cases. Configure the % in const.ts
    if (percentage(c.UNFLAIRED_PTG)) {
        console.log(`Unflaired: ${comment.author.name}`);

        reply(comment, noFlair[rand]);
    }
}

//RNG. Returns true n% of times, returns false otherwise
function percentage(n: number) {
    const rand = Math.floor(Math.random() * 100)

    if (rand < n) return true
    else return false
}

//Replies to a message, only if DEBUG mode is off
async function reply(comment: Snoowrap.Comment, msg: string) {
    try {
        if (!c.DEBUG) {
            comment.reply(msg);
        } else {
            console.log(`DEBUG:\n${msg}`);
        }
    } catch (e) {
        console.log(e);
    }
}
