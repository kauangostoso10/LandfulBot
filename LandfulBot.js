const { Client, Collection } = require('discord.js')
const Fs = require('fs')

class LandfulBot extends Client {
    constructor (config, options = {}) {
        super(options)
        
        this.prefixes = Array.isArray(config.prefixes) ? config.prefixes : [config.prefixes]
        this.mentionPrefix = config.mentionPrefix || true
        this.commands = new Collection();

        this.initCommands('./commands');
        this.initListeners('./events');
    }

    initCommands (path) {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        const Command = require(filePath)
                        const commandName = file.replace(/.js/g, '').toLowerCase()
                        const command = new Command(commandName, this)
                        return this.commands.set(commandName, command)
                    }

                    let stats = Fs.lstatSync(filePath)
                    if (stats.isDirectory()) {
                        this.initCommands(filePath)
                    }
                } catch (error) {
                    console.error(error)
                }
            })
    } 
    
    initListeners (path) {
        Fs.readdirSync(path)
            .forEach(file => {
                try {
                    let filePath = path + '/' + file
                    if (file.endsWith('.js')) {
                        let Listener = require(filePath)
                        this.on(file.replace(/.js/g, ''), Listener)
                    }

                    let stats = Fs.lstatSync(filePath)
                    if (stats.isDirectory()) {
                        this.initListeners(filePath)
                    }            
                } catch (error) {
                    console.error(error)
                }
            })
    }
}

module.exports = LandfulBot
