module.exports = async (client, interaction) => {
	interaction
		.reply(
			`\\🔒 | ${interaction.user}, this ticket will be deleted in \`5 seconds\`...`,
		)
		.then(() => {
			setTimeout(() => {
				interaction.channel.delete();
			}, 5000);
		});
};
