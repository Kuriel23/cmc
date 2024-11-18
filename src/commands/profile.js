const Levels = require("discord-xp");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("View level and some stats!")
		.addUserOption((option) =>
			option
				.setName("member")
				.setDescription("Identify member")
				.setRequired(false),
		),
	async execute(interaction, client) {
		const membro =
			interaction.options.getMember("member") || interaction.member;

		const user = await Levels.fetch(membro.id, interaction.guild.id, true);

		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(client.cor)
					.setTitle(`${membro.user.tag} Profile`)
					.setDescription(
						`#${user.position || 999999} | Level ${user.level || 0}\n\n> Current XP: ${user.xp - Levels.xpFor(user.level)}\n> Required XP: ${Levels.xpFor(user.level + 1) - Levels.xpFor(user.level) || 100}`,
					),
			],
		});
	},
};
