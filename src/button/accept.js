const Levels = require("discord-xp");

module.exports = async (interaction) => {
	interaction.fetchReply().delete();
	await Levels.appendXp(
		interaction.customId.replace("accept-", ""),
		interaction.guild.id,
		500,
	);
    interaction.reply({ content: "Accepted and added 500 XP!", ephemeral: true });
};
