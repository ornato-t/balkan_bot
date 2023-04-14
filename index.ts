import 'dotenv/config';
import { CommentStream, SubmissionStream } from 'snoostorm';
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

//Configure a comment stream
const posts = new SubmissionStream(r, {
    subreddit: 'balkans_irl',
});

const blacklist = ['SaveVideo', 'eazeaze']; //Fill this array with the names of the accounts that should be ignored 

run();

async function run() {
    console.log('Starting up...');
    if (c.DEBUG) console.log('Warning, DEBUG mode is ON');

    //Function executed for every comment
    comments.on('item', async comment => {
        if (blacklist.includes(comment.author.name)) return //Comment made by the bot itself, no time to lose here

        try {
            const flair = comment.author_flair_template_id;

            //If the user is unflaired insult them and tell them to flair up
            if (flair == null) {
                unflaired(comment);
            }

        } catch (e) { console.log(e) }
    });

    //Function executed for every post
    posts.on('item', async post => {
        const modComment = getImageBoard(); //Comment to be pinned

        const id = await reply(post, modComment);   //Reply to the comment and save the resulting ID
        if (id !== null) {
            const comment = r.getComment(id);
            pinComment(comment);
        }
    });
}

//Replies to a comment or a post, only if DEBUG mode is off. Return the id of the reply or null
async function reply(target: Snoowrap.Comment | Snoowrap.Submission, msg: string) {
    try {
        if (!c.DEBUG) {
            return target.reply(msg).then(res => res.id);
        } else {
            console.log(`DEBUG:\n${msg}`);
            return null;
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

/*  UNFLAIRED FUNCTIONS   */

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


/*  MOD MESSAGE FUNCTIONS   */

//Return the image board string
function getImageBoard() {
    const str = "Are you having fun browsing the sub? Well there is more stuff coming down the line including the official balkans_irl imageboard:\n\nhttps://www.reddit.com/r/balkans_irl/comments/10sl5hr/announcing_the_balkans_irl_imageboard/   \n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/balkans_irl) if you have any questions or concerns.*";

    return str;
}

//Distinguish a comment as moderator and pin it
function pinComment(comment: Snoowrap.Comment) {
    try {
        comment.distinguish({ status: true, sticky: true });
    } catch (e) {
        console.log(e);
    }
}
