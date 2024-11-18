const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	AttachmentBuilder,
} = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (client, message) => {
	if (message.author.bot) return;

	if (message.channel.id === "860407014488277022") {
		const user = await prisma.user.findUnique({
			where: { id: message.author.id },
		});
		if (
			user &&
			user.dutyDate.getDate() === new Date.getDate() &&
			user.dutyDate.getMonth() === new Date.getMonth() &&
			user.duty === 0
		)
			return message.reply("You don't have more dutys today.");
		if (message.attachments.size >= 2) {
			message.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(client.cor)
						.setTitle("Submission succeeded!")
						.setDescription(
							"Submission succeded! Your duty state is now in the processing queue. You'll be notified when your duty state has been accepted by one of our Officers!",
						),
				],
				components: [
					new ActionRowBuilder().setComponents(
						new ButtonBuilder()
							.setCustomId("pending_duties")
							.setLabel("View Pending Duties")
							.setStyle(ButtonStyle.Primary),
					),
				],
			});
			await prisma.user.upsert({
				create: {
					id: message.author.id,
					duty: 2,
					dutyDate: Date.now(),
				},
				update: {
					duty:
						user.dutyDate.getDate() === new Date.getDate() &&
						user.dutyDate.getMonth() === new Date.getMonth()
							? user.duty - 1
							: 1,
					dutyDate: Date.now(),
				},
				where: {
					id: message.author.id,
				},
			});
			client.channels.cache.get("").send({
				content: `\`\`\`Username: ${message.author.tag}\nDuty: ${message.content}\n\nScreenshot Started and Ended: Attached on message\`\`\``,
				files: [
					new AttachmentBuilder(message.attachments[0].proxyURL, {
						name: "started.png",
					}),
					new AttachmentBuilder(message.attachments[1].proxyURL, {
						name: "ended.png",
					}),
				],
				components: [
					new ActionRowBuilder().setComponents(
						new ButtonBuilder()
							.setCustomId(`accept-${message.author.id}`)
							.setLabel("Accept")
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId("reject")
							.setLabel("Reject")
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId(`troll-${message.author.id}`)
							.setLabel("Troll")
							.setStyle(ButtonStyle.Primary),
					),
				],
			});
		} else {
			return message.reply("Send at least 2 screenshots of the start and end.");
		}
	}
};
