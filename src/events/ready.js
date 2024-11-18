const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { readdirSync } = require("node:fs");
require("dotenv").config();
const { ChalkAdvanced } = require("chalk-advanced");
const discord = require("discord.js");
const Levels = require("discord-xp");
Levels.setURL(process.env.DB);

module.exports = async (client) => {
	const commandFiles = readdirSync("./src/commands/").filter((file) =>
		file.endsWith(".js"),
	);

	const commands = [];

	for (const file of commandFiles) {
		const command = require(`../commands/${file}`);
		commands.push(command.data.toJSON());
		client.commands.set(command.data.name, command);
	}

	const rest = new REST({
		version: "10",
	}).setToken(process.env.TOKEN);

	(async () => {
		try {
			await rest.put(Routes.applicationCommands(client.user.id), {
				body: commands,
			});
			console.log(
				`${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green(
					`Registered with sucess ${client.commands.size} global commands`,
				)}`,
			);
		} catch (err) {
			if (err) console.error(err);
		}
	})();
	client.user.setPresence({
		activities: [{ name: "A unique bot.", type: discord.ActivityType.Custom }],
	});
};
