const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (interaction) => {
	const user = await prisma.user.findUnique({
		where: { id: message.author.id },
	});
	if (!user) {
		await prisma.user.create({
			data: {
				id: message.author.id,
			},
		});
		return interaction.reply({
			content: "You have 2 duties today!",
			ephemeral: true,
		});
	}

	if (
		user.dutyDate.getDate() !== new Date.getDate() &&
		user.dutyDate.getMonth() !== new Date.getMonth()
	) {
		await prisma.user.update({
			where: { id: message.author.id },
			data: {
				duty: 2,
			},
		});
		return interaction.reply({
			content: "You have 2 duties today!",
			ephemeral: true,
		});
	}
	if (user.duty === 0)
		return interaction.reply({
			content: `You don't have more duties today!`,
			ephemeral: true,
		});
	return interaction.reply({
		content: `You have ${user.duty} duties today!`,
		ephemeral: true,
	});
};
