# balkan_bot
A bot replacing AutoModerator in r/balkans_irl, forked from [flairchange_bot](https://github.com/ornato-t/flairchange_bot).

## Unflaired insults
The bot replies to a percentage of unflaired users with a random message. The percentage can be configured in the `modules/const.ts` file. The messages are contained in the `modules/unflaired.ts` file.  
At the moment, the insults are copied from *flairchange_bot*.

## Sticky comments (replaces AutoModerator)
The bot replies to every submission with a comment providing a link to the balkans_irl imageboard. This comment is then distinguished as moderator and stickied.

## Configuration
The bot runs in a Node.js environment. Dependencies can be installed with `npm i`, the TypeScript code can then be compiled with `npm build` and then ran with `npm start`.

In order to operate, the bot requires the credentials of a Reddit account with moderator permissions on r/balkans_irl. These credentials can be saved in a `.env` file positioned in the root folder. The file needs to be structured as follows:
```env
CLIENT_ID=<Reddit application id>
CLIENT_SECRET=<Reddit application secret>
REDDIT_USER=<Reddit account username>
REDDIT_PASS=<Reddit account password>
```
