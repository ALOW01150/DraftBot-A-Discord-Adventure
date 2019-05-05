const DefaultValues = require('../utils/DefaultValues');
const sql = require("sqlite");

const Server = require('./Server')

sql.open("./modules/data/database.sqlite");

class ServerManager {

    constructor(sql) {
        this.sql = sql;
    }

    /**
     * Allow to get the prefix of the current server
     * @param {*} message - The message that caused the function to be called. Used to retrieve the server of the message
     */
    async getServerPrefix(message) {
        let serveur = await this.getServer(message);
        return serveur.prefix;
    }

    /**
     * Allow to get the current serveur
     * @param {*} message - The message that caused the function to be called. Used to retrieve the server of the message
     */
    getServer(message) {
        return sql.get(`SELECT * FROM server WHERE id ="${message.guild.id}"`).then(server => {
            if (!server) { //server is not in the database
                console.log(`serveur inconnu : ${message.guild.name}`);
                return this.getNewServer(message);
            } else { //server is in the database
                console.log(`server reconnu : ${message.guild.name}`);
                return new Server(server.id, server.prefix, server.language)
            }
        }).catch(error => { //there is no database
            console.error(error)
            return false;
        })
    }

    /**
    * Return a promise that will contain the server that correspond to the id
    * @param id - the id of the server that own the server
    * @returns {promise} - The promise that will be resolved into a server
    */
    getServerById(id) {
        return sql.get(`SELECT * FROM server WHERE id ="${id}"`).then(server => {
            if (!server) { //server is not in the database
                console.log(`Aucun serveur enregistré pour cette id: ${id}`);
                return 0;
            } else { //server is in the database
                console.log(`server reconnu : ${id}`);
                return new Server(server.id, server.prefix, server.lang)
            }
        }).catch(error => { //there is no database
            console.error(error)
            return false;
        })
    }

    /**
     * Return an server created from the defaul values and save it to the database
     * @param message - The message that caused the function to be called. Used to retrieve the server of the message
     * @returns {*} - A new server
     */
    getNewServer(message) {
        console.log('Generating a new server...');
        let server = new Server(message.guild.id, DefaultValues.server.prefix, DefaultValues.server.language);
        this.addServer(server);
        return server;
    }

    /**
     * Allow to save the current state of a server in the database
     * @param {*} server - The server that has to be saved
     */
    updateServer(server) {
        console.log("Updating server ...");
        sql.run(`UPDATE server SET id = ${server.id}, prefix = "${server.prefix}", language = "${server.language}"`).catch(console.error);
        console.log("Server updated !");
    }


    /**
     * Allow to save a new server in the database
     * @param {*} server - The server that has to be saved
     */
    addServer(server) {
        console.log("Creating server ...");
        sql.run(`INSERT INTO server (id, prefix, language) VALUES (${server.id},"${server.prefix}","${server.language}") `).catch(console.error);
        console.log("server created !");
    }


    /**
     * Allow to get the validation informations of a guild
     * @param {*} guilde - The guild that has to be checked
     */
    getValidationInfos(guilde) {
        let nbMembres = guilde.members.filter(member => !member.user.bot).size;
        let nbBot = guilde.members.filter(member => member.user.bot).size;
        let ratio = Math.round((nbBot / nbMembres) * 100);
        let validation = ":white_check_mark:";
        if (ratio > 30 || nbMembres < 30 || (nbMembres < 100 && ratio > 20)) {
            validation = ":x:";
        }
        else {
            if (ratio > 20 || nbBot > 15 || nbMembres < 100) {
                validation = ":warning:";
            }
        }
        return { validation, nbMembres, nbBot, ratio };
    }

}

module.exports = ServerManager;