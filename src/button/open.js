const {
	PermissionFlagsBits,
	ButtonStyle,
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
} = require("discord.js");

module.exports = async (client, interaction) => {
	const roles = interaction.guild.roles.cache;
	const tagger = interaction.user.tag;
	const channel = interaction.guild.channels.cache.find(
		(c) => c.name === tagger,
	);
	if (channel) {
		return interaction.reply({
			content: `You have a actual ticket opened on ${channel}.`,
			ephemeral: true,
		});
	}
	interaction.guild.channels
		.create({
			name: `${tagger}`,
			type: 0,
			permissionOverwrites: [
				...roles
					.filter(
						(element) =>
							element.rawPosition >=
							interaction.guild.roles.cache.find(
								(r) => r.id === "1253130730163408946",
							).rawPosition,
					)
					.map((element) => ({
						id: element.id,
						allow: [
							PermissionFlagsBits.ViewChannel,
							PermissionFlagsBits.SendMessages,
							PermissionFlagsBits.AttachFiles,
							PermissionFlagsBits.AddReactions,
						],
					})),
				{
					id: interaction.guild.id,
					deny: [PermissionFlagsBits.ViewChannel],
				},
				{
					id: interaction.user.id,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.AttachFiles,
						PermissionFlagsBits.AddReactions,
					],
				},
			],
		})
		.then((c) => {
			interaction.reply({
				content: `Your ticket has opened on ${c}.`,
				ephemeral: true,
			});

			const embed = new EmbedBuilder()
				.setColor(client.cor)
				.setDescription(
					`Howdy, ${tagger}, welcome to your ticket!\nWait some time to our team answer your report.`,
				);

			const botao = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("close")
					.setEmoji("🔒")
					.setLabel("Close Ticket")
					.setStyle(ButtonStyle.Secondary),
			);

			c.send({ embeds: [embed], components: [botao] }).then((msg) => msg.pin());
		});
};
