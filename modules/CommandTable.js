const Help = require('./commands/Help');
const Ping = require('./commands/Ping');
const Invite = require('./commands/Invite');
const Profile = require('./commands/Profile');
const Respawn = require('./commands/Respawn');
const Report = require('./commands/Report');


const InitDatabase = require('./commands/admin/initDatabase');

const CommandTable = new Map(
    [
        ["help", Help.HelpCommand],
        ["aide", Help.HelpCommand],
        ["ping", Ping.PingCommand],
        ["invite", Invite.InviteCommand],
        ["profile", Profile.ProfileCommand],
        ["report", Report.ReportCommand],
        ["respawn", Respawn.RespawnCommand],

        ["init", InitDatabase.InitDatabaseCommand],
        
    ]
);

module.exports = CommandTable;