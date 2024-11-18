const discord = require("discord.js");
const Levels = require("discord-xp");

module.exports = {
	data: new discord.SlashCommandBuilder()
		.setName("xp")
		.setDescription("Add or remove XP from users.")
		.addUserOption((option) =>
			option
				.setName("member")
				.setDescription("Identify member")
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName("amount").setDescription("Amount of XP").setRequired(true),
		)
		.addBooleanOption((option) =>
			option
				.setName("remove")
				.setDescription("If true, xp is removed. If false, xp is added."),
		)
		.setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
		const membro = interaction.options.getMember("member");
		const amount = interaction.options.getInteger("amount");
		const action = interaction.options.getBoolean("remove") || false;

		if (action) {
			await Levels.subtractXp(membro.id, interaction.guild.id, amount);
			return interaction.reply({
				content: `Removed ${amount}XP of ${membro.tag}.`,
			});
		}
		await Levels.appendXp(membro.id, interaction.guild.id, amount);
		return interaction.reply({
			content: `Added ${amount}XP of ${membro.tag}.`,
		});
	},
};
