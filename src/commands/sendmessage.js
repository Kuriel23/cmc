const discord = require("discord.js");

module.exports = {
	data: new discord.SlashCommandBuilder()
		.setName("send_embed")
		.setDescription("Send a embed on channel!")
		.setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageGuild)
		.addStringOption((option) =>
			option
				.setName("embed")
				.setRequired(true)
				.setDescription("Choose a embed")
				.addChoices({ name: "ticket", value: "ticket" }),
		),
	async execute(interaction, client) {
		const choice = interaction.options.getString("embed");
		interaction.reply({ content: "Done.", ephemeral: true });
		if (choice === "ticket") {
			interaction.channel.send({
				embeds: [
					new discord.EmbedBuilder()
						.setColor(client.cor)
						.setTitle("Ticket System")
						.setDescription("Open a ticket to report players."),
				],
				components: [
					new discord.ActionRowBuilder().addComponents(
						new discord.ButtonBuilder()
							.setCustomId("open")
							.setLabel("Open A Ticket")
							.setEmoji("✉️")
							.setStyle(discord.ButtonStyle.Primary),
					),
				],
			});
		}
	},
};
