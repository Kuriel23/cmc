const discord = require("discord.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
	data: new discord.SlashCommandBuilder()
		.setName("rank")
		.setDescription("View the XP rank!"),
	async execute(interaction, client) {
		await interaction.reply({ content: "Searching content..." });
		let page;
		let buttonname;
		let collector;
		await Search(1);
		async function Search(pagina) {
			let [waifu, totalPages] = await prisma.$transaction([
				prisma.levels.findMany({
					where: { xp: { gt: 0 } },
					orderBy: { xp: "desc" },
					skip: (pagina - 1) * 15,
					take: 15,
					select: {
						xp: true,
						userID: true,
						level: true,
					},
				}),
				prisma.levels.count({ where: { xp: { gt: 0 } } }),
			]);
			totalPages = Math.ceil(totalPages / 15);
			page = pagina;

			const str2 = Math.floor(Math.random() * 100);
			buttonname = str2;
			const antes = new discord.ButtonBuilder()
				.setCustomId(`${str2}prev`)
				.setEmoji("1065370746303553587")
				.setStyle(2)
				.setDisabled(pagina === 1);
			const depois = new discord.ButtonBuilder()
				.setCustomId(`${str2}next`)
				.setEmoji("1065370743526916096")
				.setStyle(2)
				.setDisabled(pagina === totalPages);
			const botao = new discord.ActionRowBuilder()
				.addComponents(antes)
				.addComponents(depois);
			const waifus = new discord.EmbedBuilder()
				.setTitle("🏆 » TOP 15 XP")
				.setFooter({
					text: `Page ${pagina} of ${totalPages} pages`,
				})
				.setColor(client.cor);
			if (waifu[0]) {
				const fields = waifu.map((w, index) => ({
					name: `${(pagina - 1) * 15 + (index + 1)}. ${
						interaction.guild.members.cache.get(w.userID)
							? interaction.guild.members.cache.get(w.userID).user.username
							: w.userID
					}`,
					value: `┣ 🧪 **XP**: ${w.xp
						.toLocaleString("en-US")
						.toString()}\n┗ 💹 **Level**: ${w.level.toString()}`,
					inline: true,
				}));

				waifus.addFields(...fields);
			}
			const mensagem = await interaction.editReply({
				content: null,
				embeds: [waifus],
				components: [botao],
			});
			const filter = (interaction) =>
				interaction.customId === `${buttonname}next` ||
				interaction.customId === `${buttonname}prev`;
			collector = mensagem.createMessageComponentCollector({
				filter,
				time: 300000,
			});
		}
		collector.on("collect", (i) => {
			if (i.user.id === interaction.member.id) {
				if (i.customId === `${buttonname}next`) {
					i.deferUpdate();
					Search(page + 1);
				}
				if (i.customId === `${buttonname}prev`) {
					i.deferUpdate();
					Search(page - 1);
				}
			} else {
				i.reply({
					content: client.msg.content.invalid,
					ephemeral: true,
				});
			}
		});
	},
};
