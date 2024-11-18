const discord = require("discord.js");
require("dotenv").config();
const client = new discord.Client({
	intents: Object.keys(discord.GatewayIntentBits).map((a) => {
		return discord.GatewayIntentBits[a];
	}),
	partials: [
		discord.Partials.Message,
		discord.Partials.Channel,
		discord.Partials.Reaction,
		discord.Partials.GuildMember,
		discord.Partials.ThreadMember,
		discord.Partials.User,
	],
	cacheWithLimits: {
		MessageManager: {
			sweepInterval: 300,
			sweepFilter: discord.Sweepers.filterByLifetime({
				lifetime: 60,
				getComparisonTimestamp: (m) => m.editedTimestamp ?? m.createdTimestamp,
			}),
		},
	},
});

client.cor = "#320404";
client.err = "https://i.imgur.com/gMNg2dx.png";
client.canais = {
	errors: "1047219857567010837",
};
client.msg = {
	embeds: {
		registro: new discord.EmbedBuilder()
			.setTitle("I made a new register for you.")
			.setDescription(
				"* What to do now?\n\nOnly run again this command!",
			)
			.setColor(client.cor),
		failedUser: new discord.EmbedBuilder()
			.setTitle("Unknown User.")
			.setColor(client.cor),
	},
	content: {
		invalid: "Woops! Something got wrong on my system.",
	},
};

process.on("unhandledRejection", (error) => {
	console.log(error);
	client.channels.cache
		.get(client.canais.errors)
		.send(`Erro detectado: \n${error}`);
});
process.on("uncaughtException", (error) => {
	console.log(error);
	client.channels.cache
		.get(client.canais.errors)
		.send(`Erro detectado: \n${error}`);
});

const boilerplateComponents = async () => {
	await require("./src/util/boilerplateClient")(client);
};

boilerplateComponents();
