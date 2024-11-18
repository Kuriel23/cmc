const { ChalkAdvanced } = require("chalk-advanced");

module.exports = (client, interaction) => {
	if (interaction.isStringSelectMenu()) {
		if (interaction.customId.startsWith("accept"))
			return require("../menu/accept")(client, interaction);
		if (interaction.customId.startsWith("troll"))
			return require("../menu/troll")(client, interaction);
		require(`../menu/${interaction.customId}`)(client, interaction);
	}
	if (interaction.isButton()) {
		if (
			interaction.customId.includes("next") ||
			interaction.customId.includes("prev")
		)
			return;
		try {
			require(`../button/${interaction.customId}`)(client, interaction);
		} catch (error) {
			return 0;
		}
	}
	if (interaction.isChatInputCommand()) {
		const command = client.commands.get(interaction.commandName);
		if (!command) return;
		try {
			console.log(
				`${ChalkAdvanced.green(">")} ${ChalkAdvanced.gray(
					`/${interaction.commandName}`,
					interaction.options._hoistedOptions.map((a) => {
						return `${a.name}:${a.value}`;
					}),
				)}`,
			);
			command.execute(interaction, client);
		} catch (err) {
			if (err) console.error(err);
		}
	}
};
