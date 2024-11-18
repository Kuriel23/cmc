module.exports = async (interaction) => {
	interaction.fetchReply().delete();
	const memberId = interaction.customId.replace("troll-", "");
	await interaction.guild.members
		.fetch(memberId)
		.timeout(3 * 60 * 60 * 1000, "Trolling submissions");
	interaction.reply({
		content: "Rejected and muted for 3 hours!",
		ephemeral: true,
	});
};
